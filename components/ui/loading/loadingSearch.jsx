import React from 'react'

const LoadingSearch = () => {
  return (
    <div className="  p-2 w-full mx-auto   ">
    <div className="animate-pulse space-y-5 ">

       <div className=' flex gap-4'>
           <div className="rounded-xl bg-lbtn dark:bg-dbtn  h-10 w-10"></div>
           
           <div className="flex-1 space-y-2 py-1">
             <div className="h-3 bg-lbtn dark:bg-dbtn  rounded"></div>      
             <div className="h-3 bg-lbtn dark:bg-dbtn  rounded"></div>           
           </div>
       </div>

    </div>


  </div>
  )
}

export default LoadingSearch;