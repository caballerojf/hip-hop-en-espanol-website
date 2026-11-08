'use client'

import { useActionState } from 'react'
import {
  hostSignIn,
  hostSignOut,
  reviewSubmission,
  type FormState,
} from '@/app/actions/submissions'
import type { Submission } from '@/lib/db/schema'

const inputClass =
  'w-full border border-input bg-transparent px-3 py-2.5 text-base focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground'

function SignIn() {
  const [state, action, pending] = useActionState<FormState, FormData>(hostSignIn, null)
  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="host-password" className="mb-2 block text-xs font-semibold uppercase tracking-widest">
          Contraseña del host
        </label>
        <input id="host-password" name="password" type="password" required className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="border border-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background disabled:opacity-50"
      >
        {pending ? 'Entrando…' : 'Entrar'}
      </button>
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
        {state && !state.ok ? state.message : ''}
      </p>
    </form>
  )
}

function ReviewCard({ submission }: { submission: Submission }) {
  const [state, action, pending] = useActionState<FormState, FormData>(reviewSubmission, null)
  return (
    <li className="border border-border p-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <a
          href={submission.trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold uppercase hover:underline"
        >
          {submission.trackTitle} — {submission.artistName}
        </a>
        <span className="text-xs text-muted-foreground">{submission.email}</span>
      </div>
      {submission.message ? (
        <p className="mb-4 text-sm text-muted-foreground">{submission.message}</p>
      ) : null}
      <form action={action} className="grid gap-3 sm:grid-cols-[6rem_1fr_auto] sm:items-end">
        <input type="hidden" name="id" value={submission.id} />
        <div>
          <label htmlFor={`grade-${submission.id}`} className="mb-1 block text-xs uppercase tracking-widest">
            Nota
          </label>
          <input
            id={`grade-${submission.id}`}
            name="grade"
            type="number"
            min={1}
            max={10}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`review-${submission.id}`} className="mb-1 block text-xs uppercase tracking-widest">
            Comentario
          </label>
          <input id={`review-${submission.id}`} name="review" required maxLength={1000} className={inputClass} />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="bg-foreground px-5 py-3 text-xs font-bold uppercase tracking-widest text-background disabled:opacity-50"
        >
          {pending ? 'Publicando…' : 'Publicar'}
        </button>
      </form>
      {state && !state.ok ? (
        <p role="alert" className="mt-2 text-sm">
          {state.message}
        </p>
      ) : null}
    </li>
  )
}

export function HostPanel({
  configured,
  signedIn,
  pending,
}: {
  configured: boolean
  signedIn: boolean
  pending: Submission[]
}) {
  return (
    <details className="border border-border">
      <summary className="cursor-pointer px-5 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground">
        Panel del host
      </summary>
      <div className="border-t border-border p-5">
        {!configured ? (
          <p className="text-sm text-muted-foreground">
            Configura la variable HOST_PASSWORD para habilitar el panel de reseñas.
          </p>
        ) : !signedIn ? (
          <SignIn />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">{pending.length} envíos pendientes</p>
              <form action={hostSignOut}>
                <button type="submit" className="text-xs uppercase tracking-widest underline">
                  Cerrar sesión
                </button>
              </form>
            </div>
            <ul className="flex flex-col gap-4">
              {pending.map((submission) => (
                <ReviewCard key={submission.id} submission={submission} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  )
}
