import { prisma } from "@utils/database";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { NotificationType } from "@prisma/client";



export async function GET(req,{params}) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reply = await prisma.reply.findUnique({
      where: {id:params.replyId},
      select: {
        likes: {
          where: {
            userId: session?.user?.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!reply) {
      return NextResponse.json({ error: "reply not found" }, { status: 404 });
    }
  // console.log("reply",reply)

    const data = {
      likes: reply._count.likes,
      isLikedByUser: !!reply.likes.length,
    };

    return NextResponse.json(data);
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req,{params}){
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reply = await prisma.reply.findUnique({
      where: {id:params.replyId},
      select: {
        userId: true,
      },
    });

    if (!reply) {
      return NextResponse.json({ error: "reply not found" }, { status: 404 });
    }


    await prisma.$transaction([
      prisma.replyLike.upsert({
        where: {
          userId_replyId: {
            userId:session?.user.id,
            replyId:params.replyId,
          },
        },
        create: {
          userId: session?.user?.id,
          replyId:params.replyId,
        },
        update: {},
      }),
      ...(session?.user?.id !== reply.userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: session?.user?.id,
                recipientId: reply.userId,
                postId:params.postId,
                type: NotificationType.LIKE,
              },
            }),
          ]
        : []),
    ]);



    return new NextResponse();
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req,{params}) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reply = await prisma.reply.findUnique({
      where: { id: params.replyId },
      select: {
        userId: true,
      },
    });

    if (!reply) {
      return Response.json({ error: "reply not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.replyLike.deleteMany({
        where: {
          userId: session?.user.id,
          replyId:params.commentId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: session.user?.id,
          recipientId: reply.userId,
          postId:params.postId,
          type: "LIKE",
        },
      }),
    ]);


    return new NextResponse();
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}