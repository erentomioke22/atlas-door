"use client";

import React from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error = ({ error, reset }: ErrorProps) => {
  return (
    <main className="flex min-h-svh items-center justify-center px-4   container max-w-xl   mx-auto place-items-center ">
      <div className="text-center">
        <h1 className="text-base font-semibold text-red">ERROR</h1>
        {/* <h1 className="mt-4  font-bold tracking-tight text-xl">
          error {String(error?.message ?? '')}
        </h1> */}
        <p className="mt-6 text-base leading-7">
          متاسفانه مشکلی رخ داده - لطفا صفحه رو یکبار دیگه بارگزاری کنید
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={reset}
            className="rounded-full px-3.5 py-2.5 text-sm bg-black dark:bg-white text-white dark:text-black"
          >
            تلاش دوباره
          </button>
        </div>
      </div>
    </main>
  );
};

export default Error;