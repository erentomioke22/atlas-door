// components/admin/adminSidebar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ImageCom from '@/components/ui/Image';
import {
  IoGridOutline,
  IoBagOutline,
  IoDocumentTextOutline,
  IoChatbubbleOutline,
  IoPeopleOutline,
  IoCartOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
  IoCloseOutline,
} from 'react-icons/io5';
import { HiMenuAlt3 } from 'react-icons/hi';
import type { Session } from '@/lib/auth';

const MENU_ITEMS = [
  { href: '/admin', label: 'داشبورد', icon: IoGridOutline },
  { href: '/admin/orders', label: 'سفارشات', icon: IoCartOutline },
  { href: '/admin/comments', label: 'کامنت‌ها', icon: IoChatbubbleOutline },
  { href: '/admin/users', label: 'کاربران', icon: IoPeopleOutline },
  { href: '/admin/products', label: 'محصولات', icon: IoBagOutline },
  { href: '/admin/posts', label: 'مقالات', icon: IoDocumentTextOutline },
  { href: '/admin/notifications', label: 'اعلان‌ها', icon: IoNotificationsOutline },
  { href: '/admin/settings', label: 'تنظیمات', icon: IoSettingsOutline },
];

export default function AdminSidebar({ session }: { session: Session }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ====== موبایل ====== */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg"
        aria-label="باز کردن منو"
      >
        <HiMenuAlt3 className="text-xl" />
      </button>

      {/* ====== Overlay موبایل ====== */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ====== Sidebar ====== */}
      <aside
        className={`
          fixed top-0 right-0 h-screen w-64 z-50
          bg-white dark:bg-neutral-900
          border-l-2 border-lcard dark:border-dcard
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* هدر */}
        <div className="p-4 border-b border-lcard dark:border-dcard">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {session.user.image ? (
                <ImageCom
                  src={session.user.image}
                  alt={session.user.name || ''}
                  className="w-10 h-10 rounded-xl"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-redorange to-yellow" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {session.user.displayName || session.user.name}
                </p>
                <p className="text-xs text-neutral-500">ادمین</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-neutral-500"
              aria-label="بستن"
            >
              <IoCloseOutline className="text-2xl" />
            </button>
          </div>
        </div>

        {/* منو */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-colors duration-200
                  ${
                    isActive
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'hover:bg-lcard dark:hover:bg-dcard'
                  }
                `}
              >
                <Icon className="text-lg" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}

          {/* لینک به سایت */}
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-lcard dark:hover:bg-dcard mt-4 border-t border-lcard dark:border-dcard pt-4"
          >
            <span className="text-sm text-neutral-500">← بازگشت به سایت</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}