import { prisma } from "@/utils/database";
import { getServerSession } from "@/lib/get-session";
import { getProductDataInclude } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

interface UpdateOrderRequest {
  orderId: string;
  status: string;
}

interface UpdateOrderResponse {
  order: any;
}

export async function PATCH(
  req: NextRequest
): Promise<NextResponse<UpdateOrderResponse | { error: string }>> {
  try {
    const session = await getServerSession();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status }: UpdateOrderRequest = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: {
        items: {
          include: {
            product: {
              include: getProductDataInclude(session?.user.id),
            },
            color: true,
          },
        },
      },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
