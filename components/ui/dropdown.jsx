import React, { useState, useEffect, useRef } from "react";

const Dropdown = ({ children, title, close, className, btnStyle,disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <div className="relative dropdown-container" ref={dropdownRef}>
      <button
        onClick={(e) => {
          setIsOpen(!isOpen);
        }}
        type="button"
        className={` ${btnStyle}  focus:outline-none disabled:cursor-not-allowed`}
        disabled={disabled}
      >
        {title}
      </button>

      <div
        className={` absolute    ${className}    rounded-3xl py-5  opacity-0 z-[999999] bg-white dark:bg-black border dark:border-dcard border-lcard shadow-sm ${
          isOpen ? "opacity-100 " : " invisible"
        } transition-all duration-200 ease-in-out `}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
