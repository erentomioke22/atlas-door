import React from "react";

const LoadingOrder = () => {
  return (
    <div className="w-full p-3">
      <div className="animate-pulse space-y-2 ">
        
        <div className="flex gap-4  max-w-full sm:w-128">
          <div className="rounded-2xl bg-lcard dark:bg-dcard    mx-auto w-20 sm:h-20"></div>

          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-lcard dark:bg-dcard  rounded"></div>
            <div className="h-4 bg-lcard dark:bg-dcard  rounded"></div>
            <div className="h-2 bg-lcard dark:bg-dcard  rounded col-span-2"></div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default LoadingOrder;