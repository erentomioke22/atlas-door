// src/lib/comments/actions.ts
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getServerSession } from '@/lib/get-session'

const payload = await getPayload({ config })

export type CommentTargetType = 'post' | 'product'
export type SortCategory = 'latest' | 'oldest'

export interface PopulatedComment {
  id: string
  content: string
  createdAt: string
  parentId: string | null
  parent?: {
    id: string
    content: string
    user: {
      id: string
      name: string | null
      displayName: string | null
      image: string | null
    } | null
  } | null
  user: {
    id: string
    name: string | null
    displayName: string | null
    image: string | null
  } | null
  userId: string
  targetType: CommentTargetType
  targetId: string
}

function mapComment(doc: any): PopulatedComment {
  return {
    id: String(doc.id),
    content: doc.content,
    createdAt: doc.createdAt,
    parentId: doc.parent?.id ? String(doc.parent.id) : doc.parent ? String(doc.parent) : null,
    parent:
      doc.parent && typeof doc.parent === 'object'
        ? {
            id: String(doc.parent.id),
            content: doc.parent.content,
            user: doc.parent.user && typeof doc.parent.user === 'object'
              ? {
                  id: String(doc.parent.user.id),
                  name: doc.parent.user.name ?? null,
                  displayName: doc.parent.user.displayName ?? null,
                  image: doc.parent.user.image ?? null,
                }
              : null,
          }
        : null,
    user:
      doc.user && typeof doc.user === 'object'
        ? {
            id: String(doc.user.id),
            name: doc.user.name ?? null,
            displayName: doc.user.displayName ?? null,
            image: doc.user.image ?? null,
          }
        : null,
    userId: String(
      typeof doc.user === 'object' ? doc.user?.id : doc.user
    ),
    targetType: doc.targetType,
    targetId: doc.targetId,
  }
}

export async function getComments({
  targetType,
  targetId,
  category = 'latest',
  cursor,
  limit = 20,
}: {
  targetType: CommentTargetType
  targetId: string
  category?: SortCategory
  cursor?: string | null
  limit?: number
}) {
  try{
    const sort = category === 'latest' ? '-createdAt' : 'createdAt'
  
    const where: any = {
      targetType: { equals: targetType },
      targetId: { equals: targetId },
    }
  
    // cursor = createdAt کامنت آخر
    if (cursor) {
      where.createdAt = {
        [category === 'latest' ? 'less_than' : 'greater_than']: cursor,
      }
    }
  
    const result = await payload.find({
      collection: 'comments',
      where,
      sort,
      limit: limit + 1,
      depth: 2, // populate user + parent.user
    })
  
    const hasMore = result.docs.length > limit
    const docs = hasMore ? result.docs.slice(0, limit) : result.docs
    const nextCursor = hasMore
      ? (docs[docs.length - 1] as any).createdAt
      : null
  
    return {
      comments: docs.map(mapComment),
      nextCursor,
    }
  }catch (error: any) {
    console.log(error)
    throw new Error(error.message || 'خطا در ویرایش بازخورد')
  }
}


export async function submitComment({
  targetType,
  targetId,
  content,
  parentId,
}: {
  targetType: CommentTargetType
  targetId: string | number
  content: string
  parentId?: string | number | null
}) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      throw new Error('برای ثبت کامنت ابتدا وارد حساب کاربری شوید.')
    }

    const cleanContent = content?.trim()

    if (!cleanContent) {
      throw new Error('متن کامنت نمی‌تواند خالی باشد.')
    }
    if (cleanContent.length > 500) {
      throw new Error('حداکثر طول کامنت ۵۰۰ کاراکتر است.')
    }
    if (!['post', 'product'].includes(targetType) || targetId == null) {
      throw new Error('مقصد کامنت معتبر نیست.')
    }

    const payloadUser = await payload.findByID({
      collection: 'users',
      id: String(session.user.id),
      depth: 0,
    })

    if (!payloadUser?.id) {
      throw new Error('کاربر واردشده در Collection کاربران Payload وجود ندارد.')
    }

    // ✅ parent را به همان نوع id واقعی DB نگه دار
    let parentRef: string | number | null = null

    if (parentId) {
      const parent = await payload.findByID({
        collection: 'comments',
        id: String(parentId),
        depth: 0,
      })

      if (
        parent.targetType !== targetType ||
        String(parent.targetId) !== String(targetId)
      ) {
        throw new Error('کامنت والد متعلق به این صفحه نیست.')
      }

      parentRef = parent.id   // ← کلید حل مشکل
    }

    // ✅ فقط وقتی parentRef داریم، parent را ست کن
    const data: any = {
      content: cleanContent,
      targetType,
      targetId: String(targetId),
      user: payloadUser.id,
    }

    if (parentRef != null) {
      data.parent = parentRef
    }

    const newComment = await payload.create({
      collection: 'comments',
      overrideAccess: true,
      depth: 2,
      data,
    })

    return mapComment(newComment)
  } catch (error: any) {
    console.error('submitComment error:', error)
    throw new Error(error.message || 'خطا در ثبت کامنت')
  }
}



export async function editComment({
  commentId,
  content,
}: {
  commentId: string
  content: string
}) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const cleanContent = content?.trim()

    if (!cleanContent || cleanContent.length > 500) {
      throw new Error('متن کامنت معتبر نیست.')
    }

    const comment = await payload.findByID({
      collection: 'comments',
      id: commentId,
      depth: 0,
    })

    const ownerId =
      typeof comment.user === 'object'
        ? comment.user?.id
        : comment.user

    const isOwner = String(ownerId) === String(session.user.id)
    const isAdmin = session.user.role === 'admin'

    if (!isOwner && !isAdmin) {
      throw new Error('شما اجازه ویرایش این کامنت را ندارید.')
    }

    const edited = await payload.update({
      collection: 'comments',
      id: commentId,
      overrideAccess: true,
      depth: 2,
      data: {
        content: cleanContent,
      },
    })

    return mapComment(edited)

  } catch (error: any) {
    console.error('editComment error:', error)
    throw new Error(error.message || 'خطا در ویرایش کامنت')
  }
}



async function deleteCommentTree(id: string): Promise<void> {
  const children = await payload.find({
    collection: 'comments',
    overrideAccess: true,
    depth: 0,
    limit: 1000,
    pagination: false,
    where: {
      parent: {
        equals: id,
      },
    },
  })

  for (const child of children.docs) {
    await deleteCommentTree(String(child.id))
  }

  await payload.delete({
    collection: 'comments',
    id,
    overrideAccess: true,
  })
}

export async function deleteComment(id: string) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const comment = await payload.findByID({
      collection: 'comments',
      id,
      depth: 0,
    })

    const ownerId =
      typeof comment.user === 'object'
        ? comment.user?.id
        : comment.user

    const isOwner = String(ownerId) === String(session.user.id)
    const isAdmin = session.user.role === 'admin'

    if (!isOwner && !isAdmin) {
      throw new Error('شما اجازه حذف این کامنت را ندارید.')
    }

    await deleteCommentTree(id)

    return { id }

  } catch (error: any) {
    console.error('deleteComment error:', error)
    throw new Error(error.message || 'خطا در حذف کامنت')
  }
}


