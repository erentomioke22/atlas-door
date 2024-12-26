import { prisma } from "@utils/database"



export const newVerification = async (token)=>{
    const existingToken = await prisma.verificationToken.findFirst({where:{token:token}});
    if(!existingToken){
        return {error : "invalid token"}
    }
    const hasExpired = new Date(existingToken.expires) < new Date()

    if(hasExpired){
        return {error : "token has expired"}
    }

    const existingUser = await prisma.user.findFirst({where:{email:existingToken.email}})

    if(!existingUser){
        return {error : "user not found"}
    }

    await prisma.user.update({where:{id:existingUser.id},data:{emailVerified:new Date(),email:existingToken.email}})

    await prisma.verificationToken.delete({where:{id:existingToken.id}})

    return {success : "email verified"}
}
