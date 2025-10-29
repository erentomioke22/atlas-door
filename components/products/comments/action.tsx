"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/utils/database";
import { getCommentDataInclude } from "@/lib/types";

type SubmitArgs = {
  product: { id: string; sellerId: string };
  content: string;
  userId: string;
  parentId?: string | null;
  userReplyId?: string | null;
};

export async function submitComment({
  product,
  content,
  userId,
  parentId,
  userReplyId,
}: SubmitArgs) {
  try {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    if (!userId || userId !== session.user?.id) {
      throw new Error("Invalid user ID");
    }
    const [newComment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          content,
          productId: product?.id,
          userId,
          parentId: parentId ?? null,
        },
        include: getCommentDataInclude(userId),
      }),
      ...(!parentId && product?.sellerId !== userId
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
      ...(parentId && userReplyId && userReplyId !== userId
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
  } catch (error: any) {
    throw new Error(error);
  }
}

type EditArgs = {
  product: { id: string };
  content: string;
  userId: string;
  commentId: string;
};

export async function editComment({
  product,
  content,
  userId,
  commentId,
}: EditArgs) {
  try {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const editedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
        productId: product?.id,
        userId,
      },
      include: getCommentDataInclude(userId),
    });

    return editedComment;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deleteComment(id: string) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) throw new Error("Comment not found");

    const deletedComment = await prisma.comment.delete({
      where: { id },
    });

    return deletedComment;
  } catch (error: any) {
    throw new Error(error);
  }
}
