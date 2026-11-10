import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Accordion: Block = {
  slug: 'accordion',
  labels: { singular: 'Accordion', plural: 'accordions' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'richText', editor: lexicalEditor() },
  ],
}