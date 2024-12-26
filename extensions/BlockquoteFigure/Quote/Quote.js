import { Node } from '@tiptap/core'

export const Quote = Node.create({
  name: 'quote',

  content: 'paragraph+',
  isolating: true,
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'blockquote',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['blockquote',HTMLAttributes, 0]
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        if ($from.parent.type.name === "blockquoteFigure") {
          return editor.commands.deleteNode("blockquoteFigure");
        }
        return false;
      },
    }
  },

  
})

export default Quote
