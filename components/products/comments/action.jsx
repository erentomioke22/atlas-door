"use server";

import { auth } from "@auth";
import { prisma } from "@utils/database";
import { getCommentDataInclude} from "@/lib/types";

export async function submitComment({post,content,userId,parentId,name,email,image}) {
  const session = auth()
  if (!session) throw new Error("Unauthorized");
  
  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content,
        email,
        // image,
        name,
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
              email,
              name,
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


