import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password";

export const metadata: Metadata = {
  title: "بازنشانی رمز",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center px-4   container max-w-xl   mx-auto">
      {token ? (
        <ResetPasswordUI token={token} />
      ) : (
        <div role="alert" className="text-red-600">
         ! توکن اشتباه است 
        </div>
      )}
    </main>
  );
}

interface ResetPasswordUIProps {
  token: string;
}

function ResetPasswordUI({ token }: ResetPasswordUIProps) {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
      <h1  className="font-blanka text-2xl ">
         ATLAS DOOR
        </h1>
        <h1 className="text-xl font-semibold">بازنشانی رمز</h1>
        <p className="text-lfont">رمز جدید خود را اینجا وارد کنید</p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  );
}