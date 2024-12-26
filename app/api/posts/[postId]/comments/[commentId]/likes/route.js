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

    const comment = await prisma.comment.findUnique({
      where: {id:params.commentId},
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

    if (!comment) {
      return NextResponse.json({ error: "comment not found" }, { status: 404 });
    }
  // console.log("comment",comment)

    const data = {
      likes: comment._count.likes,
      isLikedByUser: !!comment.likes.length,
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

    const comment = await prisma.comment.findUnique({
      where: {id:params.commentId},
      select: {
        userId: true,
      },
    });

    if (!comment) {
      return NextResponse.json({ error: "comment not found" }, { status: 404 });
    }


    await prisma.$transaction([
      prisma.commentLike.upsert({
        where: {
          userId_commentId: {
            userId:session?.user.id,
            commentId:params.commentId,
          },
        },
        create: {
          userId: session?.user?.id,
          commentId:params.commentId,
        },
        update: {},
      }),
      ...(session?.user?.id !== comment.userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: session?.user?.id,
                recipientId: comment.userId,
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

    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
      select: {
        userId: true,
      },
    });

    if (!comment) {
      return Response.json({ error: "comment not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.commentLike.deleteMany({
        where: {
          userId: session?.user.id,
          commentId:params.commentId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: session.user?.id,
          recipientId: comment.userId,
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