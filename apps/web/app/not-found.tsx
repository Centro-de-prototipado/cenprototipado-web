import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { Reveal } from "@/components/ui/reveal"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl border-x bg-background/60">
        <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-8 py-20 text-center lg:px-16">
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
            <Reveal
              as="span"
              immediate
              index={0}
              className="inline-flex w-fit border bg-card px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase"
            >
              Error 404
            </Reveal>
            <Reveal
              as="p"
              immediate
              index={1}
              className="mt-6 font-extrabold leading-none tracking-[-0.04em] text-foreground"
              style={{ fontSize: "clamp(72px, 18vw, 200px)" }}
            >
              4<span className="text-primary">0</span>4
            </Reveal>
            <Reveal
              as="h1"
              immediate
              index={2}
              className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-foreground lg:text-3xl"
            >
              Página no encontrada
            </Reveal>
            <Reveal
              as="p"
              immediate
              index={3}
              className="mt-3 max-w-[46ch] text-base leading-relaxed text-muted-foreground"
            >
              La página que buscas no existe o fue movida. Revisa la dirección o vuelve al inicio
              para seguir explorando el Centro de Prototipado.
            </Reveal>
            <Reveal immediate index={4} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/" className={cn(buttonVariants({ variant: "iso", size: "iso" }))}>
                <ArrowLeftIcon data-icon="inline-start" /> Volver al inicio
              </Link>
              <Link
                href="/portafolio"
                className={cn(buttonVariants({ variant: "iso-outline", size: "iso" }))}
              >
                Ver portafolio <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Reveal>
          </div>

          <DecorIcon className="size-3" position="bottom-left" />
          <DecorIcon className="size-3" position="bottom-right" />
        </section>
      </main>
      <Footer />
    </>
  )
}
