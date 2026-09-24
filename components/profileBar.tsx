'use client'

import type{ Session } from "@/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import Button from "@/components/ui/button";

const ProfileBar = ({session}:{session:Session | null}) => {
  const path = usePathname();
  const router = useRouter();
  const pathName = path.split('/');
  const lastPath = pathName[pathName.length - 1];

  return (
    <div>
      <div className="flex justify-between text-lg my-5">
        <h1 className="text-2xl">پروفایل</h1>
        <Button
          variant="back"
          onClick={() => router.back()}
          className="mb-6 text-sm flex"
        >
          بازگشت
          <FaArrowLeftLong className="ml-2 my-auto " />
        </Button>
      </div>
      <div className="flex gap-3  text-[10px] md:text-sm   text-nowrap overflow-x-auto py-3 px-5 ">
        <Link className={`duration-300  ${lastPath === "bag" ? "bg-black dark:bg-white text-white dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  " : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1" }`} href={`/${pathName[1]}/bag`}>
          <span>سبد خرید</span>
        </Link>

        <Link className={`duration-300  ${lastPath === "orders" ? "bg-black dark:bg-white text-white dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  " : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1" }`} href={`/${pathName[1]}/orders`}>
          <span>سفارشات</span>
        </Link>

        <Link className={`duration-300  ${lastPath === "setting" ? "bg-black dark:bg-white text-white dark:border-white dark:text-black rounded-full border-2 border-black px-2 py-1  " : "bg-transparent border-2 border-black dark:border-white dark:text-white rounded-full  px-2 py-1" }`} href={`/${pathName[1]}/setting`}>
          <span>حساب کاربری</span>
        </Link>
      </div>
    </div>
  );
};

export default ProfileBar;