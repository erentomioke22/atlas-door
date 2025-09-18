import { NextResponse } from "next/server";
import { prisma } from "@utils/database";
// export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const authority = searchParams.get('Authority');
    const status = searchParams.get('Status');
    const orderId = searchParams.get('orderId');

    if (status === 'OK') {
      // Verify payment with Zarinpal
      const response = await fetch('https://api.zarinpal.com/pg/v4/payment/verify.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          authority: authority,
          amount: (await prisma.order.findUnique({ where: { id: orderId } })).total,
        }),
      });

      const data = await response.json();

      if (data.data.code === 100) {
        
        const [successBuy] = await prisma.$transaction([
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'PAID',
              paymentId: data.data.ref_id,
              paymentDate: new Date(),
            },
          }),
          ...( product?.sellerId !== userId
            ? [
                prisma.notification.create({
                  data: {
                    issuerId: product?.sellerId,
                    recipientId: userId,
                    productId: product?.id,
                    type: "PAID",
                  },
                }),
              ]
            : []),
        ]);


        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`);
      }
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`);
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`);
  }
}