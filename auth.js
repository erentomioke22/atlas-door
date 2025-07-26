import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Twitter from "next-auth/providers/twitter"
import LinkedIn from "next-auth/providers/linkedin"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@utils/database"
import { updateUserByAccount } from "@data/user"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma), 
  session:{
    strategy:"jwt",
    // maxAge:24 * 60 * 60  // 1 day
  },
    providers: [
     Google, 
     GitHub,
     Twitter,
     LinkedIn,
     Credentials({
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user) {
            throw new Error("No user found with this email. Please sign up.");
          }
          // if (!user.emailVerified) {
          //   throw new Error("Please verify your email.");
          // }
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
        // console.log("user callback",{account,user})
        
        if(account?.provider !== "credentials"){
        account.email = user.email;
        account.userName = user.name

        let sanitizedUsername = user.name.replace(/\s+/g, '_').toLowerCase();
        const randomString = Math.random().toString(36).substring(2, 12);
        sanitizedUsername += `_${randomString}`;
       
        // const existName = await prisma.user.findUnique({
        //   where: {
        //     name:sanitizedUsername,
        //   },
        // });
  
        // if (existName) {
        //   let sanitizedUsername = user.name.replace(/\s+/g, '_').toLowerCase();
        //   const randomString = Math.random().toString(36).substring(2, 12);
        //   sanitizedUsername += `_${randomString}`;
        // }

        user.displayName = user.name;
        user.name = sanitizedUsername;
        if(user.status === "suspend"){
          await prisma.user.update({
            where: { email: user.email },
            data: { status: "active" },
          });
          user.status = "active";
        }
          return true;
        }

        if(!user?.emailVerified){
          return false;
        }
        
        return true;
      },
      async jwt({token,user,session,trigger,account}){
        // console.log("jwt callback",{token,user,session,account,trigger})
        if(account){
          await updateUserByAccount(account.providerAccountId,account.provider,account.userName,account.email)
        }
        if (trigger === "update" && session) {
          // console.log('update',Object.keys(session))
          Object.keys(session).forEach((key) => {
            if (session[key] !== undefined) {
              token[key] = session[key];
            }
          });
        }
      
      if(user){
        return{
          ...token,
          role:user.role,
          name:user.name,
          image:user.image,
          displayName:user.displayName,
          phone:user.phone,
          adderss:user.adderss,
          emailVerified:user.emailVerified,
          sessions:user.sessions,
          createdAt:user.createdAt,
          updatedAt:user.updatedAt,
          location:user.location,
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
          emailVerified:token.emailVerified,
          phone:token.phone,
          address:token.address,
          image:token.image,
          role:token.role,
          accounts:token.accounts,
          posts:token.posts,
          createdAt:token.createdAt,
          updatedAt:token.updatedAt,
          location:token.location,

        }
      }
      },
    },

  })