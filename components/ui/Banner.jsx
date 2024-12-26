import React, { useState } from 'react'
import { toast } from 'sonner';
const Banner = () => {
  const[close,setClose]=useState(true);

  return (
      <div className="relative isolate overflow-hidden bg-lcard dark:bg-dcard text-lfont px-3 md:px-5 rtl:ml-0 py-2">
         <div className='flex justify-normal sm:justify-between  gap-2 text-right'>
          <div className='text-[12px] md:text-sm  my-auto '>
            <p >برای ثبت سفارش یا مشاوره رایگان با ما تماس بگیرید</p>
          </div>
          <div className='flex gap-2 md:gap-3  max-md:mt-1 flex-wrap text-[12px] md:text-sm justify-end'>
            <a href='tel:09123758621' className=' underline decoration-2 ' onClick={()=>{toast.success('شماره کپی شد');navigator.clipboard.writeText('09123758621')}}>0912 375 8621 </a>
            <a href='tel:02155589837' className=' underline decoration-2 ' onClick={()=>{toast.success('شماره کپی شد');navigator.clipboard.writeText('02155589837')}}>021 5558 9837 </a>
            <a href='tel:09334178679' className=' underline decoration-2 ' onClick={()=>{toast.success('شماره کپی شد');navigator.clipboard.writeText('02155589837')}}>0933 417 8679 </a>
          </div>

         </div>
      </div> 
     
  )
}

export default Banner