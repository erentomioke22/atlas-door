
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'

type AccordionRendererProps = {
  title?: string
  content?: SerializedEditorState
}

export function AccordionRenderer({
  title,
  content,
}: AccordionRendererProps) {
  return (
    <details className="my-6 overflow-hidden rounded-lg border border-gray-200">
      <summary className="cursor-pointer bg-gray-50 px-4 py-3 font-semibold">
        {title}
      </summary>

      <div className="px-4 py-4">
        {content && <RichText data={content} />}
      </div>
    </details>
  )
}
