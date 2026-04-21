import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

import { DecorIcon } from "@/components/ui/decor-icon"
import { buttonVariants } from "@/components/ui/button"
import {
  getPortfolioProjectBySlug,
  getPortfolioSlugs,
} from "@/lib/portfolio-data"
import { cn } from "@/lib/utils"
import { ArrowLeftIcon } from "lucide-react"

export async function generateStaticParams() {
  const slugs = await getPortfolioSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getPortfolioProjectBySlug(slug)
  if (!project) return {}
  return {
    title: `${project.title} | Portafolio`,
    description: project.summary,
  }
}

export default async function PortfolioProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getPortfolioProjectBySlug(slug)

  if (!project) notFound()

  return (
    <>
      <section className="relative border-b px-12 py-16 md:px-16 md:py-20">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />
        <Link
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-6 -ml-2 gap-1.5"
          )}
          href="/portafolio"
        >
          <ArrowLeftIcon className="size-4" />
          Portafolio
        </Link>
        <p className="inline-flex w-fit rounded-none border bg-card px-3 py-1 text-xs tracking-[0.24em] text-muted-foreground uppercase">
          {project.category} · {project.year}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black text-balance md:text-6xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          {project.summary}
        </p>
        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      <section className="relative border-b">
        <div className="relative h-72 overflow-hidden md:h-96">
          <Image
            alt={project.title}
            className="h-full w-full object-cover"
            src={project.image}
            width={1400}
            height={900}
            priority
          />
        </div>
      </section>

      <section className="relative border-b">
        <div className="grid gap-px md:grid-cols-2">
          <div className="border-b px-12 py-10 md:border-r md:border-b-0 md:px-16 md:py-12">
            <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
              Desafío
            </p>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              {project.challenge}
            </p>
          </div>
          <div className="px-12 py-10 md:px-16 md:py-12">
            <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
              Solución
            </p>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              {project.solution}
            </p>
          </div>
        </div>
      </section>

      <section className="relative border-b px-12 py-10 md:px-16 md:py-12">
        <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
          Stack tecnológico
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              className="border-2 border-border bg-background px-3 py-1 text-[11px] font-bold tracking-widest text-muted-foreground uppercase shadow-[2px_2px_0_0_var(--border)]"
              key={tech}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {project.outcomes.length > 0 && (
        <section className="relative border-b px-12 py-10 md:px-16 md:py-12">
          <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            Resultados
          </p>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {project.outcomes.map((outcome) => (
              <li
                className="border bg-card/60 px-4 py-3 text-sm text-muted-foreground"
                key={outcome}
              >
                {outcome}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
