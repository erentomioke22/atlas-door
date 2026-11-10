'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'simple' | 'home' | 'darkMode' | 'menu' | 'menuActive' | 'close' | 'delete' | 'empty' | 'primary' | 'back' | 'submit';

type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string
  children?: React.ReactNode
  title?:string
  ariaLabel?:string
}

const variants: Record<Variant, string> = {
  default:'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200',
  outline:'border border-lcard dark:border-dcard hover:bg-lcard dark:hover:bg-dcard',
  ghost: 'hover:bg-lcard dark:hover:bg-dcard',
  destructive: 'bg-red text-white hover:bg-red/90',
  secondary: 'bg-lcard dark:bg-dcard hover:bg-lcard/80 dark:hover:bg-dcard/80',
  simple: '',
  home:'bg-lcard dark:bg-dcard text-lg p-2 rounded-lg hover:brightness-95 dark:hover:brightness-125',
  darkMode:'profile-link',
  menu: 'bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full ',
  menuActive:'bg-black dark:bg-white text-white dark:border-white dark:text-black rounded-full border-2 border-black',
  close: 'bg-lcard dark:bg-dcard rounded-full border-2 border-current text-lfont hover:brightness-75',
  submit: 'bg-black dark:bg-white rounded-xl border-2 border-current text-white dark:text hover:brightness-75',
  delete: 'bg-transparent text-redorange border-2 border-current rounded-full',
  empty: '',
  primary: '',
  back: 'text-neutral-500 dark:text-neutral-300 hover:text-black dark:hover:text-white',
};

const sizes: Record<Size, string> = {
  sm: ' px-3 text-xs',
  md: ' px-2 py-2 text-md',
  lg: ' px-6 text-base',
  icon: ' w-10',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
);
Button.displayName = 'Button';