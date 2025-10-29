"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/utils/database";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export async function deleteUserAction({ userId }: { userId: string }) {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });
  console.log(session?.user.id, userId)
  if (!session) throw new Error("Unauthorized");

  if (session.user.id !== userId) {
    throw new Error("Forbidden");
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId,
        role: "user",
      },
    });

    if (session.user.id === userId) {
      await auth.api.signOut({ headers: headersList });
      redirect("/");
    }

    revalidatePath("/");
    return { success: true, error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { success: false, error: err.message };
    }
    return { success: false, error: "Internal Server Error" };
  }
}




// if (values.removedAvatar !== null) {
//   try {
//    const deletedFiles = await utapi.deleteFiles([values.removedAvatar]);
//   //  console.log(values.removedAvatar,deletedFiles)
//   } catch (err) {
//     console.error(err);
//     throw new Error('Failed to delete archive image');
//   }
// }



