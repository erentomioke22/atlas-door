// components/Navbar.js
"use client";

import React from "react";
import { useState,useEffect } from "react";


const Offcanvas = ({children,title,header,headerStyle,btnStyle,position,size,openTransition,closeTransition,onClose,navbarSetIsOpen,disabled,setMenu}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    if(navbarSetIsOpen)navbarSetIsOpen(isOpen)
  }, [isOpen,navbarSetIsOpen]);

useEffect(()=>{
 setIsOpen(false)
},[onClose])

  return (
    <>
      <div className="w-full">
        <button type="button" className={btnStyle} onClick={() => {setIsOpen(!isOpen) ; setMenu && setMenu('')}} disabled={disabled}>
          {title}
        </button>
      </div>
     
      <div
        className={`bg-white dark:bg-black  fixed ${position} p-4 transform space-y-7 offcanvas
          ${isOpen  ? `${openTransition}` : `${closeTransition}`}  ${size}  bg-black transition-transform duration-500 overflow-auto  z-[70] `}
      >
        {children}
      </div>



        <div
          className={` inset-0  transition-opcaity duration-500 ease-in-out  z-[60]   ${
          isOpen ? "fixed backdrop-blur-sm overflow-hidden overscroll-none" : " invisible backdrop-blur-0"
        } `}
          onClick={() => setIsOpen(false)}
       />

    </>
  );
};

export default Offcanvas;
