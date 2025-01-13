'use client'

// import { HocuspocusProvider } from '@hocuspocus/provider'

// import { API } from '@/lib/api'
// import Placeholder from '@tiptap/extension-placeholder'
import {
  CodeBlock,
  Color,
  Details,
  DetailsContent,
  DetailsSummary,
  Document,
  Dropcursor,
  Emoji,
  Figcaption,
  Figure,
  FileHandler,
  Focus,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalRule,
  Link,
  Placeholder,
  Selection,
  StarterKit,
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TextAlign,
  TextStyle,
  TrailingNode,
  Typography,
  Underline,
  emojiSuggestion,
  Columns,
  Column,
  TaskItem,
  TaskList,
  Image,
  ImageFigure,
  Iframe,
  Blockquote,
  // TableOfContentsNode
  // TableOfContents,
    // BlockquoteFigure,
  // Video,
    // SlashCommand,
  // CharacterCount,
  // ImageBlock,
  // UniqueID,
  // Youtube,
  // Text,
  // Gapcursor,
  // Blockquote,
} from '.'


import Youtube from '@tiptap/extension-youtube'


export const ExtensionKit = ({ provider }) => [
  Document,
  Columns,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Column,
  Selection,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  HorizontalRule,
  StarterKit.configure({
    document: false,
    dropcursor: false,
    heading: false,
    horizontalRule: false,
    blockquote: false,
    history: true,
    codeBlock: false,
  }),
  Details.configure({
    persist: true,
    HTMLAttributes: {
      class: 'details',
    },
  }),
  DetailsContent,
  DetailsSummary,
  CodeBlock,
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  Image,
  ImageFigure,
  TrailingNode,
  Link.configure({
    openOnClick: false,
  }),
  Highlight.configure({ multicolor: true }),
  Underline,
  // TableOfContents,
  // TableOfContentsNode,
  // ImageUpload.configure({
  //   clientId: provider?.document?.clientID,
  // }),
  FileHandler.configure({
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    onDrop: (currentEditor, files, pos) => {
      files.forEach(async file => {
        const url = await API.uploadImage(file)
        
        currentEditor.chain().setImageBlockAt({ pos, src: url }).focus().run()
      })
    },
    onPaste: (currentEditor, files) => {
      files.forEach(async file => {
        const url = await API.uploadImage(file)
        
        return currentEditor
        .chain()
        .setImageBlockAt({ pos: currentEditor.state.selection.anchor, src: url })
        .focus()
        .run()
      })
    },
  }),
  Emoji.configure({
    enableEmoticons: true,
    suggestion: emojiSuggestion,
  }),
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {}
    },
  }).configure({
    types: ['heading', 'paragraph'],
  }),
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Typography,
  Iframe,
  Youtube.configure({controls: false,nocookie: true}),
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: () => '',
  }),
  Focus,
  Figcaption,
  Figure,
  // BlockquoteFigure,
  Blockquote,
  Dropcursor.configure({
    width: 2,
    class: 'ProseMirror-dropcursor border-black',
  }),
  // Text,
  // Gapcursor,
  // Blockquote,
  // Youtube,
  // SlashCommand,
  // UniqueID.configure({
  //   types: ['paragraph', 'heading', 'blockquote', 'codeBlock', 'table'],
  //   filterTransaction: transaction => !isChangeOrigin(transaction),
  // }),
  // Video,
  // CharacterCount.configure({ limit: 50000 }),
  // ImageBlock,
  // Placeholder.configure({
  //   placeholder: 'Write something …',
  //   placeholder: ({ node }) => {
  //     if (node.type.name === 'heading') {
  //       return 'What’s the title?'
  //     }
  
  //     return 'Can you add some further context?'
  //   },
  // })
]

export default ExtensionKit
