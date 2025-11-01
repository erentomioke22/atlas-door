"use client";

import Input from "../ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingIcon from "../ui/loading/LoadingIcon";
import { toast } from "sonner";

type ShowState = "login" | "register" | "password";

interface PasswordProps {
  setShow: React.Dispatch<React.SetStateAction<ShowState>>;
}

const forgotPasswordSchema = z.object({
  email: z.email({ message: "لطفا یک ایمیل معتبر وارد کنید" }).trim().min(1, "فیلد ایمیل نباید خالی باشد"),
});

type ForgotPasswordValues =  z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({setShow}:PasswordProps) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState:{errors,isSubmitting},
    reset,
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit({ email }: ForgotPasswordValues) {
    setSuccess(null);
    setError(null);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    if (error) {
      setError(error.message || "Something went wrong");
      toast.error(error.message || "مشکلی در در برقراری ارتباط بوجود آمده");
    } else {
      setSuccess(
        "If an account exists for this email, we've sent a password reset link.",
      );
      toast.success(
        "اگر اکانتی با این ایمیل وجود داشته باشد ما لینک بازنشانی رمز رو برای اون ارسال کردیم",
      );
      reset();
    }
  }



  return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div className="w-full mx-auto">
          <Input
            title={"email"}
            type={"text"}
            placeholder="ایمیل حساب خود را وارد کنید"
            error={errors?.email?.message}
            {...register("email")}
          />
        </div>

            {/* {success && (
              <div role="status" className="text-sm text-green">
                {success}
              </div>
            )}
            {error && (
              <div role="alert" className="text-sm text-red">
                {error}
              </div>
            )} */}

<button
              className="bg-black my-3 rounded-lg text-lcard dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <LoadingIcon color={"bg-white dark:bg-black "} />
              ) : (
                "ارسال لینک"
              )}
            </button>
      <div className="text-center">
        <button
          className=" underline text-sm"
          onClick={() => {
            setShow("login");
          }}
        >
          برگشت به صفحه ی ورود
        </button>
      </div>
          </form>

  );
}
