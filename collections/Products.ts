// src/collections/Products.ts
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { generateSlug } from '@/utilities/generateSlug'
import { editor } from '@/editor/editor'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'desc',
      type: 'textarea',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'material',
      type: 'select',
      options: [
        { label: 'چوب', value: 'wood' },
        { label: 'فلز', value: 'metal' },
        { label: 'شیشه', value: 'glass' },
        // مقادیر دیگر را از MATERIALS_SANITY_LIST اضافه کن
      ],
    },
    {
      name: 'content',
      type: 'richText',
      editor,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
      minRows: 1,
    },
    {
      name: 'colors',
      type: 'array',
      fields: [
        {
          name: 'color',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'discount',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'stock',
          type: 'number',
          defaultValue: 0,
        },
      ],
      minRows: 1,
    },
    {
      name: 'seller',
      type: 'relationship',
      relationTo: 'users', // به Collection users که پلاگین ساخته وصل می‌شود
    },
    {
      name: 'dimensions',
      type: 'text',
    },
    {
      name: 'assemblyRequired',
      type: 'checkbox',
      defaultValue: false,
    },
    slugField({
      useAsSlug: 'name',
      slugify: ({ valueToSlugify }) =>
        generateSlug(valueToSlugify),
    }),
  ],
}