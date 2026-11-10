import {
    lexicalEditor,
    FixedToolbarFeature,
    InlineToolbarFeature,
    UploadFeature,
    BlocksFeature,
    TextStateFeature,
    EXPERIMENTAL_TableFeature,
  } from '@payloadcms/richtext-lexical'
  import { Accordion } from './blocks/Accordion'
  
  export const editor = lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      EXPERIMENTAL_TableFeature(),
  
      UploadFeature({
        collections: {
          media: {
            fields: [
              { name: 'caption', type: 'text' },
              {
                name: 'size',
                type: 'select',
                defaultValue: '100',
                options: ['25', '50', '75', '100'],
              },
            ],
          },
        },
      }),
  
      TextStateFeature({
        state: {
          color: {
            red: { label: 'قرمز', css: { color: '#e53935' } },
            blue: { label: 'آبی', css: { color: '#1e88e5' } },
          },
          highlight: {
            yellow: { label: 'زرد', css: { 'background-color': '#fff59d' } },
            green: { label: 'سبز', css: { 'background-color': '#c8e6c9' } },
          },
        },
      }),
  
      BlocksFeature({ blocks: [Accordion] }),
    ],
  })