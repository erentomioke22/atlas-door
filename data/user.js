import { prisma } from "@utils/database"


export const updateUserByEmail = async (userId,userName,userImage,userTags,userBio,userLocation,userComunity,userDisplayName)=>{
    try{
       await prisma.user.update({where:{id:userId},data:{
          name:userName,
          image:userImage,
          displayName:userDisplayName,
          tags:userTags,
          bio:userBio,
          location:userLocation,
          comunity:userComunity
        }})

        // console.log("newUser",newUser)
        
    }catch(error){
      // console.log(error);
    }
}

export const updateUserByAccount = async (providerAccountId,provider,userName,email)=>{
    try{
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

        // console.log("newUser",newUser)
        
    }catch(error){
      // console.log(error);
    }
}




