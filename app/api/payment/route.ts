// app/api/payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/utils/database';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { writeClient } from '@/sanity/lib/write-client';

interface PaymentRequest {
  user: string;
  phone: string;
  address: string;
  rule: 'direct' | 'gateway';
  items: Array<{
    productId: string;
    colorId: string;
    quantity: number;
  }>;
  notes?: string;
}

function generateOrderCode(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `AT-${y}${m}${d}-${rand}`;
}

async function getUniqueOrderCode(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const code = generateOrderCode();
    const exists = await prisma.order.findUnique({
      where: { orderCode: code },
    });
    if (!exists) return code;
  }
  return `AT-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2, 6)
    .toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'غیر قابل دسترسی' },
        { status: 401 }
      );
    }

    const body: PaymentRequest = await req.json();
    const { user, phone, address, rule, items, notes } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'سبد خرید خالی است' },
        { status: 400 }
      );
    }

    // ✅ 1. دریافت اطلاعات محصولات از Sanity
    const productIds = Array.from(new Set(items.map((i) => i.productId)));

    const products = await client.fetch<
      Array<{
        _id: string;
        name: string;
        slug: string;
        images: string[];
        colors: Array<{
          _key: string;
          color: string;
          hexCode?: string;
          price: number;
          discount: number;
          stock: number;
        }>;
      }>
    >(
      groq`*[_type == "product" && _id in $productIds] {
        _id,
        name,
        "slug": slug.current,
        "images": images[].asset->url,
        colors[] {
          _key,
          color,
          hexCode,
          price,
          discount,
          stock
        }
      }`,
      { productIds }
    );

    // ✅ 2. اعتبارسنجی و ساخت orderItems
    const orderItems: Array<{
      productId: string;
      colorId: string;
      quantity: number;
      price: number;
      originalPrice: number;
      discount: number;
      productName: string;
      productSlug: string;
      productImage: string | null;
      colorName: string;
      colorHex: string | null;
    }> = [];

    let totalAmount = 0;

    for (const item of items) {
      const product = products.find((p) => p._id === item.productId);
      if (!product) {
        return NextResponse.json(
          {
            success: false,
            error: `محصول با شناسه ${item.productId} یافت نشد`,
          },
          { status: 400 }
        );
      }

      const color = product.colors.find((c) => c._key === item.colorId);
      if (!color) {
        return NextResponse.json(
          {
            success: false,
            error: `رنگ انتخابی برای ${product.name} یافت نشد`,
          },
          { status: 400 }
        );
      }

      // بررسی موجودی
      if (color.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `موجودی ${product.name} (${color.color}) کافی نیست. موجودی: ${color.stock}`,
          },
          { status: 400 }
        );
      }

      const discount = color.discount || 0;
      const finalPrice = color.price - (color.price * discount) / 100;

      orderItems.push({
        productId: item.productId,
        colorId: item.colorId,
        quantity: item.quantity,
        price: finalPrice,
        originalPrice: color.price,
        discount,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.images?.[0] || null,
        colorName: color.color,
        colorHex: color.hexCode || null,
      });

      totalAmount += finalPrice * item.quantity;
    }

    const orderCode = await getUniqueOrderCode();

    // ✅ 3. ایجاد سفارش
    if (rule === 'direct') {
      const order = await prisma.order.create({
        data: {
          userId: session.user.id,
          recipient: user,
          phone,
          address,
          total: totalAmount,
          status: 'PENDING',
          orderCode,
          notes: notes || null,
          items: {
            create: orderItems,
          },
        },
        include: { items: true },
      });

      // ✅ 4. کاهش موجودی در Sanity
      for (const item of orderItems) {
        const product = products.find((p) => p._id === item.productId);
        if (!product) continue;
  
        const colorIndex = product.colors.findIndex(
          (c) => c._key === item.colorId
        );
        if (colorIndex === -1) continue;
  
        const newStock = product.colors[colorIndex].stock - item.quantity;
  
        // ✅ از writeClient استفاده کن نه client
        await writeClient
          .patch(item.productId)
          .set({
            [`colors[${colorIndex}].stock`]: Math.max(0, newStock),
          })
          .commit();
      }

      // ✅ 5. نوتیفیکیشن
      await prisma.notification.create({
        data: {
          recipientId: session.user.id,
          issuerId: session.user.id, // سیستم
          type: 'ORDER',
          targetType: 'order',
          targetId: order.id,
        },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderCode: order.orderCode,
        message: 'سفارش شما با موفقیت ثبت شد',
      });
    }

    // ====== پرداخت آنلاین ======
    if (rule === 'gateway') {
      const order = await prisma.order.create({
        data: {
          userId: session.user.id,
          recipient: user,
          phone,
          address,
          total: totalAmount,
          status: 'PENDING',
          orderCode,
          notes: notes || null,
          items: {
            create: orderItems,
          },
        },
        include: { items: true },
      });

      const response = await fetch(
        'https://api.zarinpal.com/pg/v4/payment/request.json',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchant_id: process.env.ZARINPAL_MERCHANT_ID,
            amount: totalAmount,
            callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify?orderId=${order.id}`,
            description: `Order #${order.orderCode}`,
          }),
        }
      );

      const data = await response.json();

      if (data.data.code === 100) {
        // ✅ کاهش موجودی در Sanity
        for (const item of orderItems) {
          const product = products.find((p) => p._id === item.productId);
          if (!product) continue;

          const colorIndex = product.colors.findIndex(
            (c) => c._key === item.colorId
          );
          if (colorIndex === -1) continue;

          const newStock = product.colors[colorIndex].stock - item.quantity;

          await client
            .patch(item.productId)
            .set({
              [`colors[${colorIndex}].stock`]: Math.max(0, newStock),
            })
            .commit();
        }

        return NextResponse.json({
          success: true,
          paymentUrl: `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`,
          orderCode: order.orderCode,
        });
      } else {
        // پاک کردن سفارش در صورت خطا
        await prisma.order.delete({ where: { id: order.id } });
        return NextResponse.json(
          { success: false, error: 'Payment initialization failed' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid payment rule' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}