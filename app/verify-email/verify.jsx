"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import {  useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {useMutation} from "@tanstack/react-query";
import LoadingIcon from "@components/ui/loading/LoadingIcon";
import { IoCloseCircle } from "react-icons/io5";
import { IoCheckmarkCircle } from "react-icons/io5";


const VerifyPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");


  const verifyEmail = async (token) => {
    const response = await axios.post(`http://localhost:3000/api/new-verification?token=${token}`);
    return response.data;
  };

const{ mutate, data, error, isPending ,status} = useMutation({
  mutationKey:["verifyEmail",token],
  mutationFn:()=>verifyEmail(token)
})


useEffect(() => {
    if (token) {
        mutate();
    }
}, [token, mutate]);

if(status === "error" || data?.status !== 200 ) {
  <p className="text-red uppercase text-sm flex items-center gap-1">
    مشکلی در برقراری ارتباط وجود دارد
  </p>
}
  return (
      <div className="w-full md:w-1/3 mx-auto h-screen flex flex-col justify-center items-center space-y-3">
             
              <Link
                href="/"
                className="font-blanka text-lg "
              >
                ATLAS DOOR
              </Link>

         <p className="text-3xl ">تایید ایمیل</p>
      

      
        {isPending ? (
          <div className=" ">
            <p className="text-sm">لطفا منتظر بمانید</p>
             <LoadingIcon color={"bg-black dark:bg-white my-2"}/>
          </div>
        ) : (
          <>
          {data?.message && (
            <div className="text-darkgreen uppercase text-sm flex items-center gap-1">
              <IoCheckmarkCircle className="text-xl" />
              {data.message}
            </div>
          )}

          { data?.error && (
            <div className="text-red uppercase text-sm flex items-center gap-1">
              <IoCloseCircle className="text-xl" />
              {data.error}
            </div>
          )}

              </>
        )}
      </div>
  );
};

export default VerifyPage;