import { Plus } from 'lucide-react'
import type { EpisodeWithTracks } from '@/lib/queries'

function formatDate(value: string) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function EpisodesSection({ episodes }: { episodes: EpisodeWithTracks[] }) {
  return (
    <section id="episodios" aria-labelledby="episodes-title" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 id="episodes-title" className="font-display text-5xl uppercase md:text-7xl">
            Episodios
          </h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {episodes.length} shows
          </p>
        </div>

        {episodes.length === 0 ? (
          <p className="text-muted-foreground">Todavía no hay episodios publicados.</p>
        ) : (
          <ol className="border-t border-foreground">
            {episodes.map((episode, index) => (
              <li key={episode.id} className="border-b border-foreground">
                <details className="group" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-start gap-4 py-6 [&::-webkit-details-marker]:hidden">
                    <span className="font-display text-4xl leading-none tabular-nums md:text-6xl">
                      {String(episode.number).padStart(2, '0')}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-xl font-bold uppercase md:text-2xl">{episode.title}</span>
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        {formatDate(episode.airedAt)} · {episode.durationMinutes} min ·{' '}
                        {episode.tracks.length} temas
                      </span>
                    </span>
                    <Plus
                      className="mt-1 size-6 shrink-0 transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    />
                  </summary>

                  <div className="grid gap-8 pb-8 md:grid-cols-[1fr_1.4fr] md:pl-20">
                    <p className="text-pretty leading-relaxed text-muted-foreground">{episode.description}</p>
                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest">Tracklist</h3>
                      <ol className="divide-y divide-border border-y border-border">
                        {episode.tracks.map((track) => (
                          <li key={track.id} className="flex items-baseline gap-4 py-2.5 text-sm">
                            <span className="w-6 tabular-nums text-muted-foreground">
                              {String(track.position).padStart(2, '0')}
                            </span>
                            <span className="flex-1 font-semibold">{track.title}</span>
                            <span className="text-right text-muted-foreground">{track.artist}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
