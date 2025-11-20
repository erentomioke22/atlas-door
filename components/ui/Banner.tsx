import React from 'react'
import { toast } from 'sonner';
const Banner = () => {
  // const[close,setClose]=useState(true);

  return (
      <div className="relative isolate overflow-hidden bg-lcard dark:bg-dcard text-lfont px-3 md:px-5 2xl:max-w-7xl mx-auto py-2">
         <div className='flex justify-normal sm:justify-between  gap-2 text-right'>
          <div className='text-[12px] md:text-sm  my-auto '>
            <p >برای ثبت سفارش و مشاوره رایگان با ما تماس بگیرید</p>
          </div>
          <div className='flex gap-2 md:gap-5  max-md:mt-1 flex-wrap text-[12px] md:text-sm justify-end'>
            <a href='tel:09354941488' className=' underline decoration-2 ' onClick={()=>{toast.success('شماره کپی شد');navigator.clipboard.writeText('09354941488')}}>0935-494-1488</a>
            <a href='tel:09193795844' className=' underline decoration-2 ' onClick={()=>{toast.success('شماره کپی شد');navigator.clipboard.writeText('09193795844')}}>0919-379-5844</a>
            <a href='tel:09901196140' className=' underline decoration-2 ' onClick={()=>{toast.success('شماره کپی شد');navigator.clipboard.writeText('09901196140')}}>0990-119-6140</a>
            {/* <a href='tel:09123758621' className=' underline decoration-2 ' onClick={()=>{toast.success('شماره کپی شد');navigator.clipboard.writeText('09123758621')}}>0912-375-8621</a> */}
            {/* <a href='tel:02155589837' className=' underline decoration-2 ' onClick={()=>{toast.success('شماره کپی شد');navigator.clipboard.writeText('02155589837')}}>021-55589837</a> */}
          </div>

         </div>
      </div> 
     
  )
}

export default Banner