import React from "react";

const ProfileLoading = () => {
  return (
    <div className="p-4  ">
      <div className="animate-pulse space-y-5 ">
            <div className="h-4 bg-lcard dark:bg-dcard  rounded"></div>
            <div className="flex gap-5">
          <div className="rounded-xl bg-lcard dark:bg-dcard    max-md:mx-auto  w-14 h-14"></div>

          <div className="flex-1 space-y-3  my-auto">
            <div className="h-4 bg-lcard dark:bg-dcard  rounded max-w-full w-44"></div>
            <div className="h-3 bg-lcard dark:bg-dcard  rounded max-w-full w-44"></div>
          </div>
            </div>
        <div className=" sm:flex gap-4">

          <div className="flex-1 space-y-4 py-1">
            <div className="h-3 bg-lcard dark:bg-dcard  rounded col-span-2"></div>
            <div className="h-3 bg-lcard dark:bg-dcard  rounded col-span-1"></div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5">
          <div className="h-3 bg-lcard dark:bg-dcard rounded-sm"></div>
          <div className="h-3 bg-lcard dark:bg-dcard rounded-sm"></div>
          <div className="h-3 bg-lcard dark:bg-dcard rounded-sm"></div>
          <div className="h-3 bg-lcard dark:bg-dcard rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLoading;