import { prisma } from "@utils/database";
import { CommentsPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";
import { LikeInfo } from "@/lib/types";
import { auth } from "@/auth";
import { NotificationType } from "@prisma/client";
import { LikeType } from "@prisma/client";



export async function GET(req,{params:{postId}}) {
  try {
    const session = await auth();

    const comments = await prisma.comment.findMany({
      where: {postId},
      include: getCommentDataInclude(session?.user?.id),
      orderBy: { createdAt:"desc" },
    });



    return Response.json(comments);
  } catch (error) {
    // console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}