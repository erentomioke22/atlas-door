import { prisma } from "@utils/database";
import { auth } from "@auth";
import { getProductDataInclude } from "@lib/types";

export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return Response.json({ error: "Order ID and status are required" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
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

    return Response.json({ order: updatedOrder });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}