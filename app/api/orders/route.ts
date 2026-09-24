// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/utils/database';
import type { OrderStatus } from '@prisma/client';
import type { OrderResponse } from '@/lib/types';

export async function GET(
  req: NextRequest
): Promise<NextResponse<OrderResponse>> {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { orders: [], totalCount: 0, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const start = Number(searchParams.get('start') || 0);
    const end = Number(searchParams.get('end') || 20);
    const search = searchParams.get('search') || '';

    // ====== ساخت where ======
    const where: any = {
      userId: session.user.id,
    };

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderCode: { contains: search, mode: 'insensitive' } },
        { recipient: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // ====== دریافت سفارشات ======
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: start,
        take: end - start,
      }),
      prisma.order.count({ where }),
    ]);

    // ====== تبدیل به فرمت موردنیاز ======
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderCode: order.orderCode,
      status: order.status,
      total: order.total,
      paymentId: order.paymentId,
      paymentDate: order.paymentDate?.toISOString() || null,
      recipient: order.recipient,
      phone: order.phone,
      address: order.address,
      notes: order.notes,
      adminNote: order.adminNote,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        originalPrice: item.originalPrice,
        discount: item.discount,
        productId: item.productId,
        colorId: item.colorId,
        productName: item.productName,
        productSlug: item.productSlug,
        productImage: item.productImage,
        colorName: item.colorName,
        colorHex: item.colorHex,
      })),
    }));

    return NextResponse.json({
      orders: formattedOrders,
      totalCount,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { orders: [], totalCount: 0, error: 'Internal server error' },
      { status: 500 }
    );
  }
}