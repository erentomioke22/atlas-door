// app/api/cart/restore/route.js - نسخه بهبود یافته
import { NextResponse } from "next/server";
import { auth } from "@auth";
import { prisma } from "@utils/database";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's cart items from database
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: {
          include: {
            colors: true
          }
        },
        color: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Convert to format expected by frontend
    const items = cartItems.map(item => ({
      id: item.id,
      productId: item.productId,
      colorId: item.colorId,
      quantity: item.quantity,
      createdAt: item.createdAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        desc: item.product.desc,
        images: item.product.images,
        colors: item.product.colors
      },
      color: {
        id: item.color?.id,
        name: item.color?.name,
        hexCode: item.color?.hexCode,
        price: item.color?.price,
        discount: item.color?.discount,
        stocks: item.color?.stocks
      }
    }));

    return NextResponse.json({ 
      items,
      count: items.length 
    });
  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json({ error: "Restore failed" }, { status: 500 });
  }
}