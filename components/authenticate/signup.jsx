import React, { useState } from "react";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import LoadingIcon from "@components/ui/loading/LoadingIcon";
import { useForm } from "react-hook-form";
import { signupValidation } from "@lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@components/ui/input";
import { useMutation } from "@tanstack/react-query";

const Signup = ({ setShow }) => {
  const [strength, setStrength] = useState(0);
  const [validation, setValidation] = useState([]);

  const [showpass, setShowPsss] = useState(false);
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(signupValidation),
  });


  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        reset();
        // setTimeout(() => setShow(false), 5000);
      } else if (data.error) {
        toast.error(data.error);
      }
    },
    onError: (error) => {
      // error can be axios error or something else
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
    const { confirmPassword, ...data } = values;
    mutation.mutate(data);
  };



  const validatePassword = (e) => {
    const password = e.target.value;

    const validation = [
      password.length > 5,
      password.search(/[A-Z]/) > -1,
      password.search(/[0-9]/) > -1,
      password.search(/[$&+,:;=?@#!]/) > -1,
    ];

    setPassword(password);
    setValidation(validation);
    setStrength(validation.reduce((acc, cur) => acc + cur));
  };

  const formValues = [
    {
      title: "نام کاربری",
      name: "name",
      type: "text",
      value: "",
      error: errors.name?.message,
    },
    {
      title: "ايميل",
      name: "email",
      type: "email",
      value: "",
      error: errors.email?.message,
    },
    {
      title: "گذرواژه",
      name: "password",
      type: showpass ? "text" : "password",
      value: "",
      error: errors.password?.message,
      onInput: validatePassword,
    },
    {
      title: "تکرار گذرواژه",
      name: "confirmPassword",
      type: showpass ? "text" : "password",
      value: "",
      error: errors.confirmPassword?.message,
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        {formValues.map((value) => (
          <div key={value.name}>
            <Input
              title={value.title}
              placeholder={value.title}
              onInput={value.onInput}
              name={value.name}
              type={value.type}
              error={value.error}
              // label={true}
              {...register(value.name)}
            />

            {value.name === "password" && (
              <>
                <div className="flex gap-2 justify-between">
                <div className="flex mx-auto h-[25px] w-5/6 my-5 gap-2">
                  <span
                    className={`rounded-lg h-full w-1/4 transition-opacity ${
                      strength > 0
                        ? "opacity-100 duration-500 ease-in-out border border-lcard dark:border-dcard  bg-gradient-to-r from-[red]         to-[orangered]"
                        : "opacity-20 duration-500 bg-lbtn  border border-lfont "
                    }`}
                  ></span>
                  <span
                    className={`rounded-lg h-full w-1/4 transition-opacity ${
                      strength > 1
                        ? "opacity-100 duration-500 ease-in-out border border-lcard dark:border-dcard  bg-gradient-to-r from-[orangered]   to-[yellow]"
                        : "opacity-20 duration-500 bg-lbtn  border border-lfont "
                    }`}
                  ></span>
                  <span
                    className={`rounded-lg h-full w-1/4 transition-opacity ${
                      strength > 2
                        ? "opacity-100 duration-500 ease-in-out border border-lcard dark:border-dcard  bg-gradient-to-r from-[yellow]      to-[yellowgreen]"
                        : "opacity-20 duration-500 bg-lbtn  border border-lfont "
                    }`}
                  ></span>
                  <span
                    className={`rounded-lg h-full w-1/4 transition-opacity ${
                      strength > 3
                        ? "opacity-100 duration-500 ease-in-out border border-lcard dark:border-dcard  bg-gradient-to-r from-[yellowgreen] to-[green]"
                        : "opacity-20 duration-500 bg-lbtn  border border-lfont "
                    }`}
                  ></span>
                </div>
                <div className="my-auto">
                   <button
                     className="bg-lcard dark:bg-dcard rounded-lg p-2 border-lbtn dark:border-dbtn border-2 "
                     onClick={() => setShowPsss(!showpass)}
                     type={"button"}
                   >
                     {showpass ? <FaRegEye /> : <FaRegEyeSlash />}
                   </button>
                </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-3 text-center mt-10">
        <button
          className="bg-black rounded-lg text-lcard dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center"
          disabled={mutation.isPending}
          type="submit"
        >
          {mutation.isPending ? (
            <LoadingIcon color={"bg-white dark:bg-black"}/>
          ) : (
            "ثبت نام"
          )}
        </button>
      </div>
    </form>
  );
};

export default Signup;
