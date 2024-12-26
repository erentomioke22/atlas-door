import React, { useState } from "react";
import { IoPersonCircleSharp } from "react-icons/io5";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Dropdown from "./ui/dropdown";
import { FaCaretLeft } from "react-icons/fa6";
import CreatePost from "./posts/create-post";
import { IoLogOut} from "react-icons/io5";
// import Notifications from "./notifications";
import { IoAnalyticsSharp } from "react-icons/io5";
import Notifications from "./notifications";
import ImageCom from "./ui/Image";

const Profile = ({ session }) => {
  const [close, setClose] = useState(false);

  return (
    <Dropdown
      title={<IoPersonCircleSharp/>}
      close={close}
      btnStyle={" bg-lcard hover:bg-lbtn rounded-full px-3 py-1 duration-500 dark:bg-dcard dark:hover:bg-dbtn text-lfont border-lbtn border dark:border-dbtn"}
      className={"-right-20 md:right-0 bg-lcard border border-lbtn  dark:border-dbtn dark:bg-dcard"}
      disabled={!session}
    >
      <div
        className=" flex justify-around bg-lbtn dark:bg-dbtn p-3   mx-3 rounded-2xl  gap-3 truncate  duration-300"
      >
        <div className="h-[40px] w-[40px] relative">
          <ImageCom
            className="rounded-lg h-10 w-10"
            src={
              session.user?.image === null
                ? "/images/logo/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg"
                : session.user.image
            }
            alt={`${session.user?.name} avatar`}
            // size={'w-10'}
          />
        </div>
        <div className="truncate max-w-36">
          <p className="text-sm  text-purple truncate">{session?.user?.displayName}</p>
          <p className="text-sm  text-lfont truncate">{session?.user?.email}</p>
        </div>

        <div className="flex flex-col justify-center text-lfont ">
          <FaCaretLeft />
        </div>
      </div>

      <div className="flex flex-col text-start text-[12px] space-y-2 mt-2 px-3">


 
      <div>
        <CreatePost/>
      </div>




        <Link
          onClick={() => {
            setClose(!close);
          }}
          href={`/Analyctics`}
          className={" flex justify-between py-2 w-full  px-3  rounded-lg  hover:text-purple hover:bg-lbtn dark:hover:bg-dbtn text-lfont duration-500"}           >
          <IoAnalyticsSharp className="text-[18px]"/>
          <span >Analytics Post</span>
        </Link>



        <div>
          <Notifications/>
        </div>
        
        <button
          type="button"
          onClick={() => {
            signOut();
          }}
          className={" py-2 w-full flex justify-between px-3  rounded-lg  hover:text-orange hover:bg-lbtn dark:hover:bg-dbtn text-lfont duration-500"}           >
          <IoLogOut className="text-[18px]"/>
          <span > Logout</span>
        </button>
        
      </div>
    </Dropdown>
  );
};

export default Profile;
