import { type SchemaTypeDefinition } from 'sanity'
import { productSchema } from './product'
import { postSchema } from './post'
import { tagSchema } from './tag'
import { authorSchema } from './author'
import { categorySchema } from './category'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postSchema, productSchema, authorSchema, tagSchema,categorySchema],
}
