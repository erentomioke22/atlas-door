import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    orderId: string;
  }>;
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await getServerSession();
    if (!session || session?.user?.role !== "admin") {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { orderId } = resolvedParams;
    
    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.order.delete({ where: { id: orderId } });

    return NextResponse.json({ success: true, id: orderId });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
