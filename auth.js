import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"
// import GitHub from "next-auth/providers/github"
// import Twitter from "next-auth/providers/twitter"
// import LinkedIn from "next-auth/providers/linkedin"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@utils/database"



export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma), 
  session:{
    strategy:"jwt",
    // maxAge:24 * 60 * 60  // 1 day
  },
    providers: [
     Credentials({
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user) {
            throw new Error("No user found with this email. Please sign up.");
          }
          const checkPassword = await compare(
            credentials.password,
            user.password
          );
          if (!checkPassword || user.email !== credentials.email) {
            throw new Error("Email & password doesn't match."); 
          }
          return user;

        } catch (error) {
          throw new Error(error);
        }
      },
    }),
    ],
    callbacks:{
      async signIn({account,user}){
        if(!user?.emailVerified){
          return false;
        }
        
        return true;
      },
      async jwt({token,user,session,trigger,account}){

      if(user){
        return{
          ...token,
          role:user.role,
          name:user.name,
          image:user.image,
          displayName:user.displayName,
          sessions:user.sessions,
          emailVerified:user.emailVerified,
          createdAt:user.createdAt,
          updatedAt:user.updatedAt,
        }
      }
       return token;
      },
      async session({session,token,user}){ 
        // console.log("session callback",{token,session,user})
       return{
         ...session,user:{
          ...session.user,
          id:token.sub,
          name:token.name,
          displayName:token.displayName,
          image:token.image,
          role:token.role,
          accounts:token.accounts,
          emailVerified:token.emailVerified,
          createdAt:token.createdAt,
          updatedAt:token.updatedAt,
        }
      }
      },
    },

  })
