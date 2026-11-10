// src/lib/payload/tocHelpers.ts

export interface HeadingItem {
    text: string;
    id: string;
    level: number;
  }
  
  /**
   * استخراج متن از یک نود Lexical به‌صورت بازگشتی
   */
  function extractTextFromNode(node: any): string {
    if (!node) return '';
    if (typeof node.text === 'string') return node.text;
    if (Array.isArray(node.children)) {
      return node.children.map(extractTextFromNode).join('');
    }
    return '';
  }
  
  /**
   * ساخت slug ساده برای ID (پشتیبانی از فارسی)
   */
  export function slugifyHeading(text: string): string {
    return text
      .trim()
      .toLowerCase()
      .replace(/[\s\u200c]+/g, '-') // فاصله و نیم‌فاصله
      .replace(/[^\p{L}\p{N}\-]+/gu, '') // فقط حروف/اعداد/خط تیره
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  /**
   * پیمایش بازگشتی محتوای Lexical و پیدا کردن هدینگ‌ها
   * Payload ریشه را در root.children نگه می‌دارد
   */
  export function extractHeadingsFromLexical(
    content: any
  ): HeadingItem[] {
    const headings: HeadingItem[] = [];
    const usedIds = new Map<string, number>();
  
    const traverse = (nodes: any[]) => {
      if (!Array.isArray(nodes)) return;
  
      nodes.forEach((node) => {
        if (
          node.type === 'heading' &&
          typeof node.tag === 'string' &&
          /^h[1-6]$/.test(node.tag)
        ) {
          const text = extractTextFromNode(node).trim();
          if (text) {
            const level = Number(node.tag.replace('h', ''));
            let baseId = slugifyHeading(text) || `heading-${headings.length + 1}`;
  
            // اگر تکرار شد، شماره اضافه کن
            const count = usedIds.get(baseId) || 0;
            usedIds.set(baseId, count + 1);
            const id = count > 0 ? `${baseId}-${count}` : baseId;
  
            headings.push({ text, id, level });
          }
        }
  
        if (Array.isArray(node.children)) {
          traverse(node.children);
        }
      });
    };
  
    // ساختار Payload: content.root.children
    if (content?.root?.children) {
      traverse(content.root.children);
    } else if (Array.isArray(content)) {
      traverse(content);
    }
  
    return headings;
  }