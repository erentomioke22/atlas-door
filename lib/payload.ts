import configPromise from '@payload-config'
import { getPayloadAuth } from 'payload-auth/better-auth'
import type { PayloadAuthConfig } from './auth'

export const getPayload = async () =>
  getPayloadAuth<PayloadAuthConfig>(configPromise)


type PayloadWithAuth = Awaited<ReturnType<typeof getPayload>>
export type Session = PayloadWithAuth['betterAuth']['$Infer']['Session']
export type User = Session['user']
