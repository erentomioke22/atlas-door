'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import { Color } from '@tiptap/extension-color'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import React, { forwardRef, useEffect, type ForwardedRef } from 'react'
import { Emoji } from '@tiptap/extension-emoji'
import { emojiSuggestion } from '@/extensions'

interface CommentTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  title?: string;
}

const CommentTextEditor = forwardRef(function CommentTextEditor(
  { content, onChange }: CommentTextEditorProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Color,
      TextStyleKit,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
      Placeholder.configure({ placeholder: 'Write Something ...' }),
      Emoji.configure({ enableEmoticons: true, suggestion: emojiSuggestion }),
    ].filter((e) => e !== undefined) as any,
    editorProps: {
      attributes: {
        class: "  w-full p-2 text-sm outline-0 min-h-14 focus:outline-none focus:ring-2 ring-black dark:ring-white rounded-xl duration-200  bg-lcard dark:bg-dcard",
        spellcheck: 'false',
      },
    },
    onUpdate: ({ editor }) => { onChange(editor.getHTML()) },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor as Editor} ref={ref} />
});

export default CommentTextEditor;
