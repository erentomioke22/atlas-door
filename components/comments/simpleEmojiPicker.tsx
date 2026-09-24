// components/comments/simpleEmojiPicker.tsx
'use client';

import React, { useState } from 'react';

// ====== دسته‌بندی ایموجی‌ها ======
const EMOJI_CATEGORIES = {
  reactions: {
    label: 'واکنش‌ها',
    icon: '😀',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
      '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗',
      '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝',
      '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑',
      '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔',
      '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
      '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳',
      '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯',
      '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥',
      '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩',
      '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿',
    ],
  },
  hands: {
    label: 'دست‌ها',
    icon: '👍',
    emojis: [
      '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
      '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️',
      '🖖', '👋', '🤝', '🙏', '✍️', '💪', '🦾',
      '👏', '🙌', '👐', '🤲', '🤜', '🤛', '✊', '👊',
    ],
  },
  hearts: {
    label: 'قلب‌ها',
    icon: '❤️',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
      '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
      '💘', '💝', '💟', '♥️', '💌', '💋', '🫶', '🫀',
    ],
  },
  symbols: {
    label: 'نمادها',
    icon: '⭐',
    emojis: [
      '⭐', '🌟', '✨', '💫', '⚡', '🔥', '💥', '💢',
      '💯', '✅', '❌', '❓', '❗', '💬', '💭', '🗯️',
      '♻️', '🔱', '⚜️', '🔰', '⭕', '🚫', '⚠️', '☢️',
      '🆗', '🆒', '🆕', '🆓', '🔴', '🟠', '🟡', '🟢',
      '🔵', '🟣', '⚫', '⚪', '🟤',
    ],
  },
  objects: {
    label: 'اشیا',
    icon: '🎁',
    emojis: [
      '🎁', '🎉', '🎊', '🎈', '🎀', '🏆', '🥇', '🥈',
      '🥉', '🏅', '👑', '💎', '🔔', '📢', '📣', '📌',
      '📍', '🔖', '🏷️', '💰', '💳', '💵', '💴', '💶',
      '💷', '🪙', '💸', '🛒', '🛍️', '📦', '🚚', '📮',
    ],
  },
  nature: {
    label: 'طبیعت',
    icon: '🌸',
    emojis: [
      '🌸', '🌹', '🌺', '🌻', '🌷', '🌼', '🍀', '🌿',
      '🍃', '🌱', '🌴', '🌳', '🌲', '🌵', '🌾', '💐',
      '🌞', '🌝', '🌚', '🌙', '⭐', '🌟', '🌈', '☀️',
      '⛅', '🌤️', '🌦️', '🌧️', '⛈️', '🌩️', '❄️', '💧',
    ],
  },
} as const;

type CategoryKey = keyof typeof EMOJI_CATEGORIES;

interface SimpleEmojiPickerProps {
  onSelect: (emoji: string) => void;
  className?: string;
}

export default function SimpleEmojiPicker({
  onSelect,
  className = '',
}: SimpleEmojiPickerProps) {
  const [activeCategory, setActiveCategory] =
    useState<CategoryKey>('reactions');

  const categories = Object.entries(EMOJI_CATEGORIES) as Array<
    [CategoryKey, (typeof EMOJI_CATEGORIES)[CategoryKey]]
  >;

  return (
    <div
      className={`
        w-72 max-w-[calc(100vw-40px)]
        bg-white dark:bg-black
        border-2 border-lcard dark:border-dcard
        rounded-2xl shadow-2xl
        overflow-auto
        ${className}
      `}
    >
      {/* ====== تب‌های دسته‌بندی ====== */}
      <div className="flex border-b border-lcard dark:border-dcard overflow-x-auto">
        {categories.map(([key, cat]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveCategory(key)}
            title={cat.label}
            aria-label={cat.label}
            className={`
              flex-none px-3 py-2 text-lg transition-colors
              ${
                activeCategory === key
                  ? 'bg-lcard dark:bg-dcard'
                  : 'hover:bg-lcard/50 dark:hover:bg-dcard/50'
              }
            `}
          >
            {cat.icon}
          </button>
        ))}
      </div>

      {/* ====== ایموجی‌ها ====== */}
      <div className="p-2 grid grid-cols-8 gap-0.5 max-h-44 overflow-y-auto">
        {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, i) => (
          <button
            key={`${activeCategory}-${i}`}
            type="button"
            onClick={() => onSelect(emoji)}
            title={emoji}
            className="text-xl p-1.5 rounded-lg hover:bg-lcard dark:hover:bg-dcard transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}