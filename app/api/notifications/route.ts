import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/utils/database";
import { notificationsInclude } from "@/lib/types";

interface NotificationsResponse {
  notifications: any[];
  nextCursor: string | null;
  unreadCount: number;
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<NotificationsResponse | { error: string }>> {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: session?.user?.id,
      },
      include: notificationsInclude,
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: session?.user?.id,
        read: false,
      },
    });

    const nextCursor =
      notifications.length > pageSize ? notifications[pageSize].id : null;

    const data: NotificationsResponse = {
      notifications: notifications.slice(0, pageSize),
      nextCursor,
      unreadCount,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.notification.deleteMany({
      where: {
        recipientId: session?.user?.id,
      },
    });

    return new NextResponse();
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
