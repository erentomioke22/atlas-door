import { Blockquote as BaseBlockquote } from '@tiptap/extension-blockquote'
import { mergeAttributes } from '@tiptap/core'

export const Blockquote = BaseBlockquote.extend({
  content: 'paragraph+',
  parseHTML() {
    return [
      {
        tag: 'blockquote',
        getAttrs: (node: HTMLElement | string) => {
          if (typeof node !== 'string' && node instanceof HTMLElement) {
            return {
              ...node.attributes, 
            }
          }
          return {}
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['blockquote', mergeAttributes(HTMLAttributes), 0]
  },
})

export default Blockquote;