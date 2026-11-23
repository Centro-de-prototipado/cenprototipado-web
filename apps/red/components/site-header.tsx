import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { CENTRO_URL } from "@/lib/site-config"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span aria-hidden="true" className="grid size-8 place-items-center bg-primary text-primary-foreground">
            R
          </span>
          <span className="leading-tight">
            Red STEAM <span className="block font-mono text-[11px] font-normal tracking-widest text-muted-foreground">CALDAS</span>
          </span>
        </Link>
        <nav aria-label="Principal" className="ml-auto flex items-center gap-1 text-sm">
          <Link href="/#mapa" className="hidden px-3 py-2 hover:bg-accent sm:inline-block">
            Mapa
          </Link>
          <Link href="/#aulas" className="hidden px-3 py-2 hover:bg-accent sm:inline-block">
            Aulas
          </Link>
          <a href={CENTRO_URL} className="inline-flex min-h-10 items-center gap-1 border px-3 font-medium hover:bg-accent">
            Centro de Prototipado <ArrowUpRightIcon className="size-4" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  )
}
