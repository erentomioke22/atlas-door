"use server";

import { auth } from "@auth";
import { prisma } from "@utils/database";
import { getCommentDataInclude} from "@/lib/types";


export async function submitComment({post,content,userId,parentId}) {
  const session = auth()
  if (!session) throw new Error("Unauthorized");
  
  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content,
        postId: post?.id,
        userId,
        parentId
      },
      include: getCommentDataInclude(userId),
    }),
    ...(post?.user?.id !== userId
      ? [
          prisma.notification.create({
            data: {
              issuerId: userId,
              recipientId: post?.user?.id,
              postId: post?.id,
              type: "COMMENT",
            },
          }),
        ]
      : []),
  ]);

  return newComment;
}

export async function editComment({post,content,userId,commentId}) {
  const session = auth()
  if (!session) throw new Error("Unauthorized");

  const [newComment] = await prisma.$transaction([
    prisma.comment.update({
      where:{id:commentId},
      data: {
        content,
        postId: post?.id,
        userId,
      },
      include: getCommentDataInclude(userId),
    }),
    ...(post?.user?.id !== userId
      ? [
          prisma.notification.create({
            data: {
              issuerId: userId,
              recipientId: post?.user?.id,
              postId: post?.id,
              type: "COMMENT",
            },
          }),
        ]
      : []),
  ]);

  return newComment;
}

export async function deleteComment(id) {

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw new Error("Comment not found");

;

  const deletedComment = await prisma.comment.delete({
    where: { id },
    // include: getCommentDataInclude(session?.user.id),
  });

  return deletedComment;
}


// export async function submitReply({content,userId,commentId}) {
//   const session = auth()
//   if (!session) throw new Error("Unauthorized");
  
//   const newReply =  prisma.reply.create({
//       data: {
//         content,
//         commentId,
//         userId,
//       },
//       include: getReplyDataInclude(userId),
//     })


//   return newReply;
// }

// export async function editReply({content,userId,replyId}) {
//   const session = auth()
//   if (!session) throw new Error("Unauthorized");

//   const editReply =prisma.reply.update({
//       where:{id:replyId},
//       data: {
//         content,
//       },
//       // include: getCommentDataInclude(userId),
//     })


//   return editReply;
// }

// export async function deleteReply(id) {


//   const reply = await prisma.reply.findUnique({
//     where: { id },
//   });

//   if (!reply) throw new Error("reply not found");


//   const deletedReply = await prisma.reply.delete({
//     where: { id },
//     // include: getCommentDataInclude(session?.user.id),
//   });

//   return deletedReply;
// }