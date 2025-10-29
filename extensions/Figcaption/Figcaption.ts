// import { mergeAttributes, Node } from '@tiptap/core'

// import { Image } from '../Image'

// export const Figcaption = Node.create({
//   name: 'figcaption',

//   addOptions() {
//     return {
//       HTMLAttributes: {},
//     }
//   },

//   content: 'inline*',

//   selectable: false,

//   draggable: false,

//   marks: 'link',

//   parseHTML() {
//     return [
//       {
//         tag: 'figcaption',
//       },
//     ]
//   },

//   addKeyboardShortcuts() {
//     return {
//       // On Enter at the end of line, create new paragraph and focus
//       Enter: ({ editor }) => {
//         const {
//           state: {
//             selection: { $from, empty },
//           },
//         } = editor

//         if (!empty || $from.parent.type !== this.type) {
//           return false
//         }

//         const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2

//         if (!isAtEnd) {
//           return false
//         }

//         const pos = editor.state.selection.$from.end()

//         return editor.chain().focus(pos).insertContentAt(pos, { type: 'paragraph' }).run()
//       },

//       // On Backspace at the beginning of line,
//       // dont delete content of image before
//       Backspace: ({ editor }) => {
//         const {
//           state: {
//             selection: { $from, empty },
//           },
//         } = editor

//         if (!empty || $from.parent.type !== this.type) {
//           return false
//         }

//         const isAtStart = $from.parentOffset === 0

//         if (!isAtStart) {
//           return false
//         }

//         // if the node before is of type image, don't do anything
//         const nodeBefore = editor.state.doc.nodeAt($from.pos - 2)
//         if (nodeBefore?.type.name === Image.name) {
//           return true
//         }

//         return false
//       },
//     }
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ['figcaption', mergeAttributes(HTMLAttributes), 0]
//   },
// })

// export default Figcaption
import { mergeAttributes, Node } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

export const Figcaption = Node.create({
  name: 'figcaption',

  group:'block',
  // content: 'inline*',
  content: 'paragraph',
  selectable: true,
  draggable: false,
  marks: 'link',

  parseHTML() {
    return [
      {
        tag: 'figcaption',
        getAttrs: (node) => { return { draggable: false } },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['figcaption', mergeAttributes(HTMLAttributes,{ draggable: false }), 0]
  },




  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { selection: { $from, empty } } = editor.state;

        if (!empty || $from.parent.type !== this.type) {
          return false;
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;

        if (!isAtEnd) {
          return false;
        }

        const pos = editor.state.selection.$from.end();

        return editor.chain().focus(pos).insertContentAt(pos, { type: 'paragraph' }).run();
      },
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from, $to } = selection;

        if (
          $from.parent.type.name === 'figcaption' && 
          ($from.parentOffset === 0 || $from.parentOffset === $from.parent.nodeSize - 2) &&
          !$to.nodeAfter
        ) {
          return true; // Prevent deletion when figcaption is selected or empty
        }

        return false;
      },
      Delete: ({ editor }) => {
        const { selection } = editor.state;
        const { $from, $to } = selection;

        if (
          $to.parent.type.name === 'figcaption' &&
          ($to.parentOffset === 0 || $to.parentOffset === $to.parent.nodeSize - 2) &&
          !$from.nodeBefore
        ) {
          return true; // Prevent deletion when figcaption is selected or empty
        }

        return false;
      },
    };
  },
 
 
 


})


export default Figcaption