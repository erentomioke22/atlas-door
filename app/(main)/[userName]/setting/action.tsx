// app/(main)/[userName]/setting/action.ts
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPayload } from "@/lib/payload";

export async function deleteUserAction({ userId }: { userId: string }) {
  const headersList = await headers();
  const payload = await getPayload();

  // 1) گرفتن session
  const session = await payload.betterAuth.api.getSession({
    headers: headersList,
  });

  if (!session) throw new Error("Unauthorized");

  // 2) فقط خود کاربر بتواند حذف کند (یا ادمین)
  const isSelf = session.user.id === userId;
  const isAdmin = (session.user as any).role === "admin";
  if (!isSelf && !isAdmin) {
    throw new Error("Forbidden");
  }

  // 3) حذف کاربر با Payload (نه Prisma)
  try {
    await payload.delete({
      collection: "users",
      id: userId,
    });
  } catch (err: any) {
    // خطاهای Payload را به پیام فارسی تبدیل کنید
    if (err?.status === 404) {
      return { success: false, error: "کاربر یافت نشد" };
    }
    return {
      success: false,
      error: err?.message || "خطا در حذف کاربر",
    };
  }

  // 4) خروج از session (فقط اگر خودش را حذف کرده)
  if (isSelf) {
    try {
      await payload.betterAuth.api.signOut({ headers: headersList });
    } catch {
      // مهم نیست — کاربر حذف شده
    }
  }

  revalidatePath("/");

  // ✅ redirect را بیرون از try/catch بگذارید
  if (isSelf) {
    redirect("/");
  }

  return { success: true, error: null };
}







