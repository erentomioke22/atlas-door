// components/comments/commentTextArea.tsx
'use client';

import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import SimpleEmojiPicker from './simpleEmojiPicker';
import TextArea from '../ui/TextArea';
interface CommentTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
}

const CommentTextArea = forwardRef<HTMLTextAreaElement, CommentTextAreaProps>(
  (
    {
      value,
      onChange,
      placeholder = 'نظر خود را بنویسید...',
      error,
      maxLength = 500,
      disabled = false,
    },
    ref
  ) => {
    const [showEmoji, setShowEmoji] = useState(false);
    const [pickerPosition, setPickerPosition] = useState<'top' | 'bottom'>(
      'top'
    );
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const pickerRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    // ✅ ترکیب refها
    const setRefs = (el: HTMLTextAreaElement | null) => {
      textareaRef.current = el;
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
          el;
      }
    };

    // ✅ بستن picker با کلیک بیرون
    useEffect(() => {
      if (!showEmoji) return;

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;

        // اگه کلیک روی picker یا button نبود، ببند
        if (
          pickerRef.current &&
          !pickerRef.current.contains(target) &&
          buttonRef.current &&
          !buttonRef.current.contains(target)
        ) {
          setShowEmoji(false);
        }
      };

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setShowEmoji(false);
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [showEmoji]);

    // ✅ محاسبه موقعیت picker
    useEffect(() => {
      if (!showEmoji || !buttonRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      // اگه فضای کافی پایین نبود، برو بالا
      const pickerHeight = 320; // ارتفاع تقریبی picker

      if (spaceBelow < pickerHeight && spaceAbove > spaceBelow) {
        setPickerPosition('top');
      } else {
        setPickerPosition('bottom');
      }
    }, [showEmoji]);

    // ✅ اضافه کردن ایموجی در محل cursor
    const handleEmojiSelect = useCallback(
      (emoji: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.slice(0, start) + emoji + value.slice(end);

        onChange(newValue);

        // ✅ برگردوندن focus و cursor
        requestAnimationFrame(() => {
          textarea.focus();
          const newPos = start + emoji.length;
          textarea.setSelectionRange(newPos, newPos);
        });
      },
      [value, onChange]
    );

    const remaining = maxLength - value.length;
    const isNearLimit = remaining < 50;
    const isOverLimit = remaining < 0;

    return (
      <div className="w-full relative">
<TextArea
ref={setRefs}
value={value}
onChange={(e) => onChange(e.target.value)}
placeholder={placeholder}
disabled={disabled}
maxLength={maxLength}
rows={2}
spellCheck="false"
className={`resize-none w-full appearance-none  rounded-xl px-3 py-3 block  text-sm focus:outline-none dark:bg-dcard  bg-lcard  duration-200
  ${
    error
      ? 'border-red  focus:ring-2 ring-red'
      : 'focus:ring-2 ring-black dark:ring-white'
  }
  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
`}
/>

        {/* ====== نوار پایین: Emoji + Counter ====== */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
          {/* ✅ دکمه Emoji */}
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setShowEmoji((prev) => !prev)}
              disabled={disabled}
              aria-label="افزودن ایموجی"
              title="افزودن ایموجی"
              className={`
                p-1.5 rounded-lg transition-colors max-md:hidden
                ${
                  showEmoji
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'hover:bg-black/10 dark:hover:bg-white/10 text-neutral-500'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <BsEmojiSmile className="text-lg" />
            </button>

            {/* ✅ Emoji Picker - absolute position */}
            {showEmoji && (
              <div
                ref={pickerRef}
                className={`
                  absolute right-0 z-100 max-md:hidden
                  ${pickerPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
                `}
              >
                <SimpleEmojiPicker onSelect={handleEmojiSelect} />
              </div>
            )}
          </div>

          {/* شمارنده */}
          <span
            className={`
              text-[10px] transition-colors
              ${
                isOverLimit
                  ? 'text-red-500 font-bold'
                  : isNearLimit
                    ? 'text-orange-500'
                    : 'text-neutral-400'
              }
            `}
          >
            {value.length}/{maxLength}
          </span>
        </div>

        {/* ====== خطا ====== */}
        {error && (
          <p className="text-red-500 text-[10px] mt-1">{error}</p>
        )}
      </div>
    );
  }
);

CommentTextArea.displayName = 'CommentTextArea';

export default CommentTextArea;

