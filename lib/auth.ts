import { generateVerificationTemplate,generatePasswordResetTemplate} from "./email-template";
// import { sendEmailAction } from "./send-email-action";
import { nextCookies } from "better-auth/next-js";
import type { BetterAuthOptions, PayloadAuthOptions } from 'payload-auth/better-auth'
import { admin, twoFactor } from 'better-auth/plugins'
import { getPayload } from '@/lib/payload'




export const betterAuthOptions = {
  appName: 'atlas-door',
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "https://atlasdoors.ir",
    "https://www.atlasdoors.ir",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
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
      const payload = await getPayload();
      await payload.sendEmail({
        to: user.email,
        subject: "بازنشانی رمز عبور",
        html: generatePasswordResetTemplate(url, "برای بازنشانی رمز خود روی لینک کلیک کنید")
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60,
    async sendVerificationEmail({ user, url }) {
      const payload = await getPayload();
      await payload.sendEmail({
        to: user.email,
        subject: "تایید آدرس ایمیل",
        html: generateVerificationTemplate(url, "لطفا ایمیل خود را تایید کنید")
      });
    },
  },
  // emailAndPassword: {
  //   enabled: true,
  //   requireEmailVerification: false, 
  //   async sendResetPassword({ user, url }) {
  //     await sendEmailAction({
  //       to: user.email,
  //       subject: "بازنشانی رمز عبور",
  //       meta: generatePasswordResetTemplate(url,"برای باز نشانی رمز خود روی لینک کلیک کنید")
  //     });
  //   },
  // },
  // emailVerification: {
  //   sendOnSignUp: true,
  //   expiresIn: 60 * 60,
  //   // autoSignInAfterVerification: true,
  //   sendVerificationEmail: async ({ user, url }) => {
  //     // const link = new URL(url);
  //     // link.searchParams.set("callbackURL", "/auth/verify");
  //     // meta: generateVerificationTemplate(String(link),"لطفا ایمیل خود را تایید کنید")
  //     await sendEmailAction({
  //       to: user.email,
  //       subject: "تایید آدرس ایمیل",
  //       meta: generateVerificationTemplate(url,"لطفا ایمیل خود را تایید کنید")

  //     });
  //   },
  // },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
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
        input: false,
      },
  
      displayName: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [admin(), twoFactor(), nextCookies()],
} satisfies BetterAuthOptions




export const payloadAuthOptions = {
  users: {
    slug: 'users',
    roles: ['user', 'admin'],
    adminRoles: ['admin'],
    defaultRole: 'user',
    allowedFields: ['name', 'phone', 'address', 'displayName'],
    
    collectionOverrides: ({ collection }) => ({
      ...collection,
      fields: collection.fields.map((field) =>
        'name' in field && field.name === 'image'
          ? { ...field, saveToJWT: true }
          : field
      ),
    }),

     // extendsCollections: {
    //   users: {
    //     fields: [
    //       { name: 'phone', type: 'text' },
    //       { name: 'address', type: 'textarea' },
    //       { name: 'displayName', type: 'text' },
    //     ],
    //   },
    // },
  },
  betterAuthOptions,
} satisfies PayloadAuthOptions
export type PayloadAuthConfig = typeof payloadAuthOptions


