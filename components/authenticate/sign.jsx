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
        

      <div className="max-md:space-y-7  w-full sm:w-2/3 md:w-3/5 xl:w-2/6 mt-36 mx-auto  md:space-x-10 px-5">
             




              <div className="flex space-x-3 ">
                  <button onClick={()=>{setShow("register")}} className={`${show === "register" ? "bg-black rounded-full px-3 py-2  text-white dark:bg-white dark:text-black text-sm " : " text-sm bg-transparent border-2 border-black dark:border-white rounded-full px-3 py-2  text-black dark:text-white"}`}>SignUp</button>
                  <button onClick={()=>{setShow("login")}}    className={`${show === "login" ? "bg-black rounded-full px-3 py-2  text-white dark:bg-white dark:text-black text-sm " : " text-sm bg-transparent border-2 border-black dark:border-white rounded-full px-3 py-2  text-black dark:text-white"}`}>Login</button>
              </div>


                <div >
                  {show === "register" ? (
                    <Signup setShow={setShow} />
                  ) : (
                    <Login show={show} setShow={setShow} />
                  )}
                </div>

      </div>

</>


      
      

  );
};

export default Sign;
