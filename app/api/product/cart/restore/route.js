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

    // Get user's cart items from database with proper filtering
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
        // Only include items where product exists and color exists
        product: {
          id: { not: undefined }
        },
        color: {
          status: "EXISTENT", // Only include colors that are still available
          stocks: { gt: 0 }   // Only include colors with stock > 0
        }
      },
      include: {
        product: {
          include: {
            colors: {
              where: {
                status: "EXISTENT"
              }
            }
          }
        },
        color: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Filter out items where product or color no longer exists
    const validItems = cartItems.filter(item => 
      item.product && 
      item.color && 
      item.color.status === "EXISTENT" &&
      item.color.stocks > 0
    );

    // Convert to format expected by frontend
    const items = validItems.map(item => ({
      id: item.id,
      productId: item.productId,
      colorId: item.colorId,
      quantity: Math.min(item.quantity, item.color.stocks), // Don't exceed available stock
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

    // Update quantities in database if they were adjusted due to stock limitations
    for (const item of items) {
      if (item.quantity !== cartItems.find(c => c.id === item.id)?.quantity) {
        await prisma.cartItem.update({
          where: { id: item.id },
          data: { quantity: item.quantity }
        });
      }
    }

    // Remove cart items for deleted products or unavailable colors
    const invalidItems = cartItems.filter(item => 
      !item.product || 
      !item.color || 
      item.color.status !== "EXISTENT" ||
      item.color.stocks <= 0
    );

    if (invalidItems.length > 0) {
      await prisma.cartItem.deleteMany({
        where: {
          id: {
            in: invalidItems.map(item => item.id)
          }
        }
      });
    }

    return NextResponse.json({ 
      items,
      count: items.length,
      removedCount: invalidItems.length // Number of invalid items removed
    });
  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json({ error: "Restore failed" }, { status: 500 });
  }
}

// New endpoint for syncing cart with database
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items format" }, { status: 400 });
    }

    // Clear existing cart items for this user
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id }
    });

    // Add new items with validation
    const validItems = [];
    for (const item of items) {
      if (!item.productId || !item.colorId || !item.quantity) continue;

      // Check if product and color still exist
      const color = await prisma.color.findUnique({
        where: {
          id: item.colorId,
          productId: item.productId,
          status: "EXISTENT"
        },
        include: {
          product: true
        }
      });

      if (color && color.product && color.stocks > 0) {
        validItems.push({
          userId: session.user.id,
          productId: item.productId,
          colorId: item.colorId,
          quantity: Math.min(item.quantity, color.stocks)
        });
      }
    }

    if (validItems.length > 0) {
      await prisma.cartItem.createMany({
        data: validItems,
        skipDuplicates: true
      });
    }

    return NextResponse.json({ 
      success: true,
      syncedItems: validItems.length,
      totalRequested: items.length
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}