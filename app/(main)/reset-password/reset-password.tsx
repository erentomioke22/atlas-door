"use client";


import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingIcon from "@/components/ui/loading/LoadingIcon";
import { toast } from "sonner";
import Input from "@/components/ui/input";



const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState,
    reset,
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "" },
  });

  async function onSubmit({ newPassword }: ResetPasswordValues) {
    setSuccess(null);
    setError(null);

    const { error } = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (error) {
      setError(error.message || "Something went wrong");
      toast.error(error.message || "مشکلی در در برقراری ارتباط بوجود آمده");
    } else {
      setSuccess("Password has been reset. You can now sign in.");
      toast.success("رمز عبور با موفقیت بازنشانی شد");
      setTimeout(() => router.push("/"), 3000);
      reset();
    }
  }

  const loading = formState.isSubmitting;

  return (

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="w-full mx-auto">
          <Input
            title={"رمز جدید"}
            type={"password"}
            error={formState.errors?.newPassword?.message}
            {...register("newPassword")}
          />
        </div>
            {/* {success && (
              <div role="status" className="text-sm text-green-600">
                {success}
              </div>
            )}
            {error && (
              <div role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )} */}
           <button
              className="bg-black my-3 rounded-lg text-lcard dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <LoadingIcon color={"bg-white dark:bg-black "} />
              ) : (
                " بازنشانی رمز"
              )}
            </button>
          </form>

  );
}