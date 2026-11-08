import Image from 'next/image'
import { Radio } from 'lucide-react'

export function LiveStream() {
  const embedUrl = process.env.NEXT_PUBLIC_STREAM_EMBED_URL
  const isLive = Boolean(embedUrl)

  return (
    <section id="en-vivo" aria-labelledby="hero-title" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 md:pt-16">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Podcast semanal · Sábados 20:00 CET
        </p>
        <h1
          id="hero-title"
          className="font-display text-6xl uppercase leading-[0.9] text-balance sm:text-8xl md:text-[9rem]"
        >
          Hip Hop en Español
        </h1>

        <div className="mt-8 border border-foreground">
          <div className="flex items-center justify-between border-b border-foreground px-4 py-2 text-xs font-semibold uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`size-2.5 rounded-full bg-foreground ${isLive ? 'animate-pulse' : 'opacity-40'}`}
              />
              {isLive ? 'En vivo ahora' : 'Fuera del aire'}
            </span>
            <span className="text-muted-foreground">Transmisión</span>
          </div>

          <div className="relative aspect-video w-full bg-card">
            {isLive ? (
              <iframe
                src={embedUrl}
                title="Transmisión en vivo de Hip Hop en Español"
                className="absolute inset-0 size-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <>
                <Image
                  src="/images/stream-poster.png"
                  alt="Estudio del podcast con micrófonos y tornamesas en blanco y negro"
                  fill
                  priority
                  sizes="(min-width: 1152px) 1152px, 100vw"
                  className="object-cover opacity-60 grayscale"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <Radio className="size-10" aria-hidden="true" />
                  <p className="font-display text-3xl uppercase sm:text-5xl">Próxima transmisión</p>
                  <p className="max-w-md text-sm text-muted-foreground sm:text-base">
                    Volvemos en vivo este sábado a las 20:00. Mientras tanto, escucha los episodios
                    anteriores o envíanos tu música.
                  </p>
                  <a
                    href="#envia"
                    className="mt-2 bg-foreground px-5 py-3 text-xs font-bold uppercase tracking-widest text-background hover:bg-muted-foreground"
                  >
                    Envía tu tema
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
