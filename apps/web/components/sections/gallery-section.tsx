import Image from "next/image"
import { DecorIcon } from "@/components/ui/decor-icon"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"

const photos = [
  { src: "/impresoras.jpeg",  alt: "Granja de impresoras 3D FDM",             caption: "Granja de impresoras 3D FDM",              tag: "Fabricación" },
  { src: "/brazo.jpeg",       alt: "Brazo robótico para soldadura",            caption: "Brazo robótico para soldadura",             tag: "Robótica" },
  { src: "/exposición.jpeg",  alt: "Exposición de proyectos",                 caption: "Exposición de proyectos",                  tag: "Comunidad" },
  { src: "/reunion.jpeg",     alt: "Sesiones de codiseño con docentes",       caption: "Sesiones de codiseño con docentes",        tag: "STEM" },
  { src: "/taller.jpg",       alt: "Talleres abiertos en el Centro",          caption: "Talleres abiertos",                        tag: "Formación" },
]

export function GallerySection() {
  return (
    <section className="relative w-full border-b" id="galeria">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />

      {/* Header */}
      <Reveal as="div" className="px-8 py-14 lg:px-16 lg:py-16">
        <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
          Galería
        </span>
        <h2 className="mt-3.5 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-[-0.015em] text-balance text-foreground md:text-5xl">
          El Centro por dentro.
        </h2>
        <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Una mirada al laboratorio donde estudiantes, docentes y comunidades
          aterrizan proyectos reales.
        </p>
      </Reveal>

      {/* Bento grid */}
      <div className="gallery-bento border-t">
        {photos.map((photo, i) => (
          <BentoCell key={photo.src} photo={photo} isLead={i === 0} index={i} />
        ))}
      </div>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}

function BentoCell({
  photo,
  isLead,
  index,
}: {
  photo: (typeof photos)[number]
  isLead: boolean
  index: number
}) {
  // cols: lead(0)=col1 rowspan2, 1=col2 row1, 2=col3 row1, 3=col2 row2, 4=col3 row2
  const isLastCol = index === 2 || index === 4
  const isLastRow = index >= 3

  return (
    <Reveal
      as="figure"
      index={index}
      className={cn(
        "group relative m-0 overflow-hidden bg-black",
        isLead && "gallery-bento-lead",
        !isLastCol && "border-r border-border",
        !isLastRow && !isLead && "border-b border-border"
      )}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes={isLead ? "(max-width: 820px) 100vw, 50vw" : "(max-width: 820px) 50vw, 25vw"}
      />
      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 55%)" }}
      />
      <figcaption className="absolute bottom-3.5 left-4 right-4 z-1 flex flex-col gap-1 text-white pointer-events-none">
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: "#3dbbd4" }}>
          {photo.tag}
        </span>
        <span className="text-sm font-bold leading-tight">{photo.caption}</span>
      </figcaption>
    </Reveal>
  )
}
