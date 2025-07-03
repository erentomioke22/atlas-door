"use server";

import { auth } from "@auth";
import { prisma } from "@utils/database";
import { getUserDataSelect } from "@/lib/types";
import { utapi } from "@server/uploadthing";



export async function updateUserProfile(values) {
  // const validatedValues = updateUserProfileSchema.parse(values);

  const  session  = await auth();

  if (!session) throw new Error("Unauthorized");
// console.log(values,values.removedAvatar)
// if(values.password){
//   const hashedPassword = await hash(values.password, 12);
//   const user = await prisma.user.findUnique({
//     where:{id:session?.user.id}
//   })
//    if(!user){
//      throw new Error("user not found")
//    }
//   const comparePassword = await compare(values.lastPassword,user.password)

//   if(!comparePassword){
//      throw new Error("current password is not true")
//   }

//   const updatedUser = await prisma.user.update({
//     where:{id:session?.user.id},
//       data:{
//         password:hashedPassword,
//       }
//     });

//     return updatedUser;
// }

  if (values.removedAvatar !== null) {
    try {
     const deletedFiles = await utapi.deleteFiles([values.removedAvatar]);
    //  console.log(values.removedAvatar,deletedFiles)
    } catch (err) {
      console.error(err);
      throw new Error('Failed to delete archive image');
    }
  }


    const updatedUser = await prisma.user.update({
      where: { id: session?.user.id },
      data: values.values,
      select: getUserDataSelect(session?.user.id),
    });
   
    return updatedUser;

}

export async function deleteUser() {

  const  session  = await auth();

  if (!session) throw new Error("Unauthorized");

  if (values.rmFiles.length > 0) {
    try {
      await utapi.deleteFiles(values.rmFiles);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to delete archive image');
    }
  }

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user.id },
    });

    // console.log(currentUser)
    if (currentUser.image.length > 0) {
      try {
        await utapi.deleteFiles(currentUser.image);
      } catch (err) {
        console.error(err);
        throw new Error('Failed to delete archive image');
      }
    }

    const deleteUser = await prisma.user.delete({
      where: { id: session?.user.id },
    });
   
    return deleteUser;

}

export async function deleteAccount(values) {

  const  session  = await auth();

  if (!session) throw new Error("Unauthorized");



    const deleteAccount = await prisma.account.delete({
      where: { 
        provider_providerAccountId:{
          providerAccountId: values.providerAccountId,
          provider:values.provider
        }
      },
    });
   
    return deleteAccount;

}

export async function deleteSession(userId) {
  const  session  = await auth();
  if (!session) throw new Error("Unauthorized");


    const deleteSession = await prisma.session.deleteMany({
         where:{userId},
      });
  
      return deleteSession;
}