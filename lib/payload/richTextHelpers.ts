// lib/payload/richTextHelpers.ts

/**
 * ساختار Lexical JSON که Payload برمی‌گرداند:
 * {
 *   root: {
 *     type: 'root',
 *     children: [
 *       { type: 'heading', tag: 'h1'|'h2'..., children: [{ type: 'text', text: '...' }] },
 *       { type: 'paragraph', children: [...] },
 *       ...
 *     ]
 *   }
 * }
 */

export interface LexicalNode {
    type: string;
    tag?: string;
    text?: string;
    children?: LexicalNode[];
    [key: string]: any;
  }
  
  export interface HeadingItem {
    text: string;
    id: string;
    level: number;
  }
  
  /** استخراج متن از یک node Lexical */
  export function extractLexicalText(node: LexicalNode | string | null | undefined): string {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (node.text) return node.text;
    if (node.children) {
      return node.children.map(extractLexicalText).join('');
    }
    return '';
  }
  
  /** استخراج هدینگ‌ها از محتوای Lexical */
  export function extractHeadingsFromLexical(content: any): HeadingItem[] {
    if (!content || typeof content !== 'object') return [];
  
    const root = content.root;
    if (!root || !Array.isArray(root.children)) return [];
  
    const headings: HeadingItem[] = [];
    let index = 0;
  
    const walk = (nodes: LexicalNode[]) => {
      for (const node of nodes) {
        if (
          node.type === 'heading' &&
          node.tag &&
          /^h[1-6]$/.test(node.tag)
        ) {
          const text = extractLexicalText(node).trim();
          if (text) {
            headings.push({
              text,
              id: `toc-${index}`,
              level: Number(node.tag.replace('h', '')),
            });
            index++;
          }
        }
        if (node.children && node.type !== 'heading') {
          walk(node.children);
        }
      }
    };
  
    walk(root.children);
    return headings;
  }
  
  /** تخمین زمان خواندن از محتوای Lexical */
  export function estimateReadingTimeFromLexical(content: any): number {
    if (!content) return 1;
    try {
      const text = extractLexicalText(content.root || content);
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      return Math.max(1, Math.ceil(words / 200));
    } catch {
      return 1;
    }
  }
  
  /** گرفتن URL از فیلد upload Payload (ممکن است string یا object باشد) */
  export function getImageUrl(image: any): string | null {
    if (!image) return null;
    if (typeof image === 'string') return image;
    if (typeof image === 'object' && image.url) return image.url;
    return null;
  }