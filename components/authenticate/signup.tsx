import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import LoadingIcon from "../ui/loading/LoadingIcon";
import { useForm } from "react-hook-form";
import { signupValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/input";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";



type ShowState = "login" | "register" | "password";

interface SignupProps {
  setShow: React.Dispatch<React.SetStateAction<ShowState>>;
}



type SignUpValues = z.infer<typeof signupValidation>;

const Signup: React.FC<SignupProps> = ({ setShow }) => {
  const [strength, setStrength] = useState<number>(0);
  const [validation, setValidation] = useState<boolean[]>([]);
  const [showpass, setShowPsss] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();



  const {
    register,
    handleSubmit,
    formState:{errors,isSubmitting},
    reset,
    watch
  } = useForm<SignUpValues>({
    resolver: zodResolver(signupValidation),
  });






  
  async function onSubmit({ email, password, name }: SignUpValues) {
    setError(null);
    try{
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/email-verified",
      });
  
      if (error) {
        setError(error.message || "Something went wrong");
        toast.error(error.message || "مشکلی در ثبت نام پیش آمده است");
      } else {
        toast.success("ثبت نام با موفقیت انجام شد");
        router.refresh();
      }
    }catch(error){
      console.error("Signup error:", error);
      setError("مشکلی در ثبت نام پیش آمده است");
      toast.error("مشکلی در ثبت نام پیش آمده است");
    }
    
  }



  const validatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;

    const validation = [
      password.length > 5,
      password.search(/[A-Z]/) > -1,
      password.search(/[0-9]/) > -1,
      password.search(/[$&+,:;=?@#!]/) > -1,
    ];

    setPassword(password);
    setValidation(validation);
    setStrength(validation.reduce<number>((acc, cur) => acc + (cur ? 1 : 0), 0));
  };

  const formValues: Array<{
    title: string;
    name: keyof SignUpValues;
    type: string;
    value?: string;
    error?: string;
    onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }> = [
    {
      title: "نام کاربری",
      name: "name",
      type: "text",
      error: errors.name?.message,
    },
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
      onInput: validatePassword,
    },
    {
      title: "تکرار گذرواژه",
      name: "confirmPassword",
      type: showpass ? "text" : "password",
      error: errors.confirmPassword?.message,
    },
  ];


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        {formValues.map((value) => (
          <div key={value.name}>
            <Input
              id={value.name}
              title={value.title}
              placeholder={value.title}
              error={value.error}
              {...register(value.name)}
              onInput={value.onInput}
              name={value.name}
              type={value.type}
            />

            {value.name === "password" && (
              <>
                <div className="flex gap-2 justify-between">
                  <div className="flex mx-auto h-[25px] w-5/6 my-5 gap-2">
                    <span
                      className={`rounded-lg h-full w-1/4 transition-opacity ${
                        strength > 0
                          ? "opacity-100 duration-500 ease-in-out border border-lcard dark:border-dcard  bg-linear-to-r from-[red]         to-[orangered]"
                          : "opacity-20 duration-500 bg-lbtn  border border-lfont "
                      }`}
                    ></span>
                    <span
                      className={`rounded-lg h-full w-1/4 transition-opacity ${
                        strength > 1
                          ? "opacity-100 duration-500 ease-in-out border border-lcard dark:border-dcard  bg-linear-to-r from-[orangered]   to-[yellow]"
                          : "opacity-20 duration-500 bg-lbtn  border border-lfont "
                      }`}
                    ></span>
                    <span
                      className={`rounded-lg h-full w-1/4 transition-opacity ${
                        strength > 2
                          ? "opacity-100 duration-500 ease-in-out border border-lcard dark:border-dcard  bg-linear-to-r from-[yellow]      to-[yellowgreen]"
                          : "opacity-20 duration-500 bg-lbtn  border border-lfont "
                      }`}
                    ></span>
                    <span
                      className={`rounded-lg h-full w-1/4 transition-opacity ${
                        strength > 3
                          ? "opacity-100 duration-500 ease-in-out border border-lcard dark:border-dcard  bg-linear-to-r from-[yellowgreen] to-[green]"
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
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? <LoadingIcon color={"bg-white dark:bg-black"} /> : "ثبت نام"}
        </button>
      </div>
    </form>
  );
};

export default Signup;
