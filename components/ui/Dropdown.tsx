import React, { useState, useEffect, useRef } from 'react'

type DropdownProps = {
  children?: React.ReactNode
  title: React.ReactNode
  close?: unknown
  className?: string
  btnStyle?: string
  disabled?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({ children, title, close, className, btnStyle, disabled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [isUp, setIsUp] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [close])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - dropdownRect.bottom
      const spaceAbove = dropdownRect.top

      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setIsUp(true)
      } else {
        setIsUp(false)
      }
    }
  }, [isOpen])

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`${btnStyle} focus:outline-none disabled:cursor-not-allowed`}
        disabled={disabled}
        title='dropdown button'
      >
        {title}
      </button>
      <div
        className={`transition-all duration-150 ease-in-out transform  ${
          isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'
        } ${className} absolute mt-1 rounded-3xl max-w-[calc(100vw-20px)]   shadow-sm py-5 bg-white dark:bg-black z-50 ring-1 ring-lcard dark:ring-dcard 
        ${isUp ? 'bottom-full ' : ''}  
        `}
      >
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Dropdown;



