import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { DecorIcon } from "@/components/ui/decor-icon"
import {
  getPortfolioProjectBySlug,
  getPortfolioSlugs,
} from "@/lib/portfolio-data"

type PortfolioProjectPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getPortfolioSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function PortfolioProjectPage({
  params,
}: PortfolioProjectPageProps) {
  const { slug } = await params
  const project = await getPortfolioProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute inset-y-0 left-1/2 hidden w-full max-w-6xl -translate-x-1/2 md:block">
          <div className="absolute inset-y-0 -left-4 w-px bg-border/80" />
          <div className="absolute inset-y-0 -left-8 w-px bg-border/40" />
          <div className="absolute inset-y-0 -right-4 w-px bg-border/80" />
          <div className="absolute inset-y-0 -right-8 w-px bg-border/40" />
        </div>
      </div>

      <div className="mx-auto">
        <Header />

        <main className="relative mx-auto w-full max-w-6xl bg-background/50">
          <div className="relative z-10 border-x min-h-screen">
            <section className="relative border-b px-12 py-12 md:px-16 md:py-16">
            <DecorIcon className="size-3" position="top-left" />
            <DecorIcon className="size-3" position="top-right" />

            <div className="mx-auto flex max-w-5xl flex-col gap-5">
              <Link
                className="text-sm text-primary hover:underline"
                href="/portafolio"
              >
                Volver al portafolio
              </Link>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-none-none border bg-card px-3 py-1">
                  ID {project.id}
                </span>
                <span className="rounded-none-none border bg-card px-3 py-1">
                  {project.category}
                </span>
                <span className="rounded-none-none border bg-card px-3 py-1">
                  {project.year}
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-bold text-balance md:text-6xl lg:font-black">
                {project.title}
              </h1>

              <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
                {project.summary}
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {project.techStack.map((item) => (
                  <span
                    className="rounded-none-none border bg-background px-3 py-1"
                    key={`${project.slug}-chip-${item}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <DecorIcon className="size-3" position="bottom-left" />
            <DecorIcon className="size-3" position="bottom-right" />
          </section>

          <section className="border-b p-4 md:p-6">
            <div className="relative overflow-hidden rounded-none-none border">
              <Image
                alt={project.title}
                className="h-64 w-full object-cover md:h-112"
                src={project.image}
                width={1600}
                height={1000}
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" />
            </div>
          </section>

          <section className="grid border-b md:grid-cols-2">
            <div className="border-b p-6 md:border-r md:border-b-0 md:p-8">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Reto
              </p>
              <p className="mt-2 text-sm md:text-base">{project.challenge}</p>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Solucion
              </p>
              <p className="mt-2 text-sm md:text-base">{project.solution}</p>
            </div>
          </section>

          <section className="grid border-b md:grid-cols-2">
            <div className="border-b p-6 md:border-r md:border-b-0 md:p-8">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Tecnologias
              </p>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground">
                {project.techStack.map((item) => (
                  <li key={`${project.slug}-${item}`}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Resultados
              </p>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground">
                {project.outcomes.map((item) => (
                  <li key={`${project.slug}-${item}`}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="p-6 md:p-8">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-semibold md:text-3xl">
                Detalle en Markdown
              </h2>
            </div>

            <article className="prose prose-sm prose-headings:font-semibold prose-headings:text-foreground prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-strong:text-foreground prose-code:text-foreground prose-li:my-1 md:prose-base max-w-none pt-6 text-muted-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.content}
              </ReactMarkdown>
            </article>
          </section>
        </div>
        </main>

        <div className="mt-20">
          <Footer />
        </div>
      </div>
    </>
  )
}
