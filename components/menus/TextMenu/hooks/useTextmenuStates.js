import {  useEditorState } from '@tiptap/react'
import { useCallback } from 'react'
// import { ShouldShowProps } from '../../types'
// import { isCustomNodeSelected, isTextSelected } from '@/lib/utils'
import isCustomNodeSelected from '@lib/utils/isCustomNodeSelected'
import isTextSelected from '@lib/utils/isTextSelected'
export const useTextmenuStates = (editor) => {
  const states = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive('bold'),
        isItalic: ctx.editor.isActive('italic'),
        isStrike: ctx.editor.isActive('strike'),
        isUnderline: ctx.editor.isActive('underline'),
        isCode: ctx.editor.isActive('code'),
        isSubscript: ctx.editor.isActive('subscript'),
        isSuperscript: ctx.editor.isActive('superscript'),
        isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }),
        isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }),
        isAlignRight: ctx.editor.isActive({ textAlign: 'right' }),
        isAlignJustify: ctx.editor.isActive({ textAlign: 'justify' }),
        // isQuote: ctx.editor.isActive('blockquote'),
        currentColor: ctx.editor.getAttributes('textStyle')?.color || undefined,
        // currentHighlight: ctx.editor.getAttributes('highlight')?.color || undefined,
        currentHighlight: ctx.editor.isActive('highlight'),
        currentFont: ctx.editor.getAttributes('textStyle')?.fontFamily || undefined,
        currentSize: ctx.editor.getAttributes('textStyle')?.fontSize || undefined,
        isHeading1:ctx.editor.isActive('heading', { level: 1 }),
        isHeading2:ctx.editor.isActive('heading', { level: 2 }),
        isHeading3:ctx.editor.isActive('heading', { level: 3 }),
      }
    },
  })

  const shouldShow = useCallback(
    ({ view, from }) => {
      if (!view || editor.view.dragging) {
        return false
      }

      const domAtPos = view.domAtPos(from || 0).node 
      const nodeDOM = view.nodeDOM(from || 0) 
      const node = nodeDOM || domAtPos

      if (isCustomNodeSelected(editor, node)) {
        return false
      }

      return isTextSelected({ editor })
    },
    [editor],
  )

  return {
    shouldShow,
    ...states,
  }
}
