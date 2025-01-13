import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Dropdown from "./ui/dropdown";
import { FaCaretLeft } from "react-icons/fa6";
import { IoPencil,IoLogOut } from "react-icons/io5";
import ImageCom from "./ui/Image";



const Profile = ({ session }) => {
  const [close, setClose] = useState(false);
// console.log(session)
  return (
    <Dropdown
      title={
        <div className="relative h-8 w-8">
          {session?.user?.image === null ?
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-redorange to-yellow"></div>
                  :
                  <ImageCom
                  className="rounded-lg h-8 w-8 "
                  size={"h-8 w-8"}
                  src={
                    session.user?.image === null
                      ? `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg`
                      : `${process.env.NEXT_PUBLIC_BASE_URL}${session.user.image}`
                  }
                  alt={`${session.user?.name} avatar`}
                /> 
                  }

        </div>
      }
      close={close}
      className={"right-0"}
      disabled={!session}
    >
      <div
        className=" flex justify-around  p-3   mx-3 hover:bg-lcard dark:hover:bg-dcard rounded-2xl  gap-3 truncate duration-300"
      >
        <div className="relative h-10 w-10">
        {session?.user?.image === null ?
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-redorange to-yellow"></div>
                  :
                  <ImageCom
                  className="rounded-xl h-10 w-10 "
                  size={"h-10 w-10"}
                  src={
                    session.user?.image === null
                      ? `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg`
                      : `${process.env.NEXT_PUBLIC_BASE_URL}${session.user.image}`
                  }
                  alt={`${session.user?.name} avatar`}
                /> 
                  }
        </div>
        <div className="text-start truncate max-w-36">
          <p className="text-sm  text-black dark:text-white truncate">{session?.user?.displayName}</p>
          <p className="text-sm  text-lfont truncate">{session?.user?.email}</p>
        </div>
        <div className="flex flex-col justify-center text-lfont ">
          <FaCaretLeft />
        </div>

      </div>

      <div className="flex flex-col text-start text-[12px] space-y-2 mt-2 px-3">
        {/* {session.user.role === "admin" && (
          <>
            <Link
              onClick={() => {
                setClose(!close);
              }}
              href={"/admin"}
              className={" flex justify-between py-2 w-full  px-3  rounded-lg  hover:bg-lcard dark:hover:bg-dcard hover:text-black dark:hover:text-white text-lfont duration-500"}               >
               <IoBookmark className="text-[18px]"/>
               <span > Admin Panel</span>
           </Link>
          </>
        )} */}

 
      <Link 
        href={"/create-post"}   
        onClick={() => {
          setClose(!close);
        }}
        className={" flex justify-between py-2 w-full  px-3  rounded-lg  hover:bg-lcard dark:hover:bg-dcard hover:text-black dark:hover:text-white text-lfont duration-500"} >
     <IoPencil className="text-lg" /> 
     <span>Create Post</span>
      </Link>






        <button
          type="button"
          onClick={() => {
            signOut();
          }}
          className={"flex justify-between py-2 w-full  px-3  rounded-lg  hover:bg-lcard dark:hover:bg-dcard hover:text-black dark:hover:text-white text-lfont duration-500"}           >
          <IoLogOut className="text-[18px]"/>
          <span > Logout</span>
        </button>
        
      </div>
    </Dropdown>
  );
};

export default Profile;