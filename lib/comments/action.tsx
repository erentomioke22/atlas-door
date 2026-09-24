"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/utils/database";
import { getCommentDataInclude } from "@/lib/types";
import { sanityFetch } from '@/sanity/lib/server';
import { POSTS_LOAD_MORE_QUERY , PRODUCTS_QUERY } from '@/lib/sanity/queries';
import type { PostLite } from '@/lib/types';
import { transformProductToLite } from '@/lib/sanity/transformers';
import { ProductLite, SanityProduct } from '@/lib/types';
import type { CommentTargetType } from '../types';

export async function submitComment({
  targetType,
  targetId,
  content,
  userId,
  parentId,
  userReplyId,
  // targetOwnerId,
}: {
  targetType: CommentTargetType;
  targetId: string;
  content: string;
  userId: string;
  parentId?: string | null;
  userReplyId?: string | null;
  targetOwnerId?: string | null;
}) {
  try {
    const session = await getServerSession();
    if (!session) throw new Error('Unauthorized');
    if (!userId || userId !== session.user?.id) {
      throw new Error('Invalid user ID');
    }

    const notificationType = parentId ? 'REPLY' : 'COMMENT';

    const [newComment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          content,
          targetId,
          targetType,
          userId,
          parentId: parentId ?? null,
        },
        include: getCommentDataInclude(),
      }),

      // نوتیفیکیشن برای پاسخ
      ...(parentId && userReplyId && userReplyId !== userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: userId,
                recipientId: userReplyId,
                targetId,
                targetType,
                type: 'REPLY',
              },
            }),
          ]
        : []),

      // نوتیفیکیشن برای کامنت جدید (صاحب پست/محصول)
      // ...(!parentId && targetOwnerId && targetOwnerId !== userId
      //   ? [
      //       prisma.notification.create({
      //         data: {
      //           issuerId: userId,
      //           recipientId: targetOwnerId,
      //           targetId,
      //           targetType,
      //           type: 'COMMENT',
      //         },
      //       }),
      //     ]
      //   : []),
    ]);

    return newComment;
  } catch (error: any) {
    throw new Error(error.message || 'خطا در ثبت بازخورد');
  }
}

// ====== ویرایش کامنت ======
export async function editComment({
  commentId,
  content,
  userId,
}: {
  commentId: string;
  content: string;
  userId: string;
}) {
  try {
    const session = await getServerSession();
    if (!session) throw new Error('Unauthorized');
    if (!userId || userId !== session.user?.id) {
      throw new Error('Invalid user ID');
    }

    const editedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: getCommentDataInclude(),
    });

    return editedComment;
  } catch (error: any) {
    throw new Error(error.message || 'خطا در ویرایش بازخورد');
  }
}

export async function deleteComment(id: string) {
  try {
    const session = await getServerSession();
    if (!session) throw new Error('Unauthorized');

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new Error('Comment not found');

    if (comment.userId !== session.user.id && session.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    return await prisma.comment.delete({ where: { id } });
  } catch (error: any) {
    throw new Error(error.message || 'خطا در حذف بازخورد');
  }
}

export async function loadMorePosts({
  tag,
  start,
  end,
}: {
  tag: string;
  start: number;
  end: number;
}): Promise<PostLite[]> {
  try {
    const posts = await sanityFetch<PostLite[]>({
      query: POSTS_LOAD_MORE_QUERY,
      params: { tag, start, end },
      tags: ['post', `tag-${tag}`],
      revalidate: 300,
    });

    return posts || [];
  } catch (error) {
    console.error('loadMorePosts error:', error);
    throw new Error('خطا در بارگذاری بیشتر');
  }
}




export async function loadMoreProducts({
  category,
  start,
  end,
}: {
  category: string;
  start: number;
  end: number;
}): Promise<ProductLite[]> {
  try {
    const products = await sanityFetch<SanityProduct[]>({
      query: PRODUCTS_QUERY,
      params: { category, start, end },
      tags: ['product', `category-${category}`],
      revalidate: 300,
    });

    if (!products) return [];

    return products.map(transformProductToLite);
  } catch (error) {
    console.error('Error loading more products:', error);
    return [];
  }
}