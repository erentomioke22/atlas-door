// import { mergeAttributes } from '@tiptap/core'
// import { Figure } from '../Figure'
// import { Quote } from './Quote'
// import { QuoteCaption } from './QuoteCaption'

// declare module '@tiptap/core' {
//   // eslint-disable-next-line no-unused-vars
//   interface Commands<ReturnType> {
//     blockquoteFigure: {
//       setBlockquote: () => ReturnType
//     }
//   }
// }

// export const BlockquoteFigure = Figure.extend({
//   name: 'blockquoteFigure',

//   group: 'block',

//   content: 'quote quoteCaption',

//   isolating: true,

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
//             .run()
//         },
//     }
//   },
// })

// export default BlockquoteFigure


import { Blockquote as BaseBlockquote } from '@tiptap/extension-blockquote'
import { mergeAttributes } from '@tiptap/core'

export const Blockquote = BaseBlockquote.extend({
  content: 'paragraph+',
  // parseHTML() {
  //   return [
  //     {
  //       tag: 'blockquote',
  //       getAttrs: (node) => ({
  //         ...node.attrs,
  //       }),
  //     },
  //   ]
  // },
  parseHTML() {
    return [
      {
        tag: 'blockquote',
        getAttrs: (node) => {
          if (node instanceof HTMLElement) {
            return {
              ...node.attributes, 
            }
          }
          return {}
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['blockquote', mergeAttributes(HTMLAttributes), 0]
  },
})

export default Blockquote