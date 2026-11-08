import { ArrowUpRight } from 'lucide-react'

type Review = {
  id: number
  artistName: string
  trackTitle: string
  trackUrl: string
  city: string | null
  grade: number | null
  review: string | null
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section id="veredictos" aria-labelledby="reviews-title" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 id="reviews-title" className="mb-2 font-display text-5xl uppercase md:text-7xl">
          Veredictos
        </h2>
        <p className="mb-10 max-w-xl text-muted-foreground">
          Los temas que nos enviaron, comentados y calificados en el show.
        </p>

        {reviews.length === 0 ? (
          <p className="text-muted-foreground">Aún no hay reseñas publicadas.</p>
        ) : (
          <ul className="grid gap-px bg-border md:grid-cols-2">
            {reviews.map((item) => (
              <li key={item.id} className="flex gap-6 bg-background p-6">
                <div className="flex size-20 shrink-0 flex-col items-center justify-center border border-foreground">
                  <span className="font-display text-4xl leading-none">{item.grade}</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">/ 10</span>
                  <span className="sr-only">Nota: {item.grade} de 10</span>
                </div>
                <div className="min-w-0 flex-1">
                  <a
                    href={item.trackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-lg font-bold uppercase hover:underline"
                  >
                    {item.trackTitle}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                    <span className="sr-only">(abre en una nueva pestaña)</span>
                  </a>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {item.artistName}
                    {item.city ? ` · ${item.city}` : ''}
                  </p>
                  <p className="mt-3 text-pretty text-sm leading-relaxed">{item.review}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
