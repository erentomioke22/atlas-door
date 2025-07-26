"use server";

import { auth } from "@auth";
import { prisma } from "@utils/database";
import { getCommentDataInclude} from "@/lib/types";


export async function submitComment({product,content,userId,parentId,userReplyId}) {
  try{
    const session = auth()
    if (!session) throw new Error("Unauthorized");
    const [newComment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          content,
          productId: product?.id,
          userId,
          parentId,
        },
        include: getCommentDataInclude(userId),
      }),
      ...(!parentId && product?.sellerId === userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: userId,
                recipientId: product?.sellerId,
                productId: product?.id,
                type: "COMMENT",
              },
            }),
          ]
        : []),
      ...(parentId && userReplyId && userReplyId === userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: userId,
                recipientId: userReplyId,
                productId: product?.id,
                type: "REPLY",
              },
            }),
          ]
        : []),
    ]);
  
    return newComment;
  }
  catch(error){
   throw new Error(error)
  }
}

export async function editComment({product,content,userId,commentId}) {
  try{
    const session = auth()
    if (!session) throw new Error("Unauthorized");
  
  const editedComment = prisma.comment.update({
        where:{id:commentId},
        data: {
          content,
          postId: product?.id,
          userId,
        },
        include: getCommentDataInclude(userId),
      })
  
    return editedComment;
  }
  catch(error){
    throw new Error(error)
  }
}

export async function deleteComment(id) {
try{
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw new Error("Comment not found");


   const deletedComment = prisma.comment.delete({
    where: { id },
  })

  return deletedComment;
}catch(error){
  throw new Error(error)
}
}

