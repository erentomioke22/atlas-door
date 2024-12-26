"use client"

import React from 'react'


const Button = ({children,onClick,onChange,disabled,type,className}) => {
  return (
      <button
         onClick={onClick}
         onChange={onChange}
         type={type ? type :"button"}
         disabled={disabled}
         className={ ` bg-black text-white  dark:bg-white dark:text-black  rounded-full px-3 py-1  text-lg disabled:cursor-not-allowed     ${className}`} >
         {children}
      </button>
  )
}

export default Button;