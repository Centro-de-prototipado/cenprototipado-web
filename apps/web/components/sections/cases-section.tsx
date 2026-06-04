import Image from "next/image"
import Link from "next/link"

import { DecorIcon } from "@/components/ui/decor-icon"
import { Reveal } from "@/components/ui/reveal"
import { buttonVariants } from "@/components/ui/button"
import { getPortfolioProjects } from "@/lib/portfolio-data"
import type { PortfolioProjectMeta } from "@/lib/portfolio-types"
import { cn } from "@/lib/utils"
import { ArrowRightIcon } from "lucide-react"

import { CasesCarousel } from "@/components/sections/cases-carousel"

export async function CasesSection() {
  const projects = await getPortfolioProjects()

  return (
    <section className="relative w-full border-b" id="proyectos">
      <div className="relative px-12 py-16 md:px-16 md:py-20">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <Reveal
          as="div"
          className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="space-y-3">
            <p className="inline-flex w-fit items-center rounded-none border bg-card px-3 py-1 text-xs tracking-[0.24em] text-muted-foreground uppercase">
              Portafolio
            </p>
            <h2 className="max-w-2xl text-3xl font-bold text-balance md:text-5xl lg:font-black">
              Proyectos que ya cambiaron la forma de aprender y crear.
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Realidad aumentada, gemelos digitales, realidad virtual, BIM,
              robótica y más — desarrollados desde el Centro de Prototipado.
            </p>
          </div>
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "shrink-0 self-start md:self-auto"
            )}
            href="/portafolio"
          >
            Ver portafolio completo <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Reveal>
      </div>

      <div className="border-t">
        <CasesCarousel projects={projects} />
      </div>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
