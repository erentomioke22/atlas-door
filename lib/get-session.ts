import 'server-only'

import { headers } from 'next/headers'
import { cache } from 'react'
import { getPayload } from '@/lib/payload'

export const getServerSession = cache(async () => {
  const payload = await getPayload()

  return payload.betterAuth.api.getSession({
    headers: await headers(),
  })
})

export type ServerSession = Awaited<ReturnType<typeof getServerSession>>;