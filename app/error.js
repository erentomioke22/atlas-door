"use client"
import React from 'react'


const error = ({error,reset}) => {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div className="text-center">
      <p className="text-base font-semibold text-purple">ERROR</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight  sm:text-5xl">error {error}</h1>
      <p className="mt-6 text-base leading-7 text-lfont">Sorry, we have an error please refresh page </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <button
          onClick={reset}
          className="rounded-md bg-purple px-3.5 py-2.5 text-sm font-semibold text-[#ffffff] shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  </main>
  )
}

export default error