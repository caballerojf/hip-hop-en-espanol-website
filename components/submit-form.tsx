'use client'

import { useActionState, useEffect, useRef } from 'react'
import { submitTrack, type FormState } from '@/app/actions/submissions'

const inputClass =
  'w-full border border-input bg-transparent px-3 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground'
const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-widest'

export function SubmitForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitTrack, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.ok) formRef.current?.reset()
  }, [state])

  return (
    <form ref={formRef} action={action} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="artistName" className={labelClass}>
          Nombre artístico *
        </label>
        <input id="artistName" name="artistName" required maxLength={80} className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          Correo electrónico *
        </label>
        <input id="email" name="email" type="email" required maxLength={120} className={inputClass} />
      </div>
      <div>
        <label htmlFor="trackTitle" className={labelClass}>
          Nombre del tema *
        </label>
        <input id="trackTitle" name="trackTitle" required maxLength={120} className={inputClass} />
      </div>
      <div>
        <label htmlFor="city" className={labelClass}>
          Ciudad / País
        </label>
        <input id="city" name="city" maxLength={80} className={inputClass} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="trackUrl" className={labelClass}>
          Enlace (SoundCloud, YouTube, Spotify…) *
        </label>
        <input
          id="trackUrl"
          name="trackUrl"
          type="url"
          required
          maxLength={300}
          placeholder="https://"
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={labelClass}>
          Cuéntanos sobre el tema
        </label>
        <textarea id="message" name="message" rows={4} maxLength={600} className={inputClass} />
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background hover:bg-muted-foreground disabled:opacity-50"
        >
          {pending ? 'Enviando…' : 'Enviar mi música'}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {state?.message}
        </p>
      </div>
    </form>
  )
}
