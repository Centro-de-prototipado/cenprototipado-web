import { cn } from "@/lib/utils"

import { DecorIcon } from "@/components/ui/decor-icon"
import { Button } from "@/components/ui/button"
import { HeroRobot } from "@/components/sections/hero-robot"
import { Logo } from "@/components/shared/logo"
import { ArrowRightIcon, PhoneCallIcon } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative border-b">
      <div className="relative flex flex-col items-center justify-center gap-5 px-12 py-12 md:px-16 md:py-20 lg:py-24">
        {/* Radial gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-1 size-full overflow-hidden"
        >
          <div
            className={cn(
              "absolute -inset-x-20 inset-y-0 z-0 rounded-full",
              "bg-[radial-gradient(ellipse_at_center,theme(--color-foreground/.1),transparent,transparent)]",
              "blur-[50px]"
            )}
          />
        </div>
        {/* <a
          className={cn(
            "group relative mx-auto flex w-fit items-center gap-3 rounded-sm border bg-card p-1 shadow",
            "animate-in transition-all delay-500 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in"
          )}
          href="#link"
        >
          <DecorIcon className="size-2" position="top-left" />
          <DecorIcon className="size-2" position="top-right" />
          <DecorIcon className="size-2" position="bottom-left" />
          <DecorIcon className="size-2" position="bottom-right" />
          <div className="rounded-xs border bg-card px-1.5 py-0.5 shadow-sm">
            <p className="font-mono text-xs">CENTRO</p>
          </div>

          <span className="text-xs">cuenta institucional UNAL</span>
          <span className="block h-5 border-l" />

          <div className="pr-1">
            <ArrowRightIcon className="size-3 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5" />
          </div>
        </a> */}

        <div
          className={cn(
            "animate-in delay-75 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in"
          )}
        >
          <Logo className="h-14 md:h-20 lg:h-36" />
        </div>

        <h1
          className={cn(
            "max-w-3xl text-center text-4xl font-bold text-balance text-foreground md:text-6xl lg:font-black",
            "animate-in delay-100 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in"
          )}
        >
          Innovación pedagógica y fortalecimiento empresarial
        </h1>

        <HeroRobot
          className={cn(
            "relative h-52.5 w-full max-w-105",
            "animate-in delay-150 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in",
            "md:h-65 md:max-w-130"
          )}
        />

        <p
          className={cn(
            "text-center text-sm tracking-wider text-muted-foreground sm:text-lg",
            "animate-in delay-200 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in"
          )}
        >
          Cuenta institucional UNAL. Espacio académico de innovación y
          desarrollo tecnológico, orientado al apoyo de procesos de creación y
          experimentación en el territorio.
        </p>

        <div className="flex w-fit animate-in items-center justify-center gap-3 pt-2 delay-300 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in">
          <Button variant="outline" size="lg">
            <PhoneCallIcon data-icon="inline-start" /> Conocer el proyecto
          </Button>
          <Button size="lg">
            Ver implementación <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
