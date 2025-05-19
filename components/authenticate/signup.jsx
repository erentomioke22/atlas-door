import React, { useState, useTransition } from "react";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import LoadingIcon from "@components/ui/loading/loadingIcon";
import { useForm } from "react-hook-form";
import { signupValidation } from "@lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@components/ui/input";

const Signup = ({ setShow }) => {
  const [strength, setStrength] = useState(0);
  const [validation, setValidation] = useState([]);

  const [showpass, setShowPsss] = useState(false);
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(signupValidation),
  });

  const onSubmit = async (values) => {
    startTransition(async () => {
      try {
        const { confirmPassword, ...data } = values;
        const response = await axios.post("/api/auth/register", data);
        // console.log(values, response);
        if (response.data.message) {
          toast.success(response.data.message);
          reset();
          setTimeout(() => {
            setShow(false);
          }, 5000);
        } else if (response.data.error) {
          toast.error(response.data.error);
        }
      } catch (error) {
        toast.error(response.data.error);
      }
    });
  };

  const validatePassword = (e) => {
    const password = e.target.value;
    // console.log(password);

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
      title: "user name",
      name: "name",
      type: "text",
      value: "",
      error: errors.name?.message,
    },
    {
      title: "email",
      name: "email",
      type: "email",
      value: "",
      error: errors.email?.message,
    },
    {
      title: "password",
      name: "password",
      type: showpass ? "text" : "password",
      value: "",
      error: errors.password?.message,
      onInput: validatePassword,
    },
    {
      title: "confirm password",
      name: "confirmPassword",
      type: showpass ? "text" : "password",
      value: "",
      error: errors.confirmPassword?.message,
    },
  ];

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          {formValues.map((value) => (
            <div key={value.name}>
              <Input
                title={value.title}
                onInput={value.onInput}
                name={value.name}
                type={value.type}
                error={value.error}
                {...register(value.name)}
              />

              {value.name === "password" && (
                <>
                  <div className="text-end"></div>
                  <div className="flex mx-auto h-[25px] w-5/6 my-5 space-x-2">
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
                    <button
                      className="bg-black rounded-full text-lcard dark:bg-white dark:text-black   px-3  "
                      onClick={() => setShowPsss(!showpass)}
                      type="button"
                    >
                      {showpass ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-3 text-center mt-10">
          <button
            className="bg-black rounded-lg text-lcard dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <LoadingIcon
                color={
                  "text-black dark:text-white dark:fill-black fill-white mx-auto"
                }
              />
            ) : (
              "REGISTER"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default Signup;
