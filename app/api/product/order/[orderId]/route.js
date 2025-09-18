import { auth } from "@auth";
import { prisma } from "@utils/database";

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    if (!orderId) {
      return Response.json({ error: "orderId is required" }, { status: 400 });
    }

    // Ensure order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true },
    });
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Delete items then the order (in case cascade isn't configured)
    // await prisma.orderItem.deleteMany({ where: { orderId } });
    await prisma.order.delete({ where: { id: orderId } });

    return Response.json({ success: true, id: orderId });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}