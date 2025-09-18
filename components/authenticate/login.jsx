import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { signIn } from "next-auth/react";
import RecoveryPass from "./recoveryPass";
import { toast } from "sonner";
import { loginValidation } from "@lib/validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingIcon from "@components/ui/loading/LoadingIcon";
import Input from "@components/ui/input";
import { useMutation } from "@tanstack/react-query";

const Login = ({ show, setShow }) => {
  const [showpass, setShowPsss] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(loginValidation),
  });


  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: "/",
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.message) {
        toast.success("با موفقیت وارد شدید");
        reset();
      } else if (data.error) {
        if (data.error === "Configuration") {
          toast.error("ایمیل یا گذرواژه صحیح نمیباشد");
        }
        if (data.error === "AccessDenied") {
          toast.error("لطفا ایمیلتان را تایید کنید");
        }
        if (data.error === null) {
          toast.success("با موفقیت وارد شدید");
        }
      }
    },
    onError: (error) => {
      // error can be axios error or something else
      console.log(error)
      
      let message = "خطایی رخ داد. لطفا دوباره تلاش کنید.";
      if (error?.response?.data?.error) {
        message = error.response.data.error;
      } else if (typeof error === "string") {
        message = error;
      } else if (error?.message) {
        message = error.message;
      }
      toast.error(message);
    },
  });

  const onSubmit = (values) => {
    mutation.mutate(values);
  };



  const formValues = [
    {
      title: "ايميل",
      name: "email",
      type: "email",
      error: errors.email?.message,
    },
    {
      title: "گذرواژه",
      name: "password",
      type: showpass ? "text" : "password",
      error: errors.password?.message,
    },
  ];

  return (
    <>
      {show === "recovery" ? (
        <RecoveryPass setShow={setShow} />
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" space-y-4  mx-auto">
              {formValues.map((value) => {
                return (
                  <div key={value.name}>
                    <Input
                      placeholder={value.title}
                      title={value.title}
                      name={value.name}
                      type={value.type}
                      error={value.error}
                      {...register(value.name)}
                    />

                    {value.name === "password" && (
                      <div className="flex gap-5 justify-between mt-2">
                        <button
                          type="button"
                          className="text-sm text-lfont underline decoration-2 decoration-neutral-900"
                          // onClick={() => {
                          //   setShow("recovery");
                          // }}
                        >
                          گذرواژه رو فراموش كردم؟
                        </button>
                        <button
                          className="bg-lcard dark:bg-dcard rounded-lg p-2 border-lbtn dark:border-dbtn border-2 "
                          onClick={() => setShowPsss(!showpass)}
                          type={"button"}
                        >
                          {showpass ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              className="bg-black my-3 rounded-lg text-lcard dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center"
              disabled={mutation.isPending}
              type="submit"
            >
              {mutation.isPending ? (
                <LoadingIcon color={"bg-white dark:bg-black "}/>
              ) : (
                "ورود"
              )}
            </button>
          </form>
        </>
      )}
    </>
  );
};

export default Login;
