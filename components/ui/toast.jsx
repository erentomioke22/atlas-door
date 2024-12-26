"use client"

import React from 'react'
import { useTheme } from 'next-themes';
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import { IoClose } from "react-icons/io5";



const ToastProvider = () => {
    const { theme, setTheme } = useTheme();
  return (
    <Toaster 
      position="bottom-left"
      reverseOrder={false}
      gutter={4}
      toastOptions={{
      className: '',
      duration: 10000,
       style: {fontSize:"small",borderRadius:"12px",background:theme === 'light' ?"#f2f2f2": "#2b3139",padding: '10px',color:'#737982'}    
    }}
  >
    {(t) => (
      <ToastBar toast={t}>
        {({ icon, message }) => (
          <>
            {icon}
            {message}
            {t.type !== 'loading' && (
              <button className='text-lfont bg-lbtn dark:bg-dbtn p-1 rounded-lg  text-lg' onClick={() => toast.dismiss(t.id)}><IoClose/></button>
            )}
          </>
        )}
      </ToastBar>
    )}
  </Toaster>
  )
}

export default ToastProvider