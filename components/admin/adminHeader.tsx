// components/admin/adminHeader.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import type { Session } from '@/lib/auth';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'داشبورد',
  '/admin/orders': 'مدیریت سفارشات',
  '/admin/comments': 'مدیریت کامنت‌ها',
  '/admin/users': 'مدیریت کاربران',
  '/admin/products': 'مدیریت محصولات',
  '/admin/posts': 'مدیریت مقالات',
  '/admin/notifications': 'اعلان‌ها',
  '/admin/settings': 'تنظیمات',
};

export default function AdminHeader({ session }: { session: Session }) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || 'ادمین پنل';

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b-2 border-lcard dark:border-dcard">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="text-sm text-neutral-500">
          {new Date().toLocaleDateString('fa-IR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </header>
  );
}