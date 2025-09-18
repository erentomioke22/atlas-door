'use client'

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import LoadingIcon from "@components/ui/loading/LoadingIcon";
import { IoCloseCircle, IoCheckmarkCircle } from "react-icons/io5";

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifyEmail = async (token) => {
    const res = await axios.post(`/api/new-verification?token=${token}`);
    return res.data;
  };

  const { mutate, data, isPending, isError } = useMutation({
    mutationKey: ["verifyEmail", token],
    mutationFn: () => verifyEmail(token),
    retry: false,
  });

  useEffect(() => {
    if (token) mutate();
  }, [token, mutate]);

  return (
    <div className="w-full md:w-1/3 mx-auto h-screen flex flex-col justify-center items-center space-y-3">
      <Link href="/" className="font-blanka text-lg ">
        ATLAS DOOR
      </Link>

      <p className="text-3xl ">تایید ایمیل</p>

      {isPending ? (
        <div>
          <p className="text-sm">لطفا منتظر بمانید</p>
          <LoadingIcon color={"bg-black dark:bg-white my-2"} />
        </div>
      ) : (
        <>
          {data?.message && (
            <div className="text-darkgreen uppercase text-sm flex items-center gap-1">
              <IoCheckmarkCircle className="text-xl" />
              {data.message}
            </div>
          )}

          {(isError || data?.error) && (
            <div className="text-red uppercase text-sm flex items-center gap-1">
              <IoCloseCircle className="text-xl" />
              {data?.error || "مشکلی در برقراری ارتباط وجود دارد"}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VerifyPage;