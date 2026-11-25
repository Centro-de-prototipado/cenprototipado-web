"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRightIcon, FolderKanbanIcon, MapIcon, SchoolIcon } from "lucide-react"
import { BotonCuenta } from "@cen/auth"
import { CENTRO_URL } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import { DecorIcon } from "@/components/ui/decor-icon"
import { ThemeToggle } from "@/components/theme-toggle"

// Misma estructura que el encabezado del Centro: columna max-w-6xl con bordes laterales,
// 64 px de alto, enlaces de 36 px en text-sm font-medium con ícono y cruces en las esquinas.
const enlace =
  "inline-flex h-9 items-center gap-1.5 px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"

export function SiteHeader() {
  const [conScroll, setConScroll] = useState(false)

  useEffect(() => {
    const alMover = () => setConScroll(window.scrollY > 10)
    alMover()
    window.addEventListener("scroll", alMover, { passive: true })
    return () => window.removeEventListener("scroll", alMover)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "mx-auto w-full max-w-6xl border-x border-b bg-background/60",
          conScroll && "border-border bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60"
        )}
      >
        <nav aria-label="Principal" className="relative flex h-16 w-full items-center justify-between gap-4 px-6 sm:px-12 md:px-16">
          <DecorIcon position="bottom-left" />
          <DecorIcon position="bottom-right" />

          <div className="flex items-center gap-5">
            <Link href="/" className="inline-flex h-14 flex-col justify-center px-1 leading-none hover:bg-muted dark:hover:bg-muted/50">
              <span className="text-lg font-extrabold tracking-wider uppercase">Red STEAM</span>
              <span className="mt-1 font-mono text-xs tracking-[0.35em] text-primary uppercase">Caldas</span>
            </Link>
            <div className="hidden items-center lg:flex">
              <Link href="/#mapa" className={enlace}>
                <MapIcon className="size-4" aria-hidden="true" />
                Mapa
              </Link>
              <Link href="/#aulas" className={enlace}>
                <SchoolIcon className="size-4" aria-hidden="true" />
                Aulas
              </Link>
              <Link href="/proyectos" className={enlace}>
                <FolderKanbanIcon className="size-4" aria-hidden="true" />
                Proyectos
              </Link>
              <a href={CENTRO_URL} className={cn(enlace, "bg-muted/60")}>
                Centro de Prototipado
                <ArrowUpRightIcon className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <BotonCuenta className="h-9 min-h-9 gap-1.5 px-3 text-sm font-medium" />
          </div>
        </nav>
      </div>
    </header>
  )
}
