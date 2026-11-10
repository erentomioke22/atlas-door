// src/collections/Tags.ts
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { generateSlug } from '@/utilities/generateSlug'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    slugField({
      useAsSlug: 'name',
      slugify: ({ valueToSlugify }) =>
        generateSlug(valueToSlugify),
    }),
  ],
}