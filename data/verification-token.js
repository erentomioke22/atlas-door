import { prisma } from "@utils/database"

export const getVerificationTokenByEmail = async (email)=>{
    try{
      const verificationToken = await prisma.verificationToken.findFirst({where:{email}})
      return verificationToken;
    }catch(error){
      console.error(error);
    }
}




export const deleteVerificationTokenById = async (verificationId)=>{
    try{
      const deleteVerificationToken = await prisma.verificationToken.delete({where:{id:verificationId}});
      return deleteVerificationToken;
    }catch(error){
      console.error(error);
    }
}


