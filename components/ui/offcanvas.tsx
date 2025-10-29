'use client';

import React, { useState, useEffect } from 'react'

type OffcanvasProps = {
  children?: React.ReactNode
  title?: React.ReactNode
  btnStyle?: string
  position?: string
  size?: string
  openTransition?: string
  closeTransition?: string
  onClose?: unknown
  navbarSetIsOpen?: (isOpen: boolean) => void
  disabled?: boolean
}

const Offcanvas: React.FC<OffcanvasProps> = ({
  children,
  title,
  btnStyle,
  position,
  size,
  openTransition,
  closeTransition,
  onClose,
  navbarSetIsOpen,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
    if (navbarSetIsOpen) navbarSetIsOpen(isOpen)
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, navbarSetIsOpen])

  useEffect(() => {
    setIsOpen(false)
  }, [onClose])

  return (
    <div>
      <div className="w-full">
        <button type="button" className={btnStyle} onClick={() => setIsOpen(!isOpen)} disabled={disabled}>
          {title}
        </button>
      </div>

      <div
        className={`bg-white dark:bg-black  fixed ${position} p-4 transform space-y-7 offcanvas 
          ${isOpen ? `${openTransition}` : `${closeTransition}`}  ${size}  bg-black transition-transform duration-500 overflow-auto  z-[70] h-[calc(100%-50px)]`}
      >
        {children}
      </div>

      <div
        className={`fixed inset-0  transition-opcaity duration-500 ease-in-out  z-[60]   ${
          isOpen ? 'opacity-100 backdrop-blur-sm overflow-hidden overscroll-none' : 'opacity-0 invisible backdrop-blur-0 pointer-events-none'
        } `}
        onClick={() => setIsOpen(false)}
      />
    </div>
  )
}

export default Offcanvas