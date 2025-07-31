import { NextResponse } from "next/server";
import { auth } from "@auth";
import { prisma } from "@utils/database";
// export const dynamic = "force-dynamic"; 
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: order.status,
      orderId: order.id,
      amount: order.total,
      paymentId: order.paymentId,
      paymentDate: order.paymentDate
    });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}