'use client';

import { useEffect, useState, useMemo } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaBook } from 'react-icons/fa6';
import Offcanvas from '../ui/offcanvas';
import { Button } from '../ui/button';
import {
  extractHeadingsFromLexical,
  type HeadingItem,
} from '@/lib/payload/tocHelpers';

interface TableOfContentsProps {
  content: any; // محتوای Lexical از Payload
  postId?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  content,
  postId,
}) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [onClose, setOnClose] = useState<boolean>(false);

  // ====== استخراج هدینگ‌ها ======
  const headings: HeadingItem[] = useMemo(
    () => extractHeadingsFromLexical(content),
    [content]
  );

  // ====== اضافه کردن id به هدینگ‌های رندرشده در DOM + ردیابی هدینگ فعال ======
  useEffect(() => {
    if (headings.length === 0) return;

    const contentEl = document.querySelector('.content');
    if (!contentEl) return;

    const elements = contentEl.querySelectorAll<HTMLHeadingElement>(
      'h1, h2, h3, h4, h5, h6'
    );

    // اگر تعداد هدینگ‌های DOM با هدینگ‌های استخراج شده برابر است، id بگذار
    const usable = Array.from(elements).slice(0, headings.length);
    usable.forEach((el, idx) => {
      el.id = headings[idx].id;
      // برای اسکرول نرم با هدر ثابت
      el.style.scrollMarginTop = '120px';
    });

    // ====== IntersectionObserver ======
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId((visible[0].target as HTMLElement).id);
        }
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 }
    );

    usable.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings, postId]);

  // ====== کلیک روی هدینگ ======
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 120,
        behavior: 'smooth',
      });
      setActiveId(id);
      setIsOpen(false);
      setOnClose(true);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div>
      <Offcanvas
        title={<FaBook />}
        btnStyle="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"
        position="max-md:bottom-0 max-md:left-0 md:top-0 md:right-0"
        size="max-md:h-2/4 max-md:w-full md:h-screen md:w-96 max-md:border-t-2 border-lcard dark:border-dcard max-md:rounded-t-3xl md:border-l-2"
        openTransition="max-md:translate-y-0 md:translate-x-0"
        closeTransition="max-md:translate-y-full md:translate-x-full"
        onClose={onClose}
        disabled={false}
      >
        <div className="py-2">
          <div className="flex justify-between">
            <h1 className="text-xl">فهرست مطالب</h1>
            <Button
              aria-label="close button"
              title="close button"
              variant="close"
              onClick={() => setOnClose(!onClose)}
              type="button"
            >
              <IoClose />
            </Button>
          </div>
          <div className="p-1 h-full space-y-3 text-sm my-5 overflow-y-auto max-h-[75vh]">
            {headings.map((heading) => (
              <button
                key={heading.id}
                style={{
                  paddingRight: `${(heading.level - 1) * 12}px`,
                }}
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