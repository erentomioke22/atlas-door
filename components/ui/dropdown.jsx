import React, { useState, useEffect, useRef } from "react";

const Dropdown = ({ children, title, close, className, btnStyle, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isUp, setIsUp] = useState(false);
  // const [isLeft, setIsLeft] = useState(false);


  useEffect(() => {
    setIsOpen(false);
  }, [close]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - dropdownRect.bottom;
      const spaceAbove = dropdownRect.top;

      
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setIsUp(true);
      } else {
        setIsUp(false);
      }

    }
  }, [isOpen]);


  return (
    <div className="relative " ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`${btnStyle} focus:outline-none disabled:cursor-not-allowed`}
        disabled={disabled}
      >
        {title}
      </button>
      <div
        className={`transition-all duration-150 ease-in-out transform  ${
          isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"
        } ${className} absolute mt-1 rounded-3xl max-w-[calc(100vw-20px)]   shadow-sm py-5 bg-white dark:bg-black z-50 ring-1 ring-lcard dark:ring-dcard 
        ${isUp ? 'bottom-full ' : ''}  
        `}
        // ${isLeft ? 'right-0' : 'left-0'}  
      >
        <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;



