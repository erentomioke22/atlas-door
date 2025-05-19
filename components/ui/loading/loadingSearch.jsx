import React from "react";

const LoadingSearch = () => {
  return (
    <div className="w-full mx-auto   ">
      <div className="animate-pulse space-y-5 ">
        <div className=" flex space-x-2">
          <div className="rounded-xl bg-lcard dark:bg-dcard  h-10 w-10"></div>

          <div className="flex-1 space-y-2 my-auto">
            <div className="h-3 bg-lcard dark:bg-dcard  rounded"></div>
            <div className="h-3 bg-lcard dark:bg-dcard  rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSearch;
