'use client';

import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaBook } from 'react-icons/fa6';
import Offcanvas from '../ui/offcanvas';
import type { PortableTextBlock } from '@portabletext/types';

interface HeadingItem {
  text: string;
  id: string;
  level: number;
}

interface TableOfContentsProps {
  content: PortableTextBlock[] | undefined;
  postId?: string;
}

function extractHeadings(content: PortableTextBlock[] | undefined): HeadingItem[] {
  if (!content || !Array.isArray(content)) return [];

  const headings: HeadingItem[] = [];
  const headingStyles = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

  content.forEach((block, index) => {
    if (
      block._type === 'block' &&
      block.style &&
      (headingStyles as readonly string[]).includes(block.style)
    ) {
      const text = block.children
        ?.map((child: any) => child.text)
        .join('')
        .trim();

      if (text) {
        const level = Number(block.style.replace('h', ''));
        headings.push({
          text,
          id: `toc-${index}`,
          level,
        });
      }
    }
  });

  return headings;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content, postId }) => {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [onClose, setOnClose] = useState<boolean>(false);

  // ====== استخراج هدینگ‌ها از PortableText ======
  useEffect(() => {
    const extracted = extractHeadings(content);
    setHeadings(extracted);
  }, [content, postId]);

  // ====== اضافه کردن id به هدینگ‌های رندرشده در DOM ======
  useEffect(() => {
    if (headings.length === 0) return;

    const contentEl = document.querySelector('.content');
    if (!contentEl) return;

    const elements = contentEl.querySelectorAll<HTMLHeadingElement>(
      'h1, h2, h3, h4, h5, h6'
    );

    // اضافه کردن id به هدینگ‌ها
    elements.forEach((el, idx) => {
      if (!el.id) {
        el.id = `toc-${idx}`;
      }
    });

    // ====== IntersectionObserver برای ردیابی هدینگ فعال ======
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement);

        if (visibleHeadings.length > 0) {
          setActiveId(visibleHeadings[0].id);
        }
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 0 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  // ====== کلیک روی هدینگ ======
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 120,
        behavior: 'smooth',
      });
      setActiveId(id);
      setIsOpen(false);
    }
  };

  // ====== اگر هدینگی وجود نداره، نمایش نده ======
  if (headings.length === 0) return null;

  return (
    <div>
      <Offcanvas
        title={<FaBook />}
        btnStyle={'bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg'}
        position={'max-md:bottom-0 max-md:left-0 md:top-0 md:right-0'}
        size={
          'max-md:h-2/4 max-md:w-full md:h-screen md:w-96 max-md:border-t-2 border-lcard dark:border-dcard max-md:rounded-t-3xl md:border-l-2'
        }
        openTransition={'max-md:translate-y-0 md:translate-x-0'}
        closeTransition={'max-md:translate-y-full md:translate-x-full'}
        onClose={onClose}
        disabled={false}
      >
        <div className="py-2">
          <div className="flex justify-between">
            <h1 className="text-xl">فهرست مطالب</h1>
            <button
              aria-label="close button"
              title="close button"
              className={
                'text-lg bg-lcard dark:bg-dcard px-2 py-1 rounded-full border-2 text-neutral-500 dark:text-neutral-300'
              }
              onClick={() => setOnClose(!onClose)}
              type="button"
            >
              <IoClose />
            </button>
          </div>
          <div className="p-1 h-full space-y-3 text-sm my-5">
            {headings.map((heading, index) => (
              <button
                key={index}
                style={{ paddingRight: `${(heading.level - 1) * 12}px` }}
                className={`w-full rounded-md font-semibold duration-300 text-wrap line-clamp-2 text-start ${
                  activeId === heading.id
                    ? 'underline decoration-2 text-black dark:text-white'
                    : 'hover:text-black dark:hover:text-white text-neutral-500 dark:text-neutral-300'
                }`}
                title={heading.text}
                onClick={() => handleClick(heading.id)}
              >
                {heading.text}
              </button>
            ))}
          </div>
        </div>
      </Offcanvas>
    </div>
  );
};

export default TableOfContents;