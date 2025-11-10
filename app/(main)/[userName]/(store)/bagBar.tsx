'use client'

import type{ Session } from "@/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";

const BagBar = ({session}:{session:Session | null}) => {
  const path = usePathname();
  const router = useRouter();
  const pathName = path.split('/');
  const lastPath = pathName[pathName.length - 1];

  return (
    <div>
      <div className="flex justify-between text-lg my-5">
        <h1 className="text-2xl">سفارشات</h1>
        <button
          className={"text-sm px-3  py-1  flex"}
          onClick={() => router.push('/')}
          type="button"
        >
          بازگشت
          <FaArrowLeftLong className="my-auto " />
        </button>
      </div>
      <div className="flex gap-3  text-[10px] md:text-sm   text-nowrap overflow-x-auto py-3 px-5 ">
        <Link className={`duration-300  ${lastPath === "bag" ? "bg-black dark:bg-white text-white dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  " : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1" }`} href={`/${pathName[1]}/bag`}>
          <span>سبد خرید</span>
        </Link>

        <Link className={`duration-300  ${lastPath === "orders" ? "bg-black dark:bg-white text-white dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  " : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1" }`} href={`/${pathName[1]}/orders`}>
          <span>سفارشات</span>
        </Link>

        <Link className={`duration-300  ${lastPath === "delivered" ? "bg-black dark:bg-white text-white dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  " : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1" }`} href={`/${pathName[1]}/delivered`}>
          <span>تحویل گرفته شده</span>
        </Link>
        {session?.user?.role === "admin" && (
          <Link className={`duration-300  ${lastPath === "adminOrders" ? "bg-black dark:bg-white text-white dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  " : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1" }`} href={`/${pathName[1]}/adminOrders`}>
            <span> تمام سفارشات</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BagBar;