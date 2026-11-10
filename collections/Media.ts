// src/collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true, // حتماً true باشد
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'legacyUrl',
      type: 'text',
      index: true,
      admin: {
        hidden: true,
        description: 'آدرس تصویر در سیستم قدیمی برای جلوگیری از آپلود تکراری',
      },
    },
  ],
}


