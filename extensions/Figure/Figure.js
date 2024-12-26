import { mergeAttributes, Node } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

export const Figure = Node.create({
  name: 'figure',

  // addOptions() {
  //   return {
  //     HTMLAttributes: {},
  //   }
  // }, 

  group: 'block',
  content: 'block figcaption',

  // draggable: false,

  // defining: true,

  // selectable: false,

  parseHTML() {
    return [
      {
        tag: `figure[data-type="${this.name}"]`,
        getAttrs: (node) => { return { 'data-type': this.name, draggable: false } },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes, { 'data-type': this.name, draggable: false }), 0]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            // Prevent dragging child nodes from figure
            dragstart: (view, event) => {
              if (!event.target) {
                return false
              }

              const pos = view.posAtDOM(event.target , 0)
              const $pos = view.state.doc.resolve(pos)

              if ($pos.parent.type.name === this.type.name) {
                event.preventDefault()
              }

              return false
            },
          },
        },
      }),
    ]
  },
})




export default Figure;
