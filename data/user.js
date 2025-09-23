import { prisma } from "@utils/database";

export const updateUserByEmail = async (
  userId,
  userName,
  userImage,
  userTags,
  userBio,
  userLocation,
  userComunity,
  userDisplayName
) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: userName,
        image: userImage,
        displayName: userDisplayName,
        tags: userTags,
        bio: userBio,
        location: userLocation,
        comunity: userComunity,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

// export const updateUserByAccount = async (
//   providerAccountId,
//   provider,
//   userName,
//   email
// ) => {
//   try {
//     await prisma.account.update({
//       where: {
//         provider_providerAccountId: {
//           provider,
//           providerAccountId,
//         },
//       },
//       data: {
//         userName,
//         email,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };




export const updateUserByAccount = async (providerAccountId,provider,userName,email)=>{
    try{
      // ابتدا بررسی کنیم که account وجود دارد یا نه
      const existingAccount = await prisma.account.findUnique({
        where:{
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
      });

      if (!existingAccount) {
        console.log("Account not found for provider:", provider, "providerAccountId:", providerAccountId);
        return; // یا می‌توانید یک error throw کنید
      }

      await prisma.account.update({
        where:{
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        data:{
          userName,
          email
        }
       })
        
    }catch(error){
      console.error("Error in updateUserByAccount:", error);
      // بهتر است error را throw نکنیم تا authentication متوقف نشود
    }
}