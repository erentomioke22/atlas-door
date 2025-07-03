


"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

const Drawer = ({
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
  const [isOpen, setIsOpen] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartRef = useRef(0);
  const isSwipingRef = useRef(false);
  const drawerRef = useRef(null);

  // Handle body overflow
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  // Handle external close
  useEffect(() => {
    setIsOpen(false);
  }, [onClose]);

  // Swipe handlers
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientY;
    isSwipingRef.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isSwipingRef.current) return;
    
    const currentTouch = e.touches[0].clientY;
    const drawerHeight = drawerRef.current?.offsetHeight || 0;
    const newOffset = Math.min(Math.max(currentTouch - touchStartRef.current, 0), drawerHeight);
    
    setSwipeOffset(newOffset);
  };

  const handleTouchEnd = () => {
    if (!isSwipingRef.current) return;
    
    const drawerHeight = drawerRef.current?.offsetHeight || 0;
    const shouldClose = swipeOffset > drawerHeight * 0.3;
    
    if (shouldClose) {
      setIsOpen(false);
    }
    
    setSwipeOffset(0);
    isSwipingRef.current = false;
  };

  // Calculate transform based on swipe
  const getTransform = () => {
    if (isOpen && swipeOffset === 0) return 'translateY(0)';
    if (!isOpen && swipeOffset === 0) return 'translateY(100%)';
    
    return `translateY(calc(100% - ${swipeOffset}px))`;
  };

  return (
    <div>
      <div className="w-full">
        <button 
          type="button" 
          className={btnStyle} 
          onClick={() => setIsOpen(!isOpen)} 
          disabled={disabled}
        >
          {title}
        </button>
      </div>
     
      {/* Bottom Drawer */}
      <div
        ref={drawerRef}
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-black rounded-t-xl shadow-xl ${size} transition-transform duration-300 overflow-hidden z-[70] px-2 `}
        style={{
          ...style,
          transform: getTransform(),
          touchAction: 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle indicator */}
        <div className="flex justify-center ">
          <div className="w-12 h-1.5 bg-gray-600 dark:bg-gray-800 rounded-full" />
        </div>
        
        {header && (
          <div className={`flex justify-between items-center px-4 ${headerStyle}`}>
            {header}
            <button onClick={() => setIsOpen(false)} className="p-2">
              <IoClose className="text-2xl" />
            </button>
          </div>
        )}
        
        <div className="overflow-y-auto h-[calc(100%-50px)] ">
          {children}
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 transition-opacity duration-300 z-[60] ${
          isOpen ? "opacity-100 backdrop-blur-sm" : "opacity-0 pointer-events-none backdrop-blur-0"
        }`}
        onClick={() => setIsOpen(false)}
      />
    </div>
  );
};

export default Drawer;

      {/* <div
        className={`bg-white dark:bg-black ring-1 ring-lcard dark:ring-dcard  max-md:fixed max-md:bottom-0 max-md:left-0 max-md:p-4 max-md:transform max-md:space-y-7 max-md:offcanvas 
          ${isOpen  ? `max-md:translate-y-0  md:opacity-100 md:scale-100 md:visible` : `max-md:translate-y-full md:opacity-0 md:scale-95 md:invisible md:pointer-events-none`}  ${className} 
           max-md:bg-black max-md:transition-transform max-md:duration-500 max-md:overflow-auto  max-md:z-[70] md:transition-all md:duration-150 md:ease-in-out md:transform
           md:absolute md:mt-1 md:rounded-3xl md:max-w-[calc(100vw-20px)]   md:shadow-sm md:py-5  md:z-50
           ${isUp ? 'md:bottom-full ' : ''}
           `}
      >
        {children}
      </div>



        <div
          className={` max-md:inset-0  max-md:transition-opcaity max-md:duration-500 max-md:ease-in-out  max-md:z-[60]   ${
          isOpen ? "max-md:fixed max-md:backdrop-blur-sm max-md:overflow-hidden max-md:overscroll-none" : " max-md:invisible max-md:backdrop-blur-0"
        } `}
          onClick={() => setIsOpen(false)}
       /> */}