import { NextResponse } from "next/server";
import { auth } from "@auth";
import { prisma } from "@utils/database";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get cart items for the user
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: true
      }
    });

    if (!cartItems.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: totalAmount,
        status: "PENDING",
        items: {
          create: cartItems.map(item => ({
            quantity: item.quantity,
            price: item.product.price,
            productId: item.product.id
          }))
        }
      }
    });

    // Initialize Zarinpal payment
    const response = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount: totalAmount,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify?orderId=${order.id}`,
        description: `Order #${order.id}`,
      }),
    });

    const data = await response.json();

    if (data.data.code === 100) {
      // Clear cart after successful order creation
      await prisma.cartItem.deleteMany({
        where: {
          userId: session.user.id
        }
      });

      return NextResponse.json({
        success: true,
        paymentUrl: `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`
      });
    } else {
      return NextResponse.json({ error: "Payment initialization failed" }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}