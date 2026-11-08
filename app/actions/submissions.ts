'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { submissions } from '@/lib/db/schema'
import { HOST_COOKIE, checkHostPassword, hostToken, isHost } from '@/lib/host-session'

export type FormState = { ok: boolean; message: string } | null

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function field(formData: FormData, name: string, max: number) {
  const value = formData.get(name)
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

export async function submitTrack(_prev: FormState, formData: FormData): Promise<FormState> {
  const artistName = field(formData, 'artistName', 80)
  const email = field(formData, 'email', 120)
  const trackTitle = field(formData, 'trackTitle', 120)
  const trackUrl = field(formData, 'trackUrl', 300)
  const city = field(formData, 'city', 80)
  const message = field(formData, 'message', 600)

  if (!artistName || !email || !trackTitle || !trackUrl) {
    return { ok: false, message: 'Completa los campos obligatorios.' }
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: 'El correo electrónico no es válido.' }
  }
  let url: URL
  try {
    url = new URL(trackUrl)
  } catch {
    return { ok: false, message: 'El enlace de la canción no es válido.' }
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return { ok: false, message: 'El enlace debe empezar con http(s)://' }
  }

  await db.insert(submissions).values({
    artistName,
    email,
    trackTitle,
    trackUrl: url.toString(),
    city: city || null,
    message: message || null,
  })

  revalidatePath('/')
  return { ok: true, message: '¡Recibido! Escucharemos tu tema en uno de los próximos episodios.' }
}

export async function hostSignIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = field(formData, 'password', 200)
  if (!checkHostPassword(password)) {
    return { ok: false, message: 'Contraseña incorrecta.' }
  }
  const token = hostToken()
  if (!token) return { ok: false, message: 'El panel del host no está configurado.' }

  ;(await cookies()).set(HOST_COOKIE, token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  revalidatePath('/')
  return { ok: true, message: 'Sesión iniciada.' }
}

export async function hostSignOut() {
  ;(await cookies()).delete(HOST_COOKIE)
  revalidatePath('/')
}

export async function reviewSubmission(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await isHost())) return { ok: false, message: 'No autorizado.' }

  const id = Number(formData.get('id'))
  const grade = Number(formData.get('grade'))
  const review = field(formData, 'review', 1000)

  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: 'Envío inválido.' }
  if (!Number.isInteger(grade) || grade < 1 || grade > 10) {
    return { ok: false, message: 'La nota debe ser un número del 1 al 10.' }
  }
  if (!review) return { ok: false, message: 'Escribe un comentario.' }

  await db
    .update(submissions)
    .set({ grade, review, status: 'reviewed', reviewedAt: new Date() })
    .where(and(eq(submissions.id, id), eq(submissions.status, 'pending')))

  revalidatePath('/')
  return { ok: true, message: 'Reseña publicada.' }
}
