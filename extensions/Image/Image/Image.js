import { Image as BaseImage } from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes } from "@tiptap/core";
import ImageView from "@extensions/Image/components/ImageView";
// import ImageBlockView from '@extensions/ImageBlock/components/ImageBlockView'

export const Image = BaseImage.extend({
  group: "block",
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => ({
          src: attributes.src,
        }),
      },
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align"),
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
      },
      alt: {
        default: "blog image",
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => ({
          alt: attributes.alt,
        }),
      },
      width: {
        default: "100%",
        parseHTML: (element) => element.getAttribute("data-width"),
        renderHTML: (attributes) => ({
          "data-width": attributes.width,
        }),
      },
      // caption: {
      //   default: '',
      //   parseHTML: element => element.querySelector('figcaption')?.innerHTML,
      //   renderHTML: attributes => ({ 'data-caption': attributes.caption, }),
      // },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  // renderHTML({ HTMLAttributes }) { 
  // return [ 'div', {class: 'image-cover' }, 
  // [ 'div', { class: 'image-loader' }, ], 
  // ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)], ]; },


  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        if ($from.parent.type.name === "imageFigure") {
          return editor.commands.deleteNode("imageFigure");
        }
        return false;
      },
      Enter: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        if ($from.parent.type.name === "imageFigure") {
          const tr = editor.state.tr.insert(
            $from.before(),
            editor.schema.nodes.paragraph.create()
          );
          editor.view.dispatch(tr);

          const newParagraphPos = $from.before() - 1;

          if (
            newParagraphPos >= 0 &&
            editor.state.doc.nodeAt(newParagraphPos)
          ) {
            editor.commands.setNodeSelection(newParagraphPos);
            editor.chain().focus(newParagraphPos).run();
          }
          return true;
        }
        return false;
      },
      // any: ({ editor, event }) => {
      //   const { selection } = editor.state;
      //   const { $from } = selection;

      //   if ($from.parent.type.name === "imageFigure") {
      //     event.preventDefault();
      //     const pos = $from.after();

      //     let figcaption = $from.nodeAfter;

      //     if (!figcaption || figcaption.type.name !== "figcaption") {
      //       // Create a new figcaption and focus on it
      //       const figcaptionPos = pos; // No need to adjust based on nodeSize as it's new
      //       editor
      //         .chain()
      //         .insertContentAt(figcaptionPos, {
      //           type: "figcaption",
      //           content: [{ type: "text", text: event.key }],
      //         })
      //         .focus(figcaptionPos)
      //         .run();
      //     } else {
      //       // Focus on the existing figcaption
      //       const figcaptionPos = pos + figcaption.nodeSize;
      //       editor.chain().focus(figcaptionPos).run();
      //     }
      //   }
      //   return false;
      // },
      any: ({ editor, event }) => {
        const { selection } = editor.state;
        const { $from } = selection;
      
        if ($from.parent.type.name === 'imageFigure') {
          event.preventDefault();
          const pos = $from.after();
          let figcaption = $from.nodeAfter;
      
          if (!figcaption || figcaption.type.name !== 'figcaption') {
            // Create a new figcaption with a paragraph
            const figcaptionPos = pos;
            editor
              .chain()
              .insertContentAt(figcaptionPos, {
                type: 'figcaption',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: event.key }] }],
              })
              .focus(figcaptionPos)
              .run();
          } else {
            // Focus on the existing figcaption
            const paragraphPos = pos + 1; // Adjust for paragraph structure
            editor.chain().focus(paragraphPos).run();
          }
        }
        return false;
      },
      
    };
  },

  addCommands() {
    return {

        // setImage:
        //   attrs =>
        //     ({ commands }) => { return commands.insertContent({ type: 'image', attrs: { src: attrs.src } })},

      // setImageBlockAlign:
      //   align =>
      //   ({ commands }) => commands.updateAttributes('imageBlock', { align }),
    }
  },



  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});

export default Image;



