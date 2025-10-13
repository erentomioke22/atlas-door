import { Figure } from '../Figure';
import { Plugin } from '@tiptap/pm/state'

export const ImageFigure = Figure.extend({
  name: 'imageFigure',
  content: 'image? figcaption', 
  // defining: true,
  // isolating: true,

  addAttributes() {
    return {
      width: {
        default: '100%', 
      },
      alt: {
        default: '', 
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

          if ($from.parent.type.name === 'imageFigure') {
            const imageFigureNode = $from.parent;
            const figurePos = $from.before();

            const hasImage = imageFigureNode.childCount > 0 && imageFigureNode.child(0).type.name === 'image';
            const imageNode = hasImage ? imageFigureNode.child(0) : null;

            // Ensure figcaption exists and insert/append text into it
            const figcaption = imageFigureNode.childCount > 1 ? imageFigureNode.child(1) : null;

            if (!figcaption || figcaption.content.size === 0) {
              const figcaptionPos = figurePos + (hasImage ? imageNode.nodeSize : 0) + 1;
              const tr = state.tr
                .insert(figcaptionPos, state.schema.nodes.figcaption.createAndFill())
                .insertText(text, figcaptionPos + 1);
              dispatch(tr);
            } else {
              const figcaptionPos = figurePos + (hasImage ? imageNode.nodeSize : 0) + 1;
              const tr = state.tr.insertText(text, figcaptionPos + figcaption.content.size);
              dispatch(tr);
            }

           if (imageNode) {
             const currentAlt = imageNode.attrs?.alt || '';
             if (!currentAlt) {
               const imagePos = figurePos + 1;
               const trSetAlt = state.tr.setNodeMarkup(imagePos, null, {
                 ...imageNode.attrs,
                 alt: text, // for full caption, compute and use that string instead
               });
               dispatch(trSetAlt);
               // also mirror to the figure alt if empty
               const figAlt = imageFigureNode.attrs?.alt || '';
               if (!figAlt) {
                 const trSetFigureAlt = state.tr.setNodeMarkup(figurePos, null, {
                   ...imageFigureNode.attrs,
                   alt: text,
                 });
                 dispatch(trSetFigureAlt);
               }
             }
           }
           return true;
          }

          return false;
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
          attrs: { alt: alt || '' },
          content: [
            {
              type: 'image',
              attrs: { alt: alt || 'Default description', ...rest },
            },
            {
              type: 'figcaption',
              content: caption
                ? [{ type: 'paragraph', content: [{ type: 'text', text: caption }] }]
                : [{ type: 'paragraph' }],
            },
          ],
        })
        .run()
    },
    setImageBlockAlt:
    alt =>
    ({ state, dispatch, commands }) => {
      const { $from } = state.selection;

      if ($from.parent.type.name === 'imageFigure') {
        const figureNode = $from.parent;
        const hasImage = figureNode.childCount > 0 && figureNode.child(0).type.name === 'image';
        if (!hasImage) {
          // still set alt on figure
          const figurePos = $from.before();
          const trFigure = state.tr.setNodeMarkup(figurePos, null, {
            ...figureNode.attrs,
            alt,
          });
          dispatch(trFigure);

          // ensure/replace figcaption to match alt
          const figcaption = figureNode.childCount > 0 ? figureNode.child(0) : null;
          const figcaptionPos = figurePos + 1;
          const paragraph = state.schema.nodes.paragraph.create(
            null,
            alt ? state.schema.text(alt) : null,
          );
          const newFigcaption = state.schema.nodes.figcaption.create(null, paragraph);

          if (figcaption && figcaption.type.name === 'figcaption') {
            const trCap = state.tr.replaceWith(
              figcaptionPos,
              figcaptionPos + figcaption.nodeSize,
              newFigcaption,
            );
            dispatch(trCap);
          } else {
            const trCapIns = state.tr.insert(figcaptionPos, newFigcaption);
            dispatch(trCapIns);
          }

          return true;
        }

        const imageNode = figureNode.child(0);
        const imagePos = $from.before() + 1;

        const trImage = state.tr.setNodeMarkup(imagePos, null, {
          ...imageNode.attrs,
          alt,
        });
        dispatch(trImage);

        const figurePos = $from.before();
        const trFigure = state.tr.setNodeMarkup(figurePos, null, {
          ...figureNode.attrs,
          alt,
        });
        dispatch(trFigure);

        // ensure/replace figcaption to match alt
        const hasFigcaption = figureNode.childCount > 1 && figureNode.child(1).type.name === 'figcaption';
        const figcaptionNode = hasFigcaption ? figureNode.child(1) : null;
        const figcaptionPos = figurePos + (hasImage ? imageNode.nodeSize : 0) + 1;

        const paragraph = state.schema.nodes.paragraph.create(
          null,
          alt ? state.schema.text(alt) : null,
        );
        const newFigcaption = state.schema.nodes.figcaption.create(null, paragraph);

        if (figcaptionNode) {
          const trCap = state.tr.replaceWith(
            figcaptionPos,
            figcaptionPos + figcaptionNode.nodeSize,
            newFigcaption,
          );
          dispatch(trCap);
        } else {
          const trCapIns = state.tr.insert(figcaptionPos, newFigcaption);
          dispatch(trCapIns);
        }

        return true;
      }

      // Fallback: try update both image and imageFigure (whichever is active)
      const ok1 = commands.updateAttributes('image', { alt });
      const ok2 = commands.updateAttributes('imageFigure', { alt });
      return ok1 || ok2;
    },
    setImageBlockWidth:
      width =>
      ({ commands }) =>
        commands.updateAttributes('imageFigure', { width: `${Math.max(0, Math.min(100, width))}%` }),
  }
},
});


