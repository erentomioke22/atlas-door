import Button from "@/components/ui/Button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ایمیل تایید شد",
};

export default function EmailVerifiedPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">ایمیل تایید شد</h1>
          <p className="text-muted-foreground">
            ایمیل شما با موفقیت تایید شد
          </p>
        </div>
        <Button >
          <Link href="/">بازگشت به صفحه ی اصلی</Link>
        </Button>
      </div>
    </main>
  );
}