// src/collections/Posts.ts
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { generateSlug } from '@/utilities/generateSlug'
import { editor } from '@/editor/editor'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'desc',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
      editor,
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',    
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
    {
      name: 'discussions',
      type: 'checkbox',
      defaultValue: true,
    },
    slugField({
      useAsSlug: 'title',
      slugify: ({ valueToSlugify }) =>
        generateSlug(valueToSlugify),
    }),
  ],
}