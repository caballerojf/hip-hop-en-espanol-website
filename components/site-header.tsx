const links = [
  { href: '#en-vivo', label: 'En vivo' },
  { href: '#episodios', label: 'Episodios' },
  { href: '#envia', label: 'Envía tu música' },
  { href: '#veredictos', label: 'Veredictos' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href="#en-vivo" className="font-display text-xl uppercase tracking-wide">
          HHE<span className="sr-only"> — Hip Hop en Español</span>
        </a>
        <nav aria-label="Principal">
          <ul className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest md:gap-8">
            {links.map((link, i) => (
              <li key={link.href} className={i === 0 || i === 2 ? '' : 'hidden sm:block'}>
                <a href={link.href} className="hover:underline underline-offset-4">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
