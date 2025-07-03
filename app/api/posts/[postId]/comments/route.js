import { prisma } from "@utils/database";
import { CommentsPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";
import { LikeInfo } from "@/lib/types";
import { auth } from "@/auth";
import { NotificationType } from "@prisma/client";
import { LikeType } from "@prisma/client";



// export async function GET(req,{params:{postId}}) {
//   try {
//     const session = await auth();

//     const comments = await prisma.comment.findMany({
//       where: {postId,parent:null},
//       include: getCommentDataInclude(session?.user?.id),
//       orderBy: { createdAt:"desc" },
//     });



//     return Response.json(comments);
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

export async function GET(req,{params}) {
  try {
    const {postId} =await params;
    const category = req.nextUrl.searchParams.get("category") || undefined;
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const  session  = await auth();

    // if (!session) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }



    // const followedTags = await prisma.tag.findMany({
    //   where: {
    //     users: {
    //       some: {
    //         id: session?.user.id,
    //       },
    //     },
    //   },
    // });

    // const followedTagIds = followedTags.map(tag => tag.id);

    let comments;
    switch (category) {
      // case 'following':
      //   comments = await prisma.comment.findMany({
      //     where: {postId:postId,parent:null},
      //     include: getCommentDataInclude(session?.user?.id),
      //     orderBy: { createdAt:"desc" },
      //   });
      //   break;
      case 'toppest':
         comments = await prisma.comment.findMany({
          where: {
            postId:postId
            // ,parent:null
          },
          include: getCommentDataInclude(session?.user?.id),
          orderBy: [
            {replies: {_count:"desc"} }, 
            {likes: {_count:"desc"} },
            {createdAt: "desc" },
          ],
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
        });
        break;
      case 'latest':
        comments = await prisma.comment.findMany({
          where: {
            postId:postId
            // ,parent:null
          },
          include: getCommentDataInclude(session?.user?.id),
          orderBy: { createdAt:"desc" },
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
        });
        break;
      default:
        comments = await prisma.comment.findMany();
    }


    const nextCursor = comments.length > pageSize ? comments[pageSize].id : null;

    const data = {
      comments: comments.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}