
import type {
    DefaultNodeTypes,
    SerializedBlockNode,
    SerializedUploadNode,
  } from '@payloadcms/richtext-lexical'
  
  import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
  
  import {
    type JSXConvertersFunction,
    RichText,
  } from '@payloadcms/richtext-lexical/react'
  
  import { AccordionRenderer } from './AccordionRenderer'
import ImageCom from '../ui/Image'
  
  type AccordionFields = {
    id?: string
    blockType: 'accordion'
    title?: string
    content?: SerializedEditorState
  }
  
  type NodeTypes =
    | DefaultNodeTypes
    | SerializedBlockNode<AccordionFields>
  
  const converters: JSXConvertersFunction<NodeTypes> = ({
    defaultConverters,
  }) => ({
    ...defaultConverters,
  
    blocks: {
      accordion: ({ node }) => (
        <AccordionRenderer
          title={node.fields.title}
          content={node.fields.content}
        />
      ),
    },
  
    upload: ({ node }: { node: SerializedUploadNode }) => {
      if (
        node.relationTo !== 'media' ||
        typeof node.value !== 'object' ||
        node.value === null
      ) {
        return null
      }
  
      const media = node.value
      const fields = node.fields as
        | { size?: string; caption?: string }
        | undefined
  
      const size = fields?.size ?? '100'
  
      const widthClass: Record<string, string> = {
        '25': 'w-1/4',
        '50': 'w-1/2',
        '75': 'w-3/4',
        '100': 'w-full',
      }
  
      const width = widthClass[size] ?? 'w-full'
  
      return (
        <figure className={`my-6 ${width} max-w-full mx-auto`}>
          {/* <img
            src={media.url ?? ''}
            alt={media.alt ?? fields?.caption ?? ''}
            className="h-auto w-full rounded-lg"
            loading="lazy"
          /> */}
          <ImageCom
          src={media.url ?? ''}
          alt={media.alt ?? fields?.caption ?? ''}
          layout="natural"
          width={media.width ?? 0}
          height={media.height ?? 0}
          className="rounded-lg"
        />
          {fields?.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500">
              {fields.caption}
            </figcaption>
          )}
        </figure>

)
},
})

type RichTextRendererProps = {
  data: SerializedEditorState
}
{/* <figure className={`my-6 ${width} max-w-full mx-auto`}>
<ImageCom
  src={media.url ?? ''}
  alt={media.alt ?? fields?.caption ?? ''}
  className={`h-auto w-full rounded-lg ${width} `}
/>

{fields?.caption && (
  <figcaption className="mt-2 text-center text-sm text-gray-500">
    {fields.caption}
  </figcaption>
)}
</figure> */}
  
  export default function RichTextRenderer({
    data,
  }: RichTextRendererProps) {
    return <RichText data={data} converters={converters} />
  }
  