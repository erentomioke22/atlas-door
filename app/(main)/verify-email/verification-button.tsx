"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import LoadingIcon from "@/components/ui/loading/LoadingIcon";
interface ResendVerificationButtonProps {
  email: string;
}

export function ResendVerificationButton({
  email,
}: ResendVerificationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function resendVerificationEmail() {
    setSuccess(null);
    setError(null);
    setIsLoading(true);

    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/email-verified",
    });

    setIsLoading(false);

    if (error) {
      setError(error.message || "مشکلی در برقراری ارتباط پیش آمده");
    } else {
      setSuccess("ایمیل تایید با موفقیت ارسال شد");
    }
  }

  return (
    <div className="space-y-4">
      {success && (
        <div role="status" className="text-sm text-green">
          {success}
        </div>
      )}
      {error && (
        <div role="alert" className="text-sm text-red">
          {error}
        </div>
      )}


        <button
              className="bg-black my-3 rounded-lg text-lcard dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center"
              disabled={isLoading}
              onClick={resendVerificationEmail}
              type="submit"
            >
              {isLoading ? (
                <LoadingIcon color={"bg-white dark:bg-black "} />
              ) : (
                "ارسال دوباره ایمیل تایید"
              )}
            </button>
    </div>
  );
}