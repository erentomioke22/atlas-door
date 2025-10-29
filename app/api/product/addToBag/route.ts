import { prisma } from "@/utils/database";
import { getServerSession } from "@/lib/get-session";
import { NextRequest, NextResponse } from "next/server";

interface CartItemResponse {
  data: {
    isCarted: boolean;
  };
  userId?: string;
  id: string;
}

interface UpdateQuantityRequest {
  quantity: number;
}

async function checkStock(
  userId: string, 
  productId: string, 
  colorId: string, 
  requestedQuantity: number, 
  isUpdate: boolean = false
): Promise<boolean> {
  const color = await prisma.color.findUnique({
    where: { 
      id: colorId,
      productId: productId
    },
    select: {
      stocks: true,
      product: {
        select: {
          id: true
        }
      }
    }
  });

  if (!color) {
    throw new Error("Color not found for this product");
  }

  const colorStock = color.stocks || 0;
  
  if (colorStock === 0) {
    throw new Error("This color is out of stock");
  }

  // Get current cart quantity for this user
  const currentCartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId_colorId: {
        userId,
        productId,
        colorId
      }
    },
    select: { quantity: true }
  });

  // Get total quantity in all carts for this color
  const totalCartQuantity = await prisma.cartItem.aggregate({
    where: {
      productId,
      colorId,
      userId: {
        not: userId // Exclude current user's cart
      }
    },
    _sum: {
      quantity: true
    }
  });

  // Get total quantity in all orders for this color
  const totalOrderQuantity = await prisma.orderItem.aggregate({
    where: {
      productId,
      colorId,
      order: {
        status: {
          in: ['PENDING', 'PAID'] // Only count items in pending or paid orders
        }
      }
    },
    _sum: {
      quantity: true
    }
  });

  const currentQuantity = currentCartItem?.quantity || 0;
  const otherCartsQuantity = totalCartQuantity._sum.quantity || 0;
  const orderQuantity = totalOrderQuantity._sum.quantity || 0;
  
  // Calculate available stock by subtracting items in other carts and orders
  const availableStock = colorStock - otherCartsQuantity - orderQuantity;
  
  // For update, we need to add back the current user's cart quantity
  const newTotalQuantity = isUpdate ? requestedQuantity : (currentQuantity + requestedQuantity);

  if (requestedQuantity > availableStock) {
    throw new Error(`Only ${availableStock} items available in stock for this color`);
  }

  return true;
}

export async function GET(req: NextRequest): Promise<NextResponse<CartItemResponse | { error: string }>> {
  try {
    const productId = req.nextUrl.searchParams.get('productId');
    const colorId = req.nextUrl.searchParams.get('colorId');
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (!productId || !colorId) {
      return NextResponse.json({ error: "Product ID and Color ID are required" }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_colorId: {
          userId: session.user.id,
          productId,
          colorId,
        },
      },
    });

    return NextResponse.json({ 
      data: { isCarted: !!cartItem },
      userId: session.user?.id ?? '', 
      id: productId 
    } as CartItemResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const productId = req.nextUrl.searchParams.get('productId');
    const colorId = req.nextUrl.searchParams.get('colorId');
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (!productId || !colorId) {
      return NextResponse.json({ error: "Product ID and Color ID are required" }, { status: 400 });
    }
    
    await checkStock(session.user?.id, productId, colorId, 1);

    await prisma.cartItem.upsert({
      where: {
        userId_productId_colorId: {
          userId: session.user?.id,
          productId,
          colorId,
        },
      },
      create: {
        userId: session.user!.id,
        productId,
        colorId,
        quantity: 1,
      },
      update: {
        quantity: {
          increment: 1
        }
      }
    });

    return new NextResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const productId = req.nextUrl.searchParams.get('productId');
    const colorId = req.nextUrl.searchParams.get('colorId');

    if (!productId || !colorId) {
      return NextResponse.json({ error: "Product ID and Color ID are required" }, { status: 400 });
    }

    const session = await getServerSession();
    const { quantity }: UpdateQuantityRequest = await req.json();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
    }

    await checkStock(session.user?.id, productId, colorId, quantity, true);

    await prisma.cartItem.upsert({
      where: {
        userId_productId_colorId: {
          userId: session.user?.id,
          productId,
          colorId
        },
      },
      create: {
        userId: session.user?.id,
        productId: productId,
        colorId,
        quantity,
      },
      update: {
        quantity,
      }
    });

    return new NextResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const productId = req.nextUrl.searchParams.get('productId');
    const colorId = req.nextUrl.searchParams.get('colorId');
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!productId || !colorId) {
      return NextResponse.json({ error: "Product ID and Color ID are required" }, { status: 400 });
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user?.id,
        productId,
        colorId
      },
    });

    return new NextResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}