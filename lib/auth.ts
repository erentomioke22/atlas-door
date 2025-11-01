import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { prisma } from "@/utils/database";
import { passwordSchema } from "./validation";
import { generateVerificationTemplate,generatePasswordResetTemplate} from "./email-template";
import { sendEmailAction } from "./send-email-action";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [
    "https://atlasdoors.ir",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, 
    async sendResetPassword({ user, url }) {
      await sendEmailAction({
        to: user.email,
        subject: "بازنشانی رمز عبور",
        meta: generatePasswordResetTemplate(url,"برای باز نشانی رمز خود روی لینک کلیک کنید")
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60,
    // autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // const link = new URL(url);
      // link.searchParams.set("callbackURL", "/auth/verify");
      // meta: generateVerificationTemplate(String(link),"لطفا ایمیل خود را تایید کنید")
      await sendEmailAction({
        to: user.email,
        subject: "تایید آدرس ایمیل",
        meta: generateVerificationTemplate(url,"لطفا ایمیل خود را تایید کنید")

      });
    },
  },
  user: {
    // changeEmail: {
    //   enabled: true,
    //   async sendChangeEmailVerification({ user, newEmail, url }) {
    //     await sendEmail({
    //       to: user.email,
    //       subject: "Approve email change",
    //       text: `Your email has been changed to ${newEmail}. Click the link to approve the change: ${url}`,
    //     });
    //   },
    // },
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
      phone: {
        type: "string",
        required: false,
      },
      address: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "active",
      },
      emailVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      displayName: {
        type: "string",
        required: false,
        // input: true, // This will be in the sign-up form
      },
      name: {
        type: "string",
        required: false,
        unique: true, // This will be set from displayName in the hook
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);
        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password not strong enough",
          });
        }
      }
  
      if (ctx.path === "/sign-up/email" && ctx.body.name) {
        const existingUser = await prisma.user.findFirst({
          where: { name: ctx.body.name }
        });
  
        if (existingUser) {
          throw new APIError("BAD_REQUEST", {
            message: "این نام کاربری قبلا ثبت نام کرده است"
          });
        }
      }
  
      return ctx;
    }),
  },
  // hooks: {
  //   before: createAuthMiddleware(async (ctx) => {
  //     if (
  //       ctx.path === "/sign-up/email" ||
  //       ctx.path === "/reset-password" ||
  //       ctx.path === "/change-password"
  //     ) {
  //       const password = ctx.body.password || ctx.body.newPassword;
  //       const { error } = passwordSchema.safeParse(password);
  //       if (error) {
  //         throw new APIError("BAD_REQUEST", {
  //           message: "Password not strong enough",
  //         });
  //       }
  //     }
  //   }),
  //   // signUp: {
  //   //   async before(ctx:any) {
  //   //     // تولید نام کاربری منحصربه‌فرد
  //   //     // let sanitizedUsername = (ctx.body.name || "user").replace(/\s+/g, "_").toLowerCase();
  //   //     // const randomString = Math.random().toString(36).substring(2, 12);
  //   //     // sanitizedUsername += `_${randomString}`;
        
  //   //     // بررسی وجود نام کاربری
  //   //     const existingUser = await prisma.user.findFirst({
  //   //       where: { name: ctx.body.name }
  //   //     });
        
  //   //     if (existingUser) {
  //   //       throw new APIError("BAD_REQUEST", {
  //   //         message: "این نام کاربری قبلا ثبت نام کرده است"
  //   //       });
  //   //     }
        
  //   //     // تنظیم فیلدهای اضافی
  //   //     ctx.body = {
  //   //       ...ctx.body,
  //   //       name: ctx.body.name,
  //   //       displayName: ctx.body.name,
  //   //       role: "user",
  //   //       status: "active"
  //   //     };
        
  //   //     return ctx;
  //   //   },
      
  //   //   async after(ctx:any) {
  //   //     console.log("User signed up:", ctx.user.email);
  //   //     return ctx;
  //   //   }
  //   // },
    
  //   // هوک برای ورود با سوشال پرووایدرها
   
   
   

  //   signUp: {
  //     async before(ctx: any) {
  //       try {
  //         const existingUser = await prisma.user.findFirst({
  //           where: { name: ctx.body.name }
  //         });
  
  //         if (existingUser) {
  //           throw new APIError("BAD_REQUEST", {
  //             message: "این نام کاربری قبلا ثبت نام کرده است"
  //           });
  //         }
  
  //         ctx.body = {
  //           ...ctx.body,
  //           name: ctx.body.name,
  //           displayName: ctx.body.name,
  //           role: "user",
  //           status: "active"
  //         };
  
  //         return ctx;
  //       } catch (err: any) {
  //         if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
  //           throw new APIError("BAD_REQUEST", {
  //             message: "این نام کاربری یا ایمیل قبلا ثبت شده است"
  //           });
  //         }
  //         throw err;
  //       }
  //     }
  //   },
    
    

   
  //   socialLogin: {
  //     async before(ctx:any) {
  //       if (ctx.provider !== "credentials") {
  //         // تولید نام کاربری منحصربه‌فرد برای کاربران سوشال
  //         let sanitizedUsername = (ctx.user.name || "user").replace(/\s+/g, "_").toLowerCase();
  //         const randomString = Math.random().toString(36).substring(2, 12);
  //         sanitizedUsername += `_${randomString}`;
          
  //         ctx.user.name = sanitizedUsername;
  //         ctx.user.displayName = ctx.user.name || sanitizedUsername;
  //         ctx.user.role = "user";
  //         ctx.user.status = "active";
  //       }
  //       return ctx;
  //     }
  //   },
    
  //   // session: {
  //   //   async after(ctx:any) {
  //   //     if (ctx.session?.user) {
  //   //       ctx.session.user = {
  //   //         ...ctx.session.user,
  //   //         role: ctx.user.role,
  //   //         displayName: ctx.user.displayName,
  //   //         phone: ctx.user.phone,
  //   //         address: ctx.user.address,
  //   //         emailVerified: ctx.user.emailVerified,
  //   //         status: ctx.user.status,
  //   //         createdAt: ctx.user.createdAt,
  //   //         updatedAt: ctx.user.updatedAt,
  //   //       };
  //   //     }
  //   //     return ctx;
  //   //   }
  //   // }
  // },
  trustHost: true,
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;





