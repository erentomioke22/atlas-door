import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { prisma } from "@/utils/database";
import { passwordSchema } from "./validation";
import { generateVerificationTemplate,generatePasswordResetTemplate} from "./email-template";
import { sendEmailAction } from "./send-email-action";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [
    "https://atlasdoors.ir",
    "https://www.atlasdoors.ir",
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
        unique: true, 
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
  trustHost: true,
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;





