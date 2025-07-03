import React, { useState,useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { BsTwitterX } from "react-icons/bs";
import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import Dropdown from "@components/ui/dropdown";
import DropDrawer from "@components/ui/dropdrawer";



const Sign = ({ title,commentStyle,session }) => {
  // const [show, setShow] = useState("login");
  // const [close, setClose] = useState(false);

  const clearHistory = () => {
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', window.location.href);
        window.onpopstate = () => {
          window.history.go(1);
        };
        window.history.replaceState({}, document.title);
      }
  };

  return (
    <DropDrawer
      title={<div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue to-darkgreen cursor-pointer"></div>}
      // btnStyle={`  bg-lcard dark:bg-dcard dark:text-white text-lg p-2  rounded-lg text-black`}
      className={"-right-10 px-3 w-[20rem] max-h-96 overflow-y-scroll"}
      disabled={session}
      // position={"top-0 right-0"} size={"h-screen w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4"} openTransition={"translate-x-0"} closeTransition={"translate-x-full"} onClose={onClose}
    >
       {/* <div className="flex justify-end w-full py-2">
                
                <button
                    className={"bg-black dark:bg-white text-lcard dark:border-white dark:text-black rounded-full border-2 border-black px-3 py-1 text-sm "}
                    onClick={() => setClose(!close)}
                    type="button"
                          >
                        <IoClose/>
                </button>
      
              </div>
        
        <p className="text-center text-lfont text-xl md:text-4xl mt-10">WELCOME BACK to</p>     
        <p className="font-Blanka text-purple text-center text-xl md:text-4xl">ATLAS IDEA</p>

      <div className="max-md:space-y-7  w-full sm:w-2/3 md:w-4/5 xl:w-3/5 my-10 mx-auto grid grid-cols-1 md:grid-cols-2 md:space-x-10"> */}
             

            <div className="space-y-3 px-3">
              {/* <p className="text-xl text-lfont">
                    {show === "register" ? "REGISTER" : "LOGIN"} BY YOUR ACCOUNTS <span className="text-darkgreen text-sm">EASY WAY</span>
              </p> */}
              <h1 className="text-xl ">ثبت نام / ورود</h1>
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

               <p className="text-center my-5 text-[12px] text-lfont">
          <span className="text-red ">نکته:</span> با ورود، شما موافقت میکنید با
          <Link href="privacy-policy" className="text-black dark:text-white underline">
            سیاست حفظ حریم خصوصی
          </Link>{" "}
          ,ما شرایط استفاده و رفتار.
        </p>
            </div>

            {/* <div class="md:hidden h-3 border-b border-lfont text-sm text-center">
               <span className="dark:bg-black bg-white px-2 text-lfont">or</span>
            </div> */}

            {/* <div className=" space-y-5">

              <div className="flex space-x-3 ">
                  <button onClick={()=>{setShow("register")}} className={`${show === "register" ? "bg-black rounded-full px-3 py-2  text-white dark:bg-white dark:text-black text-sm " : " text-sm bg-transparent border-2 border-black dark:border-white rounded-full px-3 py-2  text-black dark:text-white"}`}>SignUp</button>
                  <button onClick={()=>{setShow("login")}}    className={`${show === "login" ? "bg-black rounded-full px-3 py-2  text-white dark:bg-white dark:text-black text-sm " : " text-sm bg-transparent border-2 border-black dark:border-white rounded-full px-3 py-2  text-black dark:text-white"}`}>Login</button>
              </div>
                {show === "recovery" || (
                  <p className="text-xl text-lfont">
                    {show === "register" ? "REGISTER" : "LOGIN"} BY EMAIL <span className="text-redorange text-sm">LONG WAY</span>
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
            </div> */}

      {/* </div> */}


      
      


    </DropDrawer>
  );
};

export default Sign;
