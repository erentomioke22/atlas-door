import React, { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { BsTwitterX } from "react-icons/bs";
import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import Offcanvas from "../ui/offcanvas";
import { IoClose } from "react-icons/io5";
import Login from "./login";
import Signup from "./signup";
import Button from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type ShowState = "login" | "register" | "password";

interface SignProps {
  title?: React.ReactNode;
  commentStyle?: string;
  session?: unknown;
}

const Sign: React.FC<SignProps> = ({ title, commentStyle, session }) => {
  const [show, setShow] = useState<ShowState>("login");
  const [close, setClose] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  async function handleSocialSignIn(
    provider: "google" | "github" | "linkedin" | "twitter"
  ) {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: redirect ?? "/",
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong");
      toast.error(error.message || "مشکلی در برقراری ارتباط بوجود آمده");
    }
  }

  return (
    <Offcanvas
      title={title}
      position={"top-0 right-0"}
      size={
        "h-screen max-w-full w-96 border-l-2 border-l-lcard dark:border-l-dcard"
      }
      openTransition={"translate-x-0"}
      closeTransition={"translate-x-full"}
      onClose={close}
    >
      <div className=" flex justify-between">
        <h1 className="text-xl ">ثبت نام - ورود</h1>

        <Button
          className={
            " text-lg bg-lcard dark:bg-dcard px-2 py-1  rounded-full border-2 text-lfont "
          }
          onClick={() => setClose(!close)}
          type="button"
          variant="close"
          title="close button"
        >
          <IoClose />
        </Button>
      </div>

      <div className="space-y-5  w-full ">
        <div className=" bg-lcard dark:bg-dcard w-full rounded-lg grid grid-cols-2 ">
          <button
            onClick={() => {
              setShow("register");
            }}
            className={` px-2 py-1 m-1 rounded-lg text-sm ${
              show === "register" ? "bg-lbtn dark:bg-dbtn" : " "
            }`}
          >
            ثبت نام
          </button>
          <button
            onClick={() => {
              setShow("login");
            }}
            className={` px-2 py-1 m-1 rounded-lg text-sm ${
              show === "login" ? "bg-lbtn dark:bg-dbtn" : " "
            }`}
          >
            ورود
          </button>
        </div>

        <div className="space-y-3 ">
          <p className="text-xl ">
            {show === "register" ? "ثبت نام" : "ورود"} با حساب های شما{" "}
            <span className="text-darkgreen text-sm">روش ساده تر</span>
          </p>

          <button
            type="button"
            onClick={() => {
              // signIn("google");
              handleSocialSignIn("google");
            }}
            className="hover:bg-lcard   duration-500 dark:hover:bg-dcard     flex  rounded-xl text-sm w-full  p-2 gap-2"
          >
            <p className=" text-2xl  ">
              <FcGoogle />
            </p>
            <p className=" my-auto">ورود با حساب GOOGLE</p>
          </button>

          <button
            type="button"
            onClick={() => {
              handleSocialSignIn("linkedin");
            }}
            className="hover:bg-lcard  duration-500 dark:hover:bg-dcard    flex  rounded-xl text-sm  w-full p-2 gap-2"
          >
            <p className=" text-2xl  text-darkblue">
              <FaLinkedin />
            </p>
            <p className=" my-auto">ورود با حساب LINKEDIN</p>
          </button>

          <button
            type="button"
            onClick={() => {
              handleSocialSignIn("github");
            }}
            className="hover:bg-lcard    duration-500 dark:hover:bg-dcard     flex  rounded-xl text-sm  w-full  p-2 gap-2"
          >
            <p className=" text-2xl ">
              <FaGithub />
            </p>
            <p className=" my-auto">ورود با حساب GITHUB</p>
          </button>

          <button
            type="button"
            onClick={() => {
              handleSocialSignIn("twitter");
            }}
            className="hover:bg-lcard   duration-500 dark:hover:bg-dcard    flex  rounded-xl text-sm  w-full  p-2 gap-2"
          >
            <p className=" text-2xl ">
              <BsTwitterX />
            </p>
            <p className=" my-auto">ورود با حساب X</p>
          </button>
        </div>

        <div className=" space-y-5">
          {show === "password" || (
            <p className="text-xl ">
              {show === "register" ? "ثبت نام" : "ورود"} با ایمیل{" "}
              <span className="text-redorange text-sm">روش طولاني تر</span>
            </p>
          )}
          <p className=" text-xl">
            {show === "password" && "بازیابی رمز عبور"}
          </p>
          <div>
            {show === "register" ? (
              <Signup setShow={setShow} />
            ) : (
              <Login show={show} setShow={setShow} />
            )}
          </div>
        </div>
        <p className="text-center my-5 text-[12px] text-lfont">
          <span className="text-red ">نکته:</span> با ورود، شما موافقت میکنید با
          <Link
            href="/privacy-policy"
            className="text-black dark:text-white underline"
            onClick={() => setClose(!close)}
          >
            سیاست حفظ حریم خصوصی
          </Link>{" "}
          ,ما شرایط استفاده و رفتار.
        </p>
      </div>
    </Offcanvas>
  );
};

export default Sign;
