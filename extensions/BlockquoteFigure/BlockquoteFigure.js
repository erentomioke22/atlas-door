// import { mergeAttributes } from '@tiptap/core'
// import { Figure } from '../Figure'
// import { Quote } from './Quote'
// import { QuoteCaption } from './QuoteCaption'



// export const BlockquoteFigure = Figure.extend({
//   name: 'blockquoteFigure',
//   group: 'block',
//   content: 'quote? quoteCaption?',
//   isolating: true,
//   defining: true,
//   // marks:'',
//   // atom:true,
  
//   addExtensions() {
//     return [Quote, QuoteCaption]
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ['figure', mergeAttributes(HTMLAttributes, { 'data-type': this.name }), ['div', {}, 0]]
//   },

//   addKeyboardShortcuts() {
//     return {
//       Enter: () => false,
//     }
//   },

//   addKeyboardShortcuts() {
//     return {
//       // Enter: () => false,
//       Backspace: ({ editor }) => {
//         const { state } = editor
//         const { selection } = state
//         const { empty, $from } = selection

//         if (empty && $from.parent.type.name === 'blockquoteFigure' && $from.parent.content.size === 0) {
//           const tr = state.tr
//           tr.delete($from.before(), $from.after())
//           editor.view.dispatch(tr)
//           return true
//         }
//         return false
//       },
//       Delete: ({ editor }) => {
//         const { state } = editor
//         const { selection } = state
//         const { empty, $from } = selection

//         if (empty && $from.parent.type.name === 'blockquoteFigure' && $from.parent.content.size === 0) {
//           const tr = state.tr
//           tr.delete($from.before(), $from.after())
//           editor.view.dispatch(tr)
//           return true
//         }
//         return false
//       },
//     }
//   },

//   addAttributes() {
//     return {
//       ...this.parent?.(),
//     }
//   },

//   addCommands() {
//     return {
//       setBlockquote:
//         () =>
//         ({ state, chain }) => {
//           const position = state.selection.$from.start()
//           const selectionContent = state.selection.content()

//           return chain()
//             .focus()
//             .insertContent({
//               type: this.name,
//               content: [
//                 {
//                   type: 'quote',
//                   content: selectionContent.content.toJSON() || [
//                     {
//                       type: 'paragraph',
//                       attrs: {
//                         textAlign: 'left',
//                       },
//                     },
//                   ],
//                 },
//                 {
//                   type: 'quoteCaption',
//                 },
//               ],
//             })
//             .focus(position + 1)
//             // .focus()
//             .run()
//         },
//     }
//   },
// })

// export default BlockquoteFigure;


import { Blockquote as BaseBlockquote } from '@tiptap/extension-blockquote'
import { mergeAttributes } from '@tiptap/core'

export const Blockquote = BaseBlockquote.extend({
  content: 'paragraph+',
  parseHTML() {
    return [
      {
        tag: 'blockquote',
        getAttrs: node => ({
          ...node.attrs,
        }),
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['blockquote', mergeAttributes(HTMLAttributes), 0]
  },
})

export default Blockquote
