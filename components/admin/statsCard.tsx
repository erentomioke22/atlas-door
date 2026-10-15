// components/admin/statsCard.tsx
import React from 'react';
import Link from 'next/link';

interface StatsCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'red';
  href?: string;
}

const COLOR_MAP = {
  blue: 'from-blue-500 to-blue-600 text-white',
  green: 'from-green-500 to-green-600 text-white',
  yellow: 'from-yellow-500 to-yellow-600 text-white',
  purple: 'from-purple-500 to-purple-600 text-white',
  orange: 'from-orange-500 to-orange-600 text-white',
  red: 'from-red-500 to-red-600 text-white',
};

export default function StatsCard({
  title,
  value,
  suffix,
  icon,
  color,
  href,
}: StatsCardProps) {
  const content = (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-4
        bg-linear-to-br ${COLOR_MAP[color]}
        hover:scale-[1.02] transition-transform duration-200
        cursor-pointer
      `}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm opacity-90">{title}</span>
          <span className="text-2xl opacity-80">{icon}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{value}</span>
          {suffix && <span className="text-xs opacity-80">{suffix}</span>}
        </div>
      </div>

      {/* Decoration */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-white/10" />
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}