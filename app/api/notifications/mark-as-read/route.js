import { auth } from "@auth";
import { prisma } from "@utils/database";

export async function PATCH() {
  try {
    const session = await auth();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.notification.updateMany({
      where: {
        recipientId: session?.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return new Response();
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}