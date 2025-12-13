'use client';

import React, { useState, useEffect, useRef } from 'react'
import { IoClose } from 'react-icons/io5'

type DrawerProps = {
  children?: React.ReactNode
  title?: React.ReactNode
  header?: React.ReactNode
  headerStyle?: string
  btnStyle?: string
  size?: string
  onClose?: boolean
  disabled?: boolean
  style?: React.CSSProperties
  position?: string
}

const Drawer: React.FC<DrawerProps> = ({
  children,
  title,
  header,
  headerStyle,
  btnStyle,
  size,
  onClose,
  disabled,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const touchStartRef = useRef(0)
  const isSwipingRef = useRef(false)
  const drawerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  useEffect(() => {
    setIsOpen(false)
  }, [onClose])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.touches[0].clientY
    isSwipingRef.current = true
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSwipingRef.current) return
    const currentTouch = e.touches[0].clientY
    const drawerHeight = drawerRef.current?.offsetHeight || 0
    const newOffset = Math.min(Math.max(currentTouch - touchStartRef.current, 0), drawerHeight)
    setSwipeOffset(newOffset)
  }

  const handleTouchEnd = () => {
    if (!isSwipingRef.current) return
    const drawerHeight = drawerRef.current?.offsetHeight || 0
    const shouldClose = swipeOffset > drawerHeight * 0.3
    if (shouldClose) {
      setIsOpen(false)
    }
    setSwipeOffset(0)
    isSwipingRef.current = false
  }

  const getTransform = () => {
    if (isOpen && swipeOffset === 0) return 'translateY(0)'
    if (!isOpen && swipeOffset === 0) return 'translateY(100%)'
    return `translateY(calc(100% - ${swipeOffset}px))`
  }

  return (
    <div>
      <div className="w-full">
        <button type="button" className={btnStyle} onClick={() => setIsOpen(!isOpen)} disabled={disabled} title='drawer button'>
          {title}
        </button>
      </div>

      <div
        ref={drawerRef}
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-black rounded-t-xl shadow-xl transform ${size} transition-transform duration-500 
  ${isOpen ? `translate-y-0` : `translate-y-full`} overflow-hidden z-70 px-2 offcanvas`}
        style={{
          ...style,
          transform: getTransform(),
          touchAction: 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* <div className="flex justify-center ">
          <div className="w-12 h-1.5 bg-gray-600 dark:bg-gray-800 rounded-full" />
        </div> */}

        {header && (
          <div className={`flex justify-between items-center px-4 ${headerStyle}`}>
            {header}
            <button onClick={() => setIsOpen(false)} className="p-2" aria-label='close button'>
              <IoClose className="text-2xl" />
            </button>
          </div>
        )}

        <div className="overflow-y-auto h-[calc(100%-50px)] ">{children}</div>
      </div>

      <div
        className={`fixed inset-0  transition-opcaity duration-500 ease-in-out  z-60   ${
          isOpen ? 'opacity-100 backdrop-blur-sm overflow-hidden overscroll-none' : 'opacity-0 invisible backdrop-blur-0 pointer-events-none'
        } `}
        onClick={() => setIsOpen(false)}
      />
    </div>
  )
}

export default Drawer
