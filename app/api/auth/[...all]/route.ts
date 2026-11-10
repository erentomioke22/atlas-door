// import { toNextJsHandler } from 'better-auth/next-js'
// import { getPayload } from '@/lib/payload'

// const payload = await getPayload()

// export const { POST, GET } = toNextJsHandler(payload.betterAuth)

// app/api/auth/[...all]/route.ts
import { toNextJsHandler } from 'better-auth/next-js'
import { getPayload } from '@/lib/payload'

// ✅ فراخوانی را در تابع قرار دهید تا فقط در زمان درخواست اجرا شود
async function getAuthHandler() {
  const payload = await getPayload()
  return toNextJsHandler(payload.betterAuth)
}

export async function POST(request: Request) {
  const { POST: handler } = await getAuthHandler()
  return handler(request)
}

export async function GET(request: Request) {
  const { GET: handler } = await getAuthHandler()
  return handler(request)
}