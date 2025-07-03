"use server";

import { auth } from "@auth";
import { prisma } from "@utils/database";
import { getCommentDataInclude} from "@/lib/types";


export async function submitComment({product,content,userId,parentId}) {
  try{
    // console.log(product,content,userId,parentId)
    // product: { connect: { id: product.id } },
    // user: { connect: { id: userId } },
    // name:session?.user.name || '',
    // email:session?.user.email,
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
      ...(product?.sellerId?.id !== userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: userId,
                recipientId: product?.sellerId?.id,
                productId: product?.id,
                type: "COMMENT",
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
  
    const [newComment] = await prisma.$transaction([
      prisma.comment.update({
        where:{id:commentId},
        data: {
          content,
          postId: product?.id,
          userId,
        },
        include: getCommentDataInclude(userId),
      }),
      ...(product?.sellerId?.id !== userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: userId,
                recipientId: product?.sellerId?.id,
                postId: product?.id,
                type: "COMMENT",
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

export async function deleteComment(id) {
try{
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
}catch(error){
  throw new Error(error)
}
}

