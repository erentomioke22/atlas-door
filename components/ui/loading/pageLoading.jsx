import React from 'react'

const PageLoading = () => {
  return (
    <div className="mx-auto my-5 px-7 lg:px-32 xl:px-44  space-y-5 md:space-y-10">
    <div className="animate-pulse space-y-5 ">
      


       <div className='grid grid-cols-1 md:grid-cols-2 gap-5 '>
       <div className="flex-1 space-y-6 py-1 w-full mt-7">
         <div className="h-5 md:h-7 bg-lcard dark:bg-dcard  rounded"></div>      
         <div className="h-5 md:h-7 bg-lcard dark:bg-dcard  rounded"></div>      
         <div className="h-5 md:h-7 bg-lcard dark:bg-dcard  rounded"></div>      
         <div className="h-3 md:h-5 bg-lcard dark:bg-dcard  rounded"></div>      
         <div className="h-3 md:h-5 bg-lcard dark:bg-dcard  rounded"></div>      
            <div className='flex w-52 gap-4 md:py-5 py-0'>
                <div className="rounded-xl bg-lcard dark:bg-dcard h-12 w-12"></div>
                
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-lcard dark:bg-dcard  rounded"></div>      
                  <div className="h-3 bg-lcard dark:bg-dcard w-1/2 rounded"></div>      
                </div>
            </div>
       </div>
       <div className=' flex gap-4 max-md:order-last'>
           <div className=" bg-lcard dark:bg-dcard w-full  mx-auto rounded-4xl h-[150px] md:h-[400px]"></div>          
       </div>
       </div>




       <div className=' flex-1 space-y-3 w-full'>
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-2"></div>
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-1"></div>     
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-1"></div>     
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-1"></div>     
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
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-2"></div>
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-1"></div>     
             <div className="h-4 bg-lcard dark:bg-dcard  rounded col-span-1"></div>     
       </div>



    </div>


  </div>
  )
}

export default PageLoading