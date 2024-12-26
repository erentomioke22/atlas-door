import React from 'react'

const EditPostLoading = () => {
  return (
    <div className=" w-full mx-auto  md:w-2/3 ">
    <div className="animate-pulse space-y-5 ">

       <div className=' flex-1 space-y-3 w-full'>
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-2"></div>
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-1"></div>     
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-1"></div>     
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-1"></div>     
       </div>

       <div>
           <div className="rounded-3xl bg-lcard dark:bg-dcard h-52 md:h-96 w-full md:w-4/6 mx-auto"></div>
       </div>

       <div className=' flex-1 space-y-3 w-full'>
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-2"></div>
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-1"></div>     
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-1"></div>     
       </div>


      <div className="flex space-x-2 pt-3">
          <div className="h-10 w-10 bg-lcard dark:bg-dcard rounded-full"></div>
          <div className="h-10 w-10 bg-lcard dark:bg-dcard rounded-full"></div>
          <div className="h-10 w-10 bg-lcard dark:bg-dcard rounded-full"></div>
          <div className="h-10 w-10 bg-lcard dark:bg-dcard rounded-full"></div>
          <div className="h-10 w-10 bg-lcard dark:bg-dcard rounded-full"></div>
      </div>



    </div>


  </div>
  )
}

export default EditPostLoading;