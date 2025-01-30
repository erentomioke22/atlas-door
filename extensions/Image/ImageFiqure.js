import { Figure } from '../Figure';
import { mergeAttributes, Node } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

export const ImageFigure = Figure.extend({
  name: 'imageFigure',
  content: 'image? figcaption', 
  // defining: true,
  // isolating: true,

  addAttributes() {
    return {
      width: {
        default: '100%', // Default to full width
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleTextInput(view, from, to, text) {
            const { state, dispatch } = view;
            const { $from } = state.selection;
  
            // Check if the current node is an `imageFigure`
            if ($from.parent.type.name === 'imageFigure') {
              const imageFigureNode = $from.parent;
  
              // Get the position of the `imageFigure`
              const figurePos = $from.before();
  
              // Check if a figcaption exists
              const figcaption = imageFigureNode.childCount > 1 ? imageFigureNode.child(1) : null;
  
              if (!figcaption || figcaption.content.size === 0) {
                // If figcaption is missing or empty, create one and insert text into it
                const figcaptionPos = figurePos + imageFigureNode.child(0).nodeSize + 1;
  
                const tr = state.tr
                  .insert(figcaptionPos, state.schema.nodes.figcaption.createAndFill())
                  .insertText(text, figcaptionPos + 1); // Add the typed text to the new figcaption
  
                dispatch(tr);
              } else {
                // If figcaption exists, add text to it
                const figcaptionPos = figurePos + imageFigureNode.child(0).nodeSize + 1;
  
                const tr = state.tr.insertText(text, figcaptionPos + figcaption.content.size);
                dispatch(tr);
              }
  
              return true; // Prevent the default behavior of replacing the `imageFigure`
            }
  
            return false; // Allow other default behaviors
          },
        },
      }),
    ];
  },
  

  
  addCommands() {
    return {
      setFigure: ({ caption, ...attrs }) => ({ chain }) => {
        const { alt, ...rest } = attrs
        return chain()
          .insertContent({
            type: 'imageFigure',
            content: [
              {
                type: 'image',
                attrs: { alt: alt || 'Default description', ...rest, },
                // : {
                //   src: url,
                // },
              },
              {
                type: 'figcaption',
                content: caption
            ? [{ type: 'paragraph', content: [{ type: 'text', text: caption }] }]
            : [{ type: 'paragraph' }],
                // content: [
                //   {
                //     type: 'text',
                //     text: 'Image caption',
                //   },
                // ],
              },
            ],
          })
          .run()
      },
      setImageBlockAlt:
      alt =>
        ({ commands }) => commands.updateAttributes('image', {alt}),
  
      setImageBlockWidth:
      width =>
        ({ commands }) => commands.updateAttributes('imageFigure', { width: `${Math.max(0, Math.min(100, width))}%` }),
    }
  },

});


