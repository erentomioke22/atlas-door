'use client'



import { useEditor, EditorContent } from '@tiptap/react'
import { Color } from '@tiptap/extension-color'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import React,{forwardRef, useEffect} from 'react'
import  {Emoji  } from '@tiptap-pro/extension-emoji'
import { emojiSuggestion } from '@extensions'

const CommentTextEditor = forwardRef(({content,onChange,title},ref) => {

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Link.configure({openOnClick: false,autolink: true,defaultProtocol: 'https',}),
      Placeholder.configure({
        placeholder: 'Write Something ...',
      }),
  Emoji.configure({
    enableEmoticons: true,
    suggestion: emojiSuggestion,
  }),
    ],
    editorProps:{
        attributes:{
             class: "  w-full p-2 text-sm outline-0 min-h-14 focus:outline-none focus:ring-2 ring-black dark:ring-white rounded-xl duration-200  bg-lcard dark:bg-dcard",
            spellcheck: 'false',
        },
    },
    
    // content:content,

    onUpdate:({editor})=>{
      onChange(editor.getHTML())
    },
  })


  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <EditorContent style={{whiteSpace:"pre-line"}} editor={editor} ref={ref} />

  )
})
CommentTextEditor.displayName = 'CommentTextEditor'; 
export default CommentTextEditor;
