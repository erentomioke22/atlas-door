import { mergeAttributes, Node } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

import { getCellsInColumn, isRowSelected, selectRow } from './utils'

export const TableCell = Node.create({
  name: 'tableCell',

  content: 'block+', // TODO: Do not allow table in table

  tableRole: 'cell',

  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: 'td' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['td', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addAttributes() {
    return {
      colspan: {
        default: 1,
        parseHTML: (element) => {
          const colspan = element.getAttribute('colspan')
          return colspan ? parseInt(colspan, 10) : 1
        },
      },
      rowspan: {
        default: 1,
        parseHTML: (element) => {
          const rowspan = element.getAttribute('rowspan')
          return rowspan ? parseInt(rowspan, 10) : 1
        },
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute('colwidth')
          return colwidth ? [parseInt(colwidth, 10)] : null
        },
      },
      style: {
        default: null,
      },
    }
  },

  addProseMirrorPlugins() {
    const { isEditable } = this.editor

    return [
      new Plugin({
        props: {
          decorations: (state) => {
            if (!isEditable) {
              return DecorationSet.empty
            }

            const { doc, selection } = state
            const decorations = []
            const cells = getCellsInColumn(0)(selection)

            if (cells) {
              cells.forEach(({ pos }, index) => {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const rowSelected = isRowSelected(index)(selection)
                    let className = 'grip-row'

                    if (rowSelected) {
                      className += ' selected'
                    }

                    if (index === 0) {
                      className += ' first'
                    }

                    if (index === cells.length - 1) {
                      className += ' last'
                    }

                    const grip = document.createElement('a')

                    grip.className = className
                    grip.addEventListener('mousedown', (event) => {
                      event.preventDefault()
                      event.stopImmediatePropagation()

                      this.editor.view.dispatch(selectRow(index)(this.editor.state.tr))
                    })

                    return grip
                  }),
                )
              })
            }

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})

