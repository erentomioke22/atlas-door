// src/collections/Categories.ts
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { generateSlug } from '@/utilities/generateSlug'
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    slugField({
      useAsSlug: 'title',
      slugify: ({ valueToSlugify }) =>
        generateSlug(valueToSlugify),
    }),
  ],
}