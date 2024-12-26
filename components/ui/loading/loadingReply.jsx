import React from 'react'

const LoadingReply = () => {
  return (
    <div className=" shadow rounded-3xl p-4 dark:shadow-dfont w-full mx-auto bg-lbtn dark:bg-dbtn ">
    <div className="animate-pulse space-y-5 ">

       <div className=' flex space-x-4'>
           <div className="rounded-lg bg-lcard dark:bg-dcard   h-10 w-10"></div>
           
           <div className="flex-1  ">
            <div className='grid grid-cols-2'>
                <div>
                  <div className="h-2 w-20 bg-lcard dark:bg-dcard  rounded"></div>      
                </div>
                <div className='flex space-x-5 justify-end'>
                  <div className="h-4 w-4 bg-lcard dark:bg-dcard  rounded"></div>      
                  <div className="h-4 w-4 bg-lcard dark:bg-dcard  rounded"></div>      
                  <div className="h-4 w-4 bg-lcard dark:bg-dcard  rounded"></div>      
                  <div className="h-4 w-4 bg-lcard dark:bg-dcard  rounded"></div>      
                </div>

            </div>
             <div className="h-2 w-20 bg-lcard dark:bg-dcard  rounded"></div>      
     
           </div>
       </div>

       <div>
           <div className="space-y-1">
                <div className="h-2 bg-lcard dark:bg-dcard  rounded col-span-2"></div>
                <div className="h-2 bg-lcard dark:bg-dcard  rounded col-span-1"></div>
            </div>
       </div>


    </div>


  </div>
  )
}

export default LoadingReply;