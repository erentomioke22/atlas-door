// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/utils/database";

// export async function GET(req: NextRequest): Promise<NextResponse> {
//   try {
//     const { searchParams } = new URL(req.url);
//     const authority = searchParams.get('Authority');
//     const status = searchParams.get('Status');
//     const orderId = searchParams.get('orderId');

//     if (status === 'OK' && orderId) {
//       // Get order details first
//       const order = await prisma.order.findUnique({ 
//         where: { id: orderId },
//         include: {
//           items: {
//             include: {
//               product: true
//             }
//           }
//         }
//       });

//       if (!order) {
//         return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`);
//       }

//       // Verify payment with Zarinpal
//       const response = await fetch('https://api.zarinpal.com/pg/v4/payment/verify.json', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           merchant_id: process.env.ZARINPAL_MERCHANT_ID,
//           authority: authority,
//           amount: order.total,
//         }),
//       });

//       const data = await response.json();

//       if (data.data.code === 100) {
//         // Update order status
//         await prisma.order.update({
//           where: { id: orderId },
//           data: {
//             status: 'PAID',
//             paymentId: data.data.ref_id,
//             paymentDate: new Date(),
//           },
//         });

//         // Create notifications for each product seller
//         // const uniqueSellerIds = [...new Set(order.items.map(item => item.product.sellerId))];
//         const uniqueSellerIds = Array.from(new Set(order.items.map(item => item.product.sellerId)));
        
//         for (const sellerId of uniqueSellerIds) {
//           if (sellerId !== order.userId) {
//             await prisma.notification.create({
//               data: {
//                 issuerId: sellerId,
//                 recipientId: order.userId,
//                 productId: order.items.find(item => item.product.sellerId === sellerId)?.productId,
//                 type: "PAID",
//               },
//             });
//           }
//         }

//         return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`);
//       }
//     }

//     return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`);
//   } catch (error) {
//     console.error('Payment verification error:', error);
//     return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`);
//   }
// }

// app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/database';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const authority = searchParams.get('Authority');
    const status = searchParams.get('Status');
    const orderId = searchParams.get('orderId');

    if (status === 'OK' && orderId) {
      // ====== ۱. دریافت سفارش از Prisma ======
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,  // ✅ فقط items، نه product
        },
      });

      if (!order) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`
        );
      }

      // ====== ۲. تایید پرداخت با زرین‌پال ======
      const response = await fetch(
        'https://api.zarinpal.com/pg/v4/payment/verify.json',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            merchant_id: process.env.ZARINPAL_MERCHANT_ID,
            authority: authority,
            amount: order.total,
          }),
        }
      );

      const data = await response.json();

      if (data.data.code === 100) {
        // ====== ۳. آپدیت وضعیت سفارش ======
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            paymentId: String(data.data.ref_id),
            paymentDate: new Date(),
          },
        });

        // ====== ۴. دریافت فروشنده‌ها از Sanity ======
        const productIds = Array.from(
          new Set(order.items.map((item) => item.productId))
        );

        // ✅ کوئری Sanity برای دریافت seller
        const products = await client.fetch<
          Array<{
            _id: string;
            seller: { _id: string } | null;
          }>
        >(
          groq`*[_type == "product" && _id in $productIds] {
            _id,
            "seller": seller->{ _id }
          }`,
          { productIds }
        );

        // ====== ۵. ساخت نوتیفیکیشن برای فروشنده‌ها ======
        const uniqueSellerIds = Array.from(
          new Set(
            products
              .map((p) => p.seller?._id)
              .filter((id): id is string => !!id)
          )
        );

        for (const sellerId of uniqueSellerIds) {
          if (sellerId !== order.userId) {
            // پیدا کردن productId مرتبط با این فروشنده
            const relatedProduct = products.find(
              (p) => p.seller?._id === sellerId
            );

            if (relatedProduct) {
              await prisma.notification.create({
                data: {
                  issuerId: sellerId,
                  recipientId: order.userId,
                  type: 'PAID',
                  targetType: 'order',      // ✅
                  targetId: order.id,       // ✅
                },
              });
            }
          }
        }

        // ====== ۶. ریدایرکت به صفحه موفقیت ======
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`
        );
      }
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`
    );
  }
}