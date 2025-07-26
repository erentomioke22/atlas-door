import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { BsTwitterX } from "react-icons/bs";
import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import Offcanvas from "@components/ui/offcanvas";
import { IoClose } from "react-icons/io5";
import Login from "./login";
import Signup from "./signup";

const Sign = ({ title,commentStyle,session }) => {
  const [show, setShow] = useState("login");
  const [close, setClose] = useState(false);

  // const clearHistory = () => {
  //     if (typeof window !== 'undefined') {
  //       window.history.pushState(null, '', window.location.href);
  //       window.onpopstate = () => {
  //         window.history.go(1);
  //       };
  //       window.history.replaceState({}, document.title);
  //     }
  // };

  return (
    <Offcanvas       
    title={<div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue to-darkgreen cursor-pointer"></div>}
    position={"top-0 right-0"} size={"h-screen max-w-full w-96 border-l-2 border-l-lcard dark:border-l-dcard"} openTransition={"translate-x-0"} closeTransition={"translate-x-full"} onClose={close}>
    
    <div className=" flex justify-between">
    <h1 className="text-xl ">ثبت نام - ورود</h1>

      <button
        className={" text-lg bg-lcard dark:bg-dcard px-2 py-1  rounded-full border-2 text-lfont "}
        onClick={() => setClose(!close)}
        type="button"
              >
            <IoClose/>
      </button>
    </div>

        


      <div className="space-y-5  w-full ">
             
              <div className=" bg-lcard dark:bg-dcard w-full rounded-lg grid grid-cols-2 ">
                  <button onClick={()=>{setShow("register")}} className={` px-2 py-1 m-1 rounded-lg text-sm ${show === "register" ? "bg-lbtn dark:bg-dbtn" : " "}`}>ثبت نام</button>
                  <button onClick={()=>{setShow("login")}}    className={` px-2 py-1 m-1 rounded-lg text-sm ${show === "login" ? "bg-lbtn dark:bg-dbtn" : " "}`}>ورود</button>
              </div>

              <div className="space-y-3 ">
                <p className="text-xl ">
                {show === "register" ? "ثبت نام" : "ورود"}  با حساب های شما <span className="text-darkgreen text-sm">روش ساده تر</span>
                </p>

              <button
                type="button"
                onClick={() => {
                  signIn("google");
                }}
                className="hover:bg-lcard   duration-500 dark:hover:bg-dcard     flex  rounded-xl text-sm w-full  p-2 gap-2"
              > 
               <p className=" text-2xl  "><FcGoogle/></p> 
               <p className=" my-auto">ورود با حساب GOOGLE</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  signIn("linkedin");
                }}
                className="hover:bg-lcard  duration-500 dark:hover:bg-dcard    flex  rounded-xl text-sm  w-full p-2 gap-2"              >
               <p className=" text-2xl  text-darkblue"><FaLinkedin/></p> 
               <p className=" my-auto">ورود با حساب LINKEDIN</p>             
                </button>



              <button
                type="button"
                onClick={() => {
                  signIn("github");
                }}
                className="hover:bg-lcard    duration-500 dark:hover:bg-dcard     flex  rounded-xl text-sm  w-full  p-2 gap-2"              >
               <p className=" text-2xl "><FaGithub/></p> 
               <p className=" my-auto">ورود با حساب GITHUB</p>              
               </button>


               <button
                type="button"
                onClick={() => {
                  signIn("twitter");
                }}
                className="hover:bg-lcard   duration-500 dark:hover:bg-dcard    flex  rounded-xl text-sm  w-full  p-2 gap-2"              >
               <p className=" text-2xl "><BsTwitterX/></p> 
               <p className=" my-auto">ورود با حساب X</p>              
               </button>


            </div>


            <div className=" space-y-5">

                {show === "recovery" || (
                  <p className="text-xl ">
                    {show === "register" ? "ثبت نام" : "ورود"} با ایمیل <span className="text-redorange text-sm">روش طولاني تر</span>
                  </p>
                )}
                <p className=" text-xl">
                  {show === "recovery" && "RECOVERY YOUR PASSWORD"}
                </p>
                <div >
                  {show === "register" ? (
                    <Signup setShow={setShow} />
                  ) : (
                    <Login show={show} setShow={setShow} />
                  )}
                </div>
            </div>
            <p className="text-center my-5 text-[12px] text-lfont">
          <span className="text-red ">نکته:</span> با ورود، شما موافقت میکنید با
          <Link href="privacy-policy" className="text-black dark:text-white underline">
            سیاست حفظ حریم خصوصی
          </Link>{" "}
          ,ما شرایط استفاده و رفتار.
        </p>

      </div>


      
      


    </Offcanvas>
  );
};

export default Sign;
