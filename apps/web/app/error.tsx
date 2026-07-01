"use client"

import Link from "next/link"

import { Logo } from "@/components/shared/logo"
import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { Reveal } from "@/components/ui/reveal"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// No usa Header/Footer: ambos dependen de datos de Notion, y si la falla que
// activó este boundary viene justo de Notion, renderizarlos volvería a
// lanzar el mismo error.
export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto w-full max-w-6xl border-x bg-background/60">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 py-20 text-center lg:px-16">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-40">
            <GridPattern className="size-full stroke-foreground/8" height={40} width={40} x={0} />
          </div>
          <div
            className="absolute top-1/4 left-1/2 h-3/5 w-1/2 -translate-x-1/2 opacity-15 blur-[70px]"
            style={{ background: "radial-gradient(ellipse, var(--color-cyan-400), transparent 65%)" }}
          />
        </div>

        <div className="relative z-1 flex flex-col items-center">
          <Link href="/" className="mb-6 w-fit">
            <Logo className="h-7" />
          </Link>
          <Reveal
            as="span"
            immediate
            index={0}
            className="inline-flex w-fit border bg-card px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase"
          >
            Error inesperado
          </Reveal>
          <Reveal
            as="h1"
            immediate
            index={1}
            className="mt-6 text-2xl font-extrabold tracking-[-0.02em] text-foreground lg:text-3xl"
          >
            Algo salió mal.
          </Reveal>
          <Reveal
            as="p"
            immediate
            index={2}
            className="mt-3 max-w-[46ch] text-base leading-relaxed text-muted-foreground"
          >
            No pudimos cargar esta página. Intenta de nuevo o vuelve al inicio para
            seguir explorando el Centro de Prototipado.
          </Reveal>
          <Reveal immediate index={3} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => reset()} size="lg">
              Intentar de nuevo
            </Button>
            <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              Volver al inicio
            </Link>
          </Reveal>
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>
    </main>
  )
}
