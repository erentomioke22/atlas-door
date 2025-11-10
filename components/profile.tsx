import React, { useState } from "react";
import Link from "next/link";
import ImageCom from "./ui/Image";
import DropDrawer from "./ui/dropdrawer";
import Darkmode from "./ui/darkmode";
import type { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
interface ProfileProps {
  session: Session;
}

const Profile: React.FC<ProfileProps> = ({ session }) => {

  
  const [close, setClose] = useState(false);
  const router = useRouter()
  async function handleSignOut() {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message || "مشکلی در فرایند خروج پیش آمده");
    } else {
      toast.success("خروج از حساب با موفقیت انجام شد");
      router.refresh();
    }
  }
  return (
    <DropDrawer
      title={
        <div className="relative h-9 w-9">
          {session?.user?.image === null
            ? <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-redorange to-yellow"></div>
            : <ImageCom
                className="rounded-xl h-9 w-9 object-cover"
                src={session.user?.image ?? ""}
                alt={`${session.user?.name ?? "user"} avatar`}
              />
          }
        </div>
      }
      close={close}
      className={"right-0"}
      disabled={!session}
    >
      {!session?.user?.emailVerified  &&
       <p className="text-[12px] text-redorange max-w-72  sm:max-w-52 px-3 md:mx-auto">ایمیل تایید به آدرس ایمیل شما ارسال شده لطفا ایمیلتان را تایید کنید</p>
      }
      <div className=" flex  max-sm:mt-5  p-3   mx-3  rounded-2xl  gap-2 truncate duration-300">
        <div className="relative h-10 w-10">
          {session?.user?.image === null
            ? <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-redorange to-yellow"></div>
            : <ImageCom
                className="rounded-xl h-10 w-10 object-cover"
                src={session.user?.image ?? ""}
                alt={`${session.user?.name ?? "user"} avatar`}
              />
          }
        </div>
        <div className="t truncate max-w-36">
          <p className="text-sm  text-black dark:text-white truncate">{session?.user?.displayName || session?.user?.name}</p>
          <p className="text-sm  text-lfont truncate">{session?.user?.email}</p>
        </div>
      </div>


      <div className="flex flex-col text-start text-[12px] space-y-2 mt-2 px-3">
        {session?.user?.role === "admin" && (
          <>
            <Link 
              href={"/admin/create-post"}   
              onClick={() => { setClose(!close); }}
              className={"flex justify-between py-2 w-full  px-3 text-lg sm:text-sm  rounded-lg  hover:bg-lcard dark:hover:bg-dcard sm:hover:text-black sm:dark:hover:text-white sm:text-lfont duration-500"} >
              <span>ساخت بلاگ</span>
            </Link>

            <Link 
              href={"/admin/create-product"}   
              onClick={() => { setClose(!close); }}
              className={" flex justify-between py-2 w-full  px-3 text-lg sm:text-sm  rounded-lg  hover:bg-lcard dark:hover:bg-dcard sm:hover:text-black sm:dark:hover:text-white sm:text-lfont duration-500"} >
              <span>ساخت محصول</span>
            </Link>
          </>
        )}

        <div>
          <Darkmode name={true}/>
        </div>

        <Link
          onClick={() => { setClose(!close); }}
          href={`/${session?.user?.name}/setting`}
          className={"flex justify-between py-2 w-full  px-3 text-lg sm:text-sm  rounded-lg  hover:bg-lcard dark:hover:bg-dcard sm:hover:text-black sm:dark:hover:text-white sm:text-lfont duration-500"}           >
          <span>تنظيمات</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className={"flex justify-between py-2 w-full  px-3 text-lg sm:text-sm   rounded-lg  hover:bg-lcard dark:hover:bg-dcard  text-orange duration-500"}           >
          <span>خروج از حساب</span>
        </button>
      </div>
    </DropDrawer>
  );
};

export default Profile;