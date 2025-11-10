'use client'

import React from 'react'
import clsx from 'clsx'

type Variant =
  | 'simple'
  | 'home'
  | 'darkMode'
  | 'menu'
  | 'menuActive'
  | 'close'
  | 'delete'
  | 'empty'
  | 'primary' // kept as default token used in file

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  className?: string
  children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyles =
    'font-medium transition duration-300 disabled:brightness-90  disabled:cursor-not-allowed'

  const variantStyles: Record<Variant, string> = {
    simple: '',
    home:
      'bg-lcard dark:bg-dcard border-2 border-lcard dark:border-dcard hover:brightness-95 dark:hover:brightness-125',
    darkMode:
      ' w-full rounded-lg  hover:bg-lcard dark:hover:bg-dcard sm:hover:text-black sm:dark:hover:text-white sm:text-lfont duration-500',
    menu: 'bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full ',
    menuActive:
      'bg-black dark:bg-white text-white dark:border-white dark:text-black rounded-full border-2 border-black',
    close: 'bg-lcard dark:bg-dcard rounded-full border-2 text-lfont',
    delete: 'bg-transparent text-redorange border-2 rounded-full',
    empty: '',
    primary: '',
  }

  return (
    <button className={clsx(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </button>
  )
}

export default Button