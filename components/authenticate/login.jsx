import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { signIn } from "next-auth/react";
import {  toast } from 'sonner'
import { loginValidation } from "@lib/validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingSpinner from "@components/ui/loading/loadingSpinner";
import Input from "@components/ui/input";

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

  const onSubmit = async (values) => {
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: "/",
      });

      // console.log(response);
      if (response.error === "Configuration") {
        toast.error("email or password incorrect");
      }
      if (response.error === "AccessDenied") {
        toast.error("please confirm your email address");
      }
      if (response.error === null) {
        toast.success("successfully Login");
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const formValues = [
    {
      title: "ایمیل",
      name: "email",
      type: "email",
      error: errors.email?.message,
    },
    {
      title: "پسورد",
      name: "password",
      type: showpass ? "text" : "password",
      error: errors.password?.message,
    },
  ];

  return (
    <>
      {/* {show === "recovery" ? (
        <RecoveryPass setShow={setShow} />
      ) : (
        <> */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" space-y-4  mx-auto">
              {formValues.map((value) => {
                return (
                  <div key={value.name}>
                    <Input
                      placeholder={value.title}
                      name={value.name}
                      type={value.type}
                      error={value.error}
                      {...register(value.name)}
                    />

                    {value.name === "password" && (
                      <div className="flex space-x-5 justify-end mt-2">
                        {/* <button
                          className="text-sm text-purple underline"
                          onClick={() => {
                            setShow("recovery");
                          }}
                        >
                          FORGOT PASSWORD?
                        </button> */}
                        <button
                          className="bg-black rounded-full text-lcard dark:bg-white dark:text-black   px-3 py-1 "
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
            disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <LoadingSpinner color={"text-black dark:text-white dark:fill-black fill-white mx-auto"}/> : "LOGIN"}
            </button>

          </form>
        {/* </>
      )} */}
    </>
  );
};

export default Login;
