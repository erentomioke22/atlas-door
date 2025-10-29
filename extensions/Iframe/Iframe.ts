import { Node } from '@tiptap/core'

interface IframeAttributes {
  src: string | null;
  frameborder: number;
  loading: string;
  allowfullscreen: boolean;
}

interface IframeOptions {
  allowFullscreen: boolean;
  HTMLAttributes: {
    class: string;
  };
}

export const Iframe = Node.create<IframeOptions, IframeAttributes>({
  name: 'iframe',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: 'iframe-wrapper',
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      loading: {
        default: 'lazy',
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
    }
  },

  parseHTML() {
    return [{
      tag: 'iframe',
    }]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['div', this.options.HTMLAttributes, ['iframe', HTMLAttributes]]
  },

  addCommands() {
    return {
      setIframe: (options: IframeAttributes) => ({ tr, dispatch }: any) => {
        const { selection } = tr
        const node = this.type.create(options)

        if (dispatch) {
          tr.replaceRangeWith(selection.from, selection.to, node)
        }

        return true
      },
    }
  },
})

export default Iframe;