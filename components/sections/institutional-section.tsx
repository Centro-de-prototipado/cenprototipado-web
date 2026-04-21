import Image from "next/image"
import Link from "next/link"

import { SectionCarousel } from "@/components/ui/section-carousel"
import { DecorIcon } from "@/components/ui/decor-icon"
import { buttonVariants } from "@/components/ui/button"
import { teamMembers } from "@/lib/institutional-data"
import { cn } from "@/lib/utils"
import { ArrowRightIcon } from "lucide-react"

const stemPoints = [
  "Uso de tecnologías emergentes en procesos educativos.",
  "Proyectos interdisciplinarios entre estudiantes, docentes e investigadores.",
  "Creación de prototipos y soluciones aplicadas a distintas áreas del conocimiento.",
  "Integración de metodologías STEM y STEAM en enseñanza y aprendizaje.",
]

export function InstitutionalSection() {
  return (
    <section className="relative w-full border-b" id="quienes-somos">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />

      {/* Quiénes somos */}
      <div className="border-b px-12 py-16 md:px-16 md:py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <p className="inline-flex w-fit rounded-none border bg-card px-3 py-1 text-xs tracking-[0.24em] text-muted-foreground uppercase">
            Quiénes somos
          </p>
          <h2 className="max-w-4xl text-3xl font-bold text-balance md:text-5xl lg:font-black">
            Un espacio para transformar ideas en prototipos reales con impacto
            educativo, social y tecnológico.
          </h2>
          <p className="max-w-4xl text-sm text-muted-foreground md:text-base">
            El Centro de Prototipado impulsa la innovación, el aprendizaje
            práctico y el desarrollo de soluciones tecnológicas. Aquí,
            estudiantes, docentes y comunidades convierten retos reales en
            prototipos funcionales mediante fabricación digital y tecnologías
            emergentes. También apoyamos los procesos educativos de las Aulas
            STEM de Manizales y Caldas, fortaleciendo el aprendizaje en ciencia,
            tecnología, ingeniería y matemáticas.
          </p>
          <p className="text-xs tracking-[0.2em] text-muted-foreground/70 uppercase">
            Dirección de Investigación y Extensión – DIMA · Centro de
            Prototipado · Sede Manizales
          </p>
        </div>
      </div>

      {/* Misión / Visión */}
      <div className="grid border-b md:grid-cols-2">
        <article className="border-b bg-card/30 p-6 md:border-r md:border-b-0 md:p-10">
          <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            Misión
          </p>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Democratizar el acceso a tecnologías de fabricación digital y
            promover la innovación mediante el aprendizaje práctico, la
            experimentación y la colaboración interdisciplinaria.
          </p>
        </article>
        <article className="bg-card/30 p-6 md:p-10">
          <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            Visión
          </p>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Ser un referente en innovación y fabricación digital, reconocido por
            impulsar proyectos tecnológicos y facilitar el acceso a herramientas
            y conocimientos para transformar ideas en soluciones con impacto
            educativo, social y empresarial.
          </p>
        </article>
      </div>

      {/* Equipo */}
      <div className="border-b p-6 md:p-10" id="equipo">
        <div className="mx-auto max-w-5xl">
          <SectionCarousel
            description="Equipo interdisciplinario que lidera procesos de innovación, formación y acompañamiento técnico en el Centro."
            title="Equipo de trabajo"
          >
            {teamMembers.map((member, index) => (
              <article
                className="min-w-64 snap-start overflow-hidden border bg-background shadow-[4px_4px_0_0_rgba(0,0,0,0.06)] md:min-w-72 dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.06)]"
                key={`${member.name}-${member.role}`}
              >
                <div
                  className="relative overflow-hidden bg-muted"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <Image
                    alt={member.name}
                    className="object-cover"
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 80vw, 288px"
                    src={member.portrait}
                  />
                </div>
                <div className="border-t p-4">
                  <p className="text-sm font-semibold">{member.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </article>
            ))}
          </SectionCarousel>
        </div>
      </div>

      {/* Articulación STEM */}
      <div className="border-b p-6 md:p-10" id="articulacion-stem">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
              Articulación
            </p>
            <h3 className="text-2xl font-bold text-balance md:text-3xl">
              Trabajo articulado con las Aulas STEM
            </h3>
            <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
              Las Aulas STEM y el Centro de Prototipado trabajan de manera
              articulada para fortalecer formación, investigación e innovación.
              Esta colaboración genera ecosistemas que conectan la educación, la
              tecnología y el desarrollo de soluciones para la sociedad.
            </p>
          </div>
          <ul className="grid gap-px border bg-border/40 sm:grid-cols-2">
            {stemPoints.map((point) => (
              <li
                key={point}
                className="bg-background px-5 py-4 text-sm text-muted-foreground"
              >
                <span className="mr-2 font-bold text-foreground">→</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTAs: portafolio + tecnologías */}
      <div className="grid border-b sm:grid-cols-2">
        <div className="relative border-b px-6 py-8 sm:border-r sm:border-b-0 md:px-10 md:py-10">
          <DecorIcon className="size-2" position="top-left" />
          <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            Proyectos
          </p>
          <p className="mt-1 text-sm font-medium md:text-base">
            Explora los proyectos desarrollados en el Centro.
          </p>
          <Link
            className={cn(buttonVariants({ size: "sm" }), "mt-4")}
            href="/portafolio"
          >
            Ver portafolio <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </div>
        <div className="relative px-6 py-8 md:px-10 md:py-10">
          <DecorIcon className="size-2" position="top-right" />
          <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
            Equipamiento
          </p>
          <p className="mt-1 text-sm font-medium md:text-base">
            Impresión 3D, corte láser, CNC, RV y más.
          </p>
          <Link
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "mt-4"
            )}
            href="/tecnologias"
          >
            Ver tecnologías <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </div>
      </div>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
