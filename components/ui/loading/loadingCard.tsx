import React from "react";

const LoadingCard : React.FC = () => {
  return (
    <div className="sm:w-64 max-sm:w-full  rounded-3xl">
      <div className="animate-pulse space-y-2 ">
        <div className="flex gap-2 w-32">
          <div className="rounded-xl  bg-lcard dark:bg-dcard   w-10 mx-auto h-10  "></div>

          <div className="flex-1 space-y-2 py-1">
            <div className="h-2 bg-lcard dark:bg-dcard  rounded col-span-2"></div>
            <div className="h-2 bg-lcard dark:bg-dcard  rounded col-span-1"></div>
          </div>
        </div>
        {/* <div className=" sm:flex gap-4"> */}
        <div className=" gap-4">
          <div className="rounded-2xl  bg-lcard dark:bg-dcard   w-full mx-auto h-32  "></div>
          {/* <div className="rounded-2xl sm:rounded-4xl bg-lcard dark:bg-dcard   w-full mx-auto h-32  sm:w-40 sm:h-36"></div> */}

          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-lcard dark:bg-dcard  rounded"></div>
            <div className="h-4 bg-lcard dark:bg-dcard  rounded"></div>
            <div className="h-2 bg-lcard dark:bg-dcard  rounded col-span-2"></div>
            <div className="h-2 bg-lcard dark:bg-dcard  rounded col-span-1"></div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5">
          <div className="h-2 bg-lcard dark:bg-dcard rounded-sm"></div>
          <div className="h-2 bg-lcard dark:bg-dcard rounded-sm"></div>
          <div className="h-2 bg-lcard dark:bg-dcard rounded-sm"></div>
          <div className="h-2 bg-lcard dark:bg-dcard rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;
