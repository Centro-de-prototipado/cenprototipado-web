import Image from "next/image"

import { SectionCarousel } from "@/components/ui/section-carousel"
import { DecorIcon } from "@/components/ui/decor-icon"
import {
  availableTechnologies,
  successCases,
  technologySpotlights,
  teamMembers,
} from "@/lib/institutional-data"

export function InstitutionalSection() {
  return (
    <section className="relative w-full border-b" id="quienes-somos">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />

      <div className="border-b px-12 py-16 md:px-16 md:py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <p className="inline-flex w-fit rounded-none-none border bg-card px-3 py-1 text-xs tracking-wide text-muted-foreground uppercase">
            Quienes somos
          </p>
          <h2 className="max-w-4xl text-3xl font-bold text-balance md:text-5xl lg:font-black">
            Un espacio para transformar ideas en prototipos reales con impacto
            educativo, social y tecnologico.
          </h2>
          <p className="max-w-4xl text-sm text-muted-foreground md:text-base">
            El Centro de Prototipado impulsa la innovacion, el aprendizaje
            practico y el desarrollo de soluciones tecnologicas. Aqui,
            estudiantes, docentes y comunidades convierten retos reales en
            prototipos funcionales mediante fabricacion digital y tecnologias
            emergentes. Tambien apoyamos los procesos educativos de las Aulas
            STEM de Manizales y Caldas, fortaleciendo el aprendizaje en ciencia,
            tecnologia, ingenieria y matematicas.
          </p>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            Direccion de Investigacion y Extension - DIMA · Centro de
            Prototipado · Sede Manizales
          </p>
        </div>
      </div>

      <div className="grid border-b md:grid-cols-2">
        <article className="border-b p-6 md:border-r md:border-b-0 md:p-10">
          <h3 className="text-2xl font-semibold md:text-3xl">Mision</h3>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Democratizar el acceso a tecnologias de fabricacion digital y
            promover la innovacion mediante el aprendizaje practico, la
            experimentacion y la colaboracion interdisciplinaria.
          </p>
        </article>
        <article className="p-6 md:p-10">
          <h3 className="text-2xl font-semibold md:text-3xl">Vision</h3>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Ser un referente en innovacion y fabricacion digital, reconocido por
            impulsar proyectos tecnologicos y facilitar el acceso a herramientas
            y conocimientos para transformar ideas en soluciones con impacto
            educativo, social y empresarial.
          </p>
        </article>
      </div>

      <div className="border-b p-6 md:p-10" id="equipo">
        <div className="mx-auto max-w-5xl">
          <SectionCarousel
            description="Equipo interdisciplinario que lidera procesos de innovacion, formacion y acompanamiento tecnico en el Centro."
            title="Equipo de trabajo"
          >
            {teamMembers.map((member, index) => (
              <article
                className="min-w-72 snap-start overflow-hidden border bg-background md:min-w-80"
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
                    sizes="(max-width: 768px) 80vw, 320px"
                    src={member.portrait}
                  />
                </div>
                <div className="border-t p-4">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </article>
            ))}
          </SectionCarousel>
        </div>
      </div>

      <div className="border-b p-6 md:p-10" id="articulacion-stem">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <h3 className="text-2xl font-semibold text-balance md:text-3xl">
            Articulacion con las Aulas STEM
          </h3>
          <p className="max-w-4xl text-sm text-muted-foreground md:text-base">
            Las Aulas STEM y el Centro de Prototipado trabajan de manera
            articulada con espacios academicos y tecnologicos para fortalecer
            formacion, investigacion e innovacion.
          </p>

          <ul className="grid gap-3 pl-5 text-sm text-muted-foreground md:grid-cols-2 md:text-base">
            <li className="list-disc">
              Uso de tecnologias emergentes en procesos educativos.
            </li>
            <li className="list-disc">
              Proyectos interdisciplinarios entre estudiantes, docentes e
              investigadores.
            </li>
            <li className="list-disc">
              Creacion de prototipos y soluciones aplicadas a distintas areas
              del conocimiento.
            </li>
            <li className="list-disc">
              Integracion de metodologias STEM y STEAM en ensenanza y
              aprendizaje.
            </li>
          </ul>
        </div>
      </div>

      <div className="border-b p-6 md:p-10" id="casos-exito">
        <div className="mx-auto max-w-5xl">
          <SectionCarousel
            description="Proyectos desarrollados en realidad aumentada, realidad virtual, gemelos digitales, BIM, analitica y experiencias inmersivas."
            title="Proyectos desarrollados"
          >
            {successCases.map((caseItem) => (
              <article
                className="min-w-44 snap-start border bg-card p-5 md:min-w-52"
                key={caseItem.title}
              >
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  Proyecto
                </p>
                <h4 className="mt-2 text-xl font-semibold text-balance">
                  {caseItem.title}
                </h4>
                <p className="mt-3 text-sm text-muted-foreground">
                  {caseItem.description}
                </p>
              </article>
            ))}
          </SectionCarousel>
        </div>
      </div>

      <div className="p-6 md:p-10" id="tecnologias">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <SectionCarousel
            description="Contamos con herramientas para diseno, ingenieria, innovacion y educacion orientadas a construir, probar y escalar soluciones."
            title="Tecnologias del Centro de Prototipado"
          >
            {availableTechnologies.map((technology) => (
              <div
                className="min-w-44 snap-start border bg-card p-4 text-sm font-medium tracking-wide uppercase md:min-w-52"
                key={technology}
              >
                <p className="text-[11px] text-muted-foreground">Equipo</p>
                <p className="mt-2 text-base tracking-normal normal-case">
                  {technology}
                </p>
                <div className="mt-4 grid grid-cols-4 gap-1">
                  <span className="col-span-3 h-1 bg-foreground/20" />
                  <span className="h-1 bg-foreground/50" />
                  <span className="h-1 bg-foreground/20" />
                  <span className="col-span-4 h-1 bg-foreground/10" />
                </div>
              </div>
            ))}
          </SectionCarousel>

          <SectionCarousel title="Capacidades destacadas">
            {technologySpotlights.map((technology) => (
              <article
                className="min-w-[20rem] snap-start border bg-background p-5 md:min-w-[24rem]"
                key={technology.title}
              >
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  {technology.subtitle}
                </p>
                <h4 className="mt-2 text-lg font-semibold text-balance">
                  {technology.title}
                </h4>
                <p className="mt-3 text-sm text-muted-foreground">
                  {technology.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {technology.applications.map((application) => (
                    <li
                      className="border px-2 py-1"
                      key={`${technology.title}-${application}`}
                    >
                      {application}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </SectionCarousel>
        </div>
      </div>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
