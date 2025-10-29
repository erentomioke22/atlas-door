import { prisma } from "@/utils/database";
import { getServerSession } from "@/lib/get-session";
import { getProductDataInclude, getUserDataSelect } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ type: string }>;
}

interface OrdersResponse {
  orders: any[];
  nextCursor?: string | null;
}

type OrderType = "bag" | "orders" | "delivered" | "admin";

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<OrdersResponse | { error: string }>> {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { type } = await params;
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const q = req.nextUrl.searchParams.get("q") || undefined;
    const pageSize = 10;

    if (type === "admin" && session?.user.role !== "admin") {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    let orders: any[];

    switch (type as OrderType) {
      case "bag":
        orders = await prisma.cartItem.findMany({
          where: {
            userId: session?.user?.id,
          },
          include: {
            product: {
              include: getProductDataInclude(session?.user?.id),
            },
            user: {
              select: getUserDataSelect(session?.user?.id),
            },
            color: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        break;
      case "orders":
        orders = await prisma.order.findMany({
          where: {
            userId: session?.user?.id,
          },
          include: {
            items: {
              include: {
                product: {
                  include: getProductDataInclude(session?.user?.id),
                },
                color: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        break;
      case "delivered":
        orders = await prisma.order.findMany({
          where: {
            userId: session?.user?.id,
            status: "DELIVERED",
          },
          include: {
            items: {
              include: {
                product: {
                  include: getProductDataInclude(session?.user?.id),
                },
                color: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        break;
      case "admin":
        orders = await prisma.order.findMany({
          where: q
            ? {
                orderCode: {
                  contains: q,
                  mode: "insensitive",
                },
              }
            : undefined,
          include: {
            items: {
              include: {
                product: {
                  include: getProductDataInclude(session?.user?.id),
                },
                color: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
          skip: cursor ? 1 : 0,
        });
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }


    if (type === "admin") {
      const nextCursor = orders.length > pageSize ? orders[pageSize].id : null;

      return NextResponse.json({
        orders: orders.slice(0, pageSize),
        nextCursor,
      });
    } else {
      return NextResponse.json({ orders });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
