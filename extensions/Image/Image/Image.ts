import { Image as BaseImage } from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes } from "@tiptap/core";
import ImageView from "@/extensions/Image/components/ImageView";

interface ImageOptions {
  HTMLAttributes?: Record<string, any>;
}

interface ImageAttributes {
  src: string;
  align: string;
  alt: string;
  width: string;
}

export const Image = BaseImage.extend<ImageOptions, ImageAttributes>({
  group: "block",
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (element: HTMLElement) => element.getAttribute("src"),
        renderHTML: (attributes: ImageAttributes) => ({
          src: attributes.src,
        }),
      },
      align: {
        default: "center",
        parseHTML: (element: HTMLElement) => element.getAttribute("data-align"),
        renderHTML: (attributes: ImageAttributes) => ({
          "data-align": attributes.align,
        }),
      },
      alt: {
        default: "blog image",
        parseHTML: (element: HTMLElement) => element.getAttribute("alt"),
        renderHTML: (attributes: ImageAttributes) => ({
          alt: attributes.alt,
        }),
      },
      width: {
        default: "100%",
        parseHTML: (element: HTMLElement) => element.getAttribute("data-width"),
        renderHTML: (attributes: ImageAttributes) => ({
          "data-width": attributes.width,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes || {}, HTMLAttributes),
    ];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }: { editor: any }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        if ($from.parent.type.name === "imageFigure") {
          return editor.commands.deleteNode("imageFigure");
        }
        return false;
      },
      Enter: ({ editor }: { editor: any }) => {
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
    };
  },

  addCommands() {
    return {
      // Commands can be added here if needed
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});

export default Image;