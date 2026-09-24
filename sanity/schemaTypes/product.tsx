import {defineField, defineType} from 'sanity'
import { MATERIALS_SANITY_LIST, COLORS_SANITY_LIST, getColorLabel } from '@/lib/constants';

export const productSchema = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => [rule.required().error("Product name is required")],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => [
        rule.required().error("Slug is required for URL generation"),
      ],
    }),
    defineField({
      name: 'desc',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => [rule.required().error("Category is required")],
    }),
    defineField({
      name: "material",
      type: "string",
      options: {
        list: MATERIALS_SANITY_LIST,
        layout: "radio",
      },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}, {type: 'image'}],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      validation: (rule) => [
        rule.min(1).error("At least one image is required"),
      ],
    }),
    // defineField({
    //   name: 'feature',
    //   title: 'Feature',
    //   type: 'text',
    // }),
    defineField({
      name: "colors",
      title: "Colors",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "color",
              title: "Color",
              type: "string",
              options: {
                list: COLORS_SANITY_LIST,
              },
              validation: (rule) => rule.required(),
            },
            {
              name: "price",
              title: "Price",
              type: "number",
              validation: (rule) => rule.required(),
            },
    
            {
              name: "discount",
              title: "Discount (%)",
              type: "number",
              initialValue: 0,
            },
    
            {
              name: "stock",
              title: "Stock",
              type: "number",
              initialValue: 0,
            },
          ],
    
          preview: {
            select: {
              color: "color",
              price: "price",
              stock: "stock",
            },
            prepare({ color, price, stock }) {
              const colorLabel = getColorLabel(color);
              return {
                title: colorLabel,
                subtitle: `£${price} | Stock: ${stock}`,
              };
            },
          },
        },
      ],
      validation: (rule) => [
        rule.min(1).error('At least one color is required'),
      ],
    }),
    defineField({
      name: 'seller',
      title: 'Seller',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: "dimensions",
      type: "string",
      description: 'e.g., "120cm x 80cm x 75cm"',
    }),
    defineField({
      name: "assemblyRequired",
      type: "boolean",
      initialValue: false,
      description: "Does this product require assembly?",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      media: "images.0",
      price: "price",
    },
    prepare({ title, subtitle, media, price }) {
      return {
        title,
        subtitle: `${subtitle ? subtitle + " • " : ""}£${price ?? 0}`,
        media,
      };
    },
  },
})