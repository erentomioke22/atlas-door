"use client"

import React from "react";
import clsx from "clsx";



const Button = ({children,variant = "primary",className,...props}) => {
  const baseStyles = "font-medium transition duration-300 disabled:brightness-90 disabled:cursor-not-allowed";

  const variantStyles = {
    simple: "",
    home: "bg-lcard dark:bg-dcard border-2 border-lcard dark:border-dcard",
    menu: "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full ",
    menuActive: "bg-black dark:bg-white text-white dark:border-white dark:text-black rounded-full border-2 border-black",
    close:"bg-lcard dark:bg-dcard rounded-full border-2 text-lfont",
    delete:"bg-transparent text-redorange border-2 rounded-full",
    empty:"",
  };

  // className={ ` bg-black text-white border-2 border-black dark:border-white rounded-full px-3 py-1   hover:bg-white hover:border-2 hover:text-lfont hover:border-lfont duration-300  disabled:cursor-not-allowed dark:text-lfont   dark:hover:bg-black     ${className}`} >

  // const sizeStyles = {
  //   sm: "px-2 py-1 text-sm",
  //   md: "px-3 py-2 text-base",
  //   lg: "px-4 py-3 text-lg",
  // };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        // sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;