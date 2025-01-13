import { prisma } from "@utils/database"

export const getVerificationTokenByEmail = async (email)=>{
    try{
      const verificationToken = await prisma.verificationToken.findFirst({where:{email}})
      return verificationToken;
    }catch(error){
      // console.log(error);
    }
}


export const getVerificationTokenByToken = async (token)=>{
    try{
      // console.log(token)
      const newVerificationToken = await prisma.verificationToken.findFirst({where:{token:token}});
      return newVerificationToken;
    }catch(error){
      // console.log(error);
    }
}



export const deleteVerificationTokenById = async (verificationId)=>{
    try{
      // console.log(verificationId)
      const deleteVerificationToken = await prisma.verificationToken.delete({where:{id:verificationId}});
      return deleteVerificationToken;
    }catch(error){
      // console.log(error);
    }
}


