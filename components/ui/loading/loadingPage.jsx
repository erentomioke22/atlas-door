import React from 'react'

const LoadingPage = () => {
  return (
    <div className=" shadow rounded-3xl p-4 dark:shadow-dfont w-full mx-auto bg-lcard dark:bg-dcard sm:w-64 max-sm:w-full" >
    <div className="animate-pulse space-y-1 ">

       <div className=' flex gap-2 w-1/2'>
           <div className="rounded-lg bg-lbtn dark:bg-dbtn   h-8 w-8 "></div>
           
           <div className="flex-1 space-y-1 py-1">
             <div className="h-2 bg-lbtn dark:bg-dbtn  rounded col-span-2"></div>
             <div className="h-2 bg-lbtn dark:bg-dbtn  rounded col-span-1"></div>     
           </div>
       </div>

       <div>
           <div className="rounded-3xl bg-lbtn dark:bg-dbtn w-full h-36 md:h-40 "></div>
       </div>

           <div className="flex-1 space-y-2 py-1">
             <div className="h-4 bg-lbtn dark:bg-dbtn  rounded"></div>      
             <div className="h-2 bg-lbtn dark:bg-dbtn  rounded col-span-2"></div>
             <div className="h-2 bg-lbtn dark:bg-dbtn  rounded col-span-1"></div>     
           </div>


      <div className="grid grid-cols-4 gap-5 pt-3">
          <div className="h-2 bg-lbtn dark:bg-dbtn rounded-sm"></div>
          <div className="h-2 bg-lbtn dark:bg-dbtn rounded-sm"></div>
          <div className="h-2 bg-lbtn dark:bg-dbtn rounded-sm"></div>
          <div className="h-2 bg-lbtn dark:bg-dbtn rounded-sm"></div>
      </div>



    </div>


  </div>
  )
}

export default LoadingPage;