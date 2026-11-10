import Link from 'next/link'
    

export default function Unauthorized() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4   container max-w-xl   mx-auto place-items-center ">
      <div className="text-center">
        <h1 className="text-base font-semibold text-redorange">ممنوع</h1>
        <p className="mt-6 text-base leading-7">
        شما اجازه دسترسی به این محتوا را ندارید
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link            
           className="rounded-full px-3.5 py-2.5 text-sm bg-black dark:bg-white text-white dark:text-black"
            href="/">
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </main>
  )
}
