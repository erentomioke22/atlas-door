// import { auth } from "@/lib/auth";
// import { toNextJsHandler } from "better-auth/next-js";

// export const { POST, GET } = toNextJsHandler(auth);

import { toNextJsHandler } from 'better-auth/next-js'
import { getPayload } from '@/lib/payload'

const payload = await getPayload()

export const { POST, GET } = toNextJsHandler(payload.betterAuth)