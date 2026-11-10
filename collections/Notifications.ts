// src/collections/Notifications.ts
import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/auth-utils';


export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'issuer', 'recipient', 'read', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (isAdmin(user)) return true;
      return { recipient: { equals: user.id } };
    },
    create: ({ req: { user } }) => isAdmin(user),
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (isAdmin(user)) return true;
      return { recipient: { equals: user.id } };
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      if (isAdmin(user)) return true;
      return { recipient: { equals: user.id } };
    },
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'کامنت', value: 'COMMENT' },
        { label: 'پست', value: 'POST' },
        { label: 'پاسخ', value: 'REPLY' },
        { label: 'پرداخت', value: 'PAID' },
        { label: 'تحویل', value: 'DELIVERED' },
        { label: 'سفارش', value: 'ORDER' },
        { label: 'محصول', value: 'PRODUCT' },
      ],
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'issuer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'targetType',
      type: 'select',
      options: [
        { label: 'پست', value: 'post' },
        { label: 'محصول', value: 'product' },
        { label: 'سفارش', value: 'order' },
      ],
    },
    {
      name: 'targetId',
      type: 'text',
      index: true,
    },
  ],
}