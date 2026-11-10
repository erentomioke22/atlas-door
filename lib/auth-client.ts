import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  inferAdditionalFields,
  twoFactorClient,
} from "better-auth/client/plugins";
// import { betterAuthOptions } from "./auth";
import { clientAdditionalFields } from "./auth-shared";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,

  plugins: [
    adminClient(),
    twoFactorClient(),

    inferAdditionalFields({
      user: clientAdditionalFields,
    }),
  ],

  // $InferAuth: betterAuthOptions,
});

export const { signIn, signUp, signOut, useSession } = authClient;