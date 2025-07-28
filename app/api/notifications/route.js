import { auth } from "@auth";
import { prisma } from "@utils/database";
import { notificationsInclude, NotificationsPage } from "@/lib/types";

export async function GET(req) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const session = await auth();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: session?.user.id,
      },
      include: notificationsInclude,
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });
    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: session?.user.id,
        read: false,
      },
    });

    const nextCursor =
      notifications.length > pageSize ? notifications[pageSize].id : null;

    const data = {
      notifications: notifications.slice(0, pageSize),
      nextCursor,
      unreadCount,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {

    const session = await auth();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.notification.deleteMany({
      where: {
        recipientId: session?.user.id,
      },
    });

    return new Response();
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}