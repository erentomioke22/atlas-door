import React from 'react'
import Link from 'next/link'

export const metadata = {
 title:{
  absolute:"NotFound"
 }
}


const NotFound = () => {
  return (
    <main className="grid min-h-full place-items-center  px-6 py-24 sm:py-32 lg:px-8">
    <div className="text-center">
      <p className="text-base font-semibold ">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight  sm:text-5xl">صفحه ای یافت نشد</h1>
      <p className="mt-6 text-base leading-7 text-lfont">متاسفانه صفحه ای که شما دنلاش هستید یافت نشد</p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          href="/"
          className="rounded-xl px-3.5 py-2.5 text-sm bg-black dark:bg-white text-white dark:text-black"
        >
          برگشت به خانه
        </Link>
      </div>
    </div>
  </main>
  )
}

export default NotFound;