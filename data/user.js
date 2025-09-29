import { prisma } from "@utils/database";


export const updateUserByAccount = async (providerAccountId,provider,userName,email)=>{
    try{
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
        return; 
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
    }
}