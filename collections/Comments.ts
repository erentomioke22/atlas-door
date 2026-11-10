// src/collections/Comments.ts
import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/auth-utils';

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['content', 'user', 'targetType', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (isAdmin(user)) return true;
      return {
        user: { equals: user.id },
      }
    },
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 500,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'comments',
      index: true,
    },
    {
      name: 'targetType',
      type: 'select',
      options: [
        { label: 'محصول', value: 'product' },
        { label: 'پست', value: 'post' },
      ],
      required: true,
      index: true,
    },
    {
      name: 'targetId',
      type: 'text',
      required: true,
      index: true,
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && data.parent) {
          try {
            const parent = await req.payload.findByID({
              collection: 'comments',
              id: data.parent,
              depth: 1,
            })

            const parentUser = parent.user
            const parentUserId =
              typeof parentUser === 'object' ? parentUser?.id : parentUser
            const currentUserId =
              typeof data.user === 'object' ? data.user?.id : data.user

            if (parentUserId && parentUserId !== currentUserId) {
              await req.payload.create({
                collection: 'notifications',
                data: {
                  issuer: currentUserId,
                  recipient: parentUserId,
                  targetId: data.targetId,
                  targetType: data.targetType,
                  type: 'REPLY',
                  read: false,
                },
              })
            }
          } catch (e) {
            req.payload.logger.error('Notification error: ' + e)
          }
        }
        return data
      },
    ],
  },
}