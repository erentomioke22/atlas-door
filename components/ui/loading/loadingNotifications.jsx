import React from "react";

const LoadingNotifications = () => {
  return (
    <div className="w-full mx-auto">
      <div className="animate-pulse space-y-3 ">
        <div className=" flex gap-2">
          <div className="rounded-lg bg-lcard dark:bg-dcard   h-10 w-10"></div>

          <div className="flex-1  space-y-2 mt-1">
            <div className="h-2 w-20 bg-lcard dark:bg-dcard  rounded"></div>
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
  );
};

export default LoadingNotifications;
