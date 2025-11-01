import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { ForgotPasswordForm } from "./forgot-password";
import { toast } from "sonner";
import { loginValidation } from "@/lib/validation";
import { useForm } from "react-hook-form";
import LoadingIcon from "../ui/loading/LoadingIcon";
import Input from "../ui/input";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Toggle from "../ui/toggle";


type ShowState = "login" | "register" | "password";

interface LoginProps {
  show: ShowState;
  setShow: React.Dispatch<React.SetStateAction<ShowState>>;
}

type SignInValues = z.infer<typeof loginValidation>;

const Login: React.FC<LoginProps> = ({ show, setShow }) => {
  const [showpass, setShowPass] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInValues>({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });


  async function onSubmit({ email, password, rememberMe }: SignInValues) {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong");
      toast.error(error.message || "مشکلی در برقراری ارتباط بوجود آمده");
    } else {
      toast.success("ورود با موفقیت انجام شد");
      reset();
      router.refresh();
    }
  }

  const formValues: Array<{
    title: string;
    name: keyof SignInValues;
    type: string;
    error?: string;
  }> = [
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
      {show === "password" ? (
        <ForgotPasswordForm setShow={setShow} />
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 mx-auto">
              {formValues.map((value) => {
                // Get the register function for this field
                
                return (
                  <div key={value.name} className="space-y-2">
                    <Input
                      placeholder={value.title}
                      title={value.title}
                      type={value.type}
                      error={value.error}
                      {...register(value.name)}
                    />
                    
                    {value.name === "password" && (
                      <div className="flex gap-5 justify-between">
                        <button
                          type="button"
                          onClick={() => setShow('password')}
                          className="text-sm text-lfont underline decoration-2 decoration-neutral-900"
                        >
                          گذرواژه رو فراموش كردم؟
                        </button>
                        <button
                          className="bg-lcard dark:bg-dcard rounded-lg p-2 border-lbtn dark:border-dbtn border-2"
                          onClick={() => setShowPass(!showpass)}
                          type="button"
                        >
                          {showpass ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2 my-4 space-x-reverse">
                    <Toggle
                      title="مرا به خاطر بسپار"
                      {...register("rememberMe")}
                    />
            </div>



            <button
              className="bg-black my-3 rounded-lg text-lcard dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <LoadingIcon color={"bg-white dark:bg-black "} />
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