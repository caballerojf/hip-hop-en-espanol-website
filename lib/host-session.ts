import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const HOST_COOKIE = 'hhe_host'

function expectedToken() {
  const password = process.env.HOST_PASSWORD
  if (!password) return null
  return createHmac('sha256', password).update('hip-hop-en-espanol-host').digest('hex')
}

export function isHostConfigured() {
  return Boolean(process.env.HOST_PASSWORD)
}

export function checkHostPassword(input: string) {
  const password = process.env.HOST_PASSWORD
  if (!password) return false
  const a = Buffer.from(input)
  const b = Buffer.from(password)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function hostToken() {
  return expectedToken()
}

export async function isHost() {
  const expected = expectedToken()
  if (!expected) return false
  const value = (await cookies()).get(HOST_COOKIE)?.value
  if (!value || value.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected))
}
