'use client'

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Signup from "./signup";
import Login from "./login";
import Link from "next/link";


const Sign = ({ title,commentStyle,session }) => {
  const [show, setShow] = useState("login");
  const [close, setClose] = useState(false);

  return (
<>
       <div className="flex justify-end w-full py-2 px-5">
                
                <Link
                    className={"bg-black rounded-full px-3 py-2 text-white dark:text-black dark:bg-white"}
                    href={'/'}
                    onClick={() => setClose(!close)}
                    type="button"
                          >
                        <IoClose/>
                </Link>
      
              </div>
        
        {/* <p className="text-center text-lfont text-xl md:text-4xl mt-10">WELCOME BACK to</p>     
        <p className="font-Blanka text-purple text-center text-xl md:text-4xl">ATLAS IDEA</p> */}

      <div className="max-md:space-y-7  w-full sm:w-2/3 md:w-3/5 xl:w-2/6 mt-36 mx-auto  md:space-x-10">
             

            {/* <div className="space-y-5 ">
              <p className="text-xl text-lfont">
                    {show === "register" ? "REGISTER" : "LOGIN"} BY YOUR ACCOUNTS <span className="text-darkgreen text-sm">EASY WAY</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  signIn("google");
                }}
                className="bg-lcard hover:bg-lbtn px-3  duration-500 dark:bg-dcard text-lfont dark:hover:bg-dbtn  border-lbtn border dark:border-dbtn flex justify-between rounded-xl text-sm w-full py-3 "
              > 
               <p className=" text-xl md:text-3xl "><FcGoogle/></p> 
               <p className=" my-auto">CONTINUE BY GOOGLE</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  signIn("linkedin");
                }}
                className="bg-lcard hover:bg-lbtn px-3  duration-500 dark:bg-dcard text-lfont dark:hover:bg-dbtn  border-lbtn border dark:border-dbtn flex justify-between rounded-xl text-sm  w-full py-3 "              >
               <p className=" text-xl md:text-3xl  text-darkblue"><FaLinkedin/></p> 
               <p className=" my-auto">CONTINUE BY LINKEDIN</p>             
                </button>

              <button
                type="button"
                onClick={() => {
                  signIn("twitter");
                }}
                className="bg-lcard hover:bg-lbtn px-3  duration-500 dark:bg-dcard text-lfont dark:hover:bg-dbtn  border-lbtn border dark:border-dbtn flex justify-between rounded-xl text-sm  w-full py-3 "              >
               <p className=" text-xl md:text-3xl  text-[#000]"><BsTwitterX/></p> 
               <p className=" my-auto">CONTINUE BY X</p>              
               </button>

              <button
                type="button"
                onClick={() => {
                  signIn("github");
                }}
                className="bg-lcard hover:bg-lbtn px-3  duration-500 dark:bg-dcard text-lfont dark:hover:bg-dbtn  border-lbtn border dark:border-dbtn flex justify-between rounded-xl text-sm  w-full py-3 "              >
               <p className=" text-xl md:text-3xl "><FaGithub/></p> 
               <p className=" my-auto">CONTINUE BY GITHUB</p>              
               </button>

            </div>

            <div className="md:hidden h-3 border-b border-lfont text-sm text-center">
               <span className="dark:bg-black bg-white px-2 text-lfont">or</span>
            </div> */}

            <div className=" space-y-5">

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
            </div>

      </div>
       {/* <p className="text-center my-5 text-[10px] md:text-[13px] text-lfont">
          <span className="text-red ">NOTE:</span> By login, you are agreeing to
          our{" "}
          <Link href="privacy-policy" className="text-purple underline">
            privacy policy
          </Link>{" "}
          , terms of use and code of conduct.
        </p> */}
</>


      
      

  );
};

export default Sign;
