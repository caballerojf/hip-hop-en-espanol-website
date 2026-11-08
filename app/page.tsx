import { EpisodesSection } from '@/components/episodes-section'
import { HostPanel } from '@/components/host-panel'
import { LiveStream } from '@/components/live-stream'
import { ReviewsSection } from '@/components/reviews-section'
import { SiteHeader } from '@/components/site-header'
import { SubmitForm } from '@/components/submit-form'
import { isHost, isHostConfigured } from '@/lib/host-session'
import { getEpisodes, getPendingSubmissions, getReviewedSubmissions } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const signedIn = await isHost()
  const [episodes, reviews, pending] = await Promise.all([
    getEpisodes(),
    getReviewedSubmissions(),
    signedIn ? getPendingSubmissions() : Promise.resolve([]),
  ])

  return (
    <>
      <SiteHeader />
      <main>
        <LiveStream />
        <EpisodesSection episodes={episodes} />

        <section id="envia" aria-labelledby="submit-title" className="border-b border-border bg-foreground text-background">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1fr_1.5fr]">
            <div>
              <h2 id="submit-title" className="font-display text-5xl uppercase leading-none md:text-7xl">
                Envía tu música
              </h2>
              <p className="mt-4 text-pretty leading-relaxed opacity-70">
                ¿Rapeas en español? Mándanos tu tema. Cada semana escuchamos los envíos en vivo, los
                comentamos y les damos una nota del 1 al 10.
              </p>
            </div>
            <div className="dark-form [--background:oklch(1_0_0)] [--foreground:oklch(0_0_0)] [--input:oklch(0_0_0/35%)] [--muted-foreground:oklch(0.4_0_0)]">
              <SubmitForm />
            </div>
          </div>
        </section>

        <ReviewsSection reviews={reviews} />

        <div className="mx-auto max-w-6xl px-4 py-10">
          <HostPanel configured={isHostConfigured()} signedIn={signedIn} pending={pending} />
        </div>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-xs uppercase tracking-widest text-muted-foreground sm:flex-row sm:justify-between">
          <p className="font-display text-base normal-case tracking-normal text-foreground">Hip Hop en Español</p>
          <p>Nuevo episodio cada sábado</p>
        </div>
      </footer>
    </>
  )
}
