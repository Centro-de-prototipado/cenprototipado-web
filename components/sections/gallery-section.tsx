"use client"

import { useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

import { DecorIcon } from "@/components/ui/decor-icon"
import { cn } from "@/lib/utils"
import Image from "next/image"

type GallerySlide = {
  src: string
  alt: string
  caption: string
}

const slides: GallerySlide[] = [
  {
    src: "/brazo.jpeg",
    alt: "Brazo robotico en laboratorio de prototipado",
    caption: "Automatizacion y manufactura en entornos de innovacion",
  },
  {
    src: "/exposición.jpeg",
    alt: "Presentacion de experiencias de realidad mixta",
    caption: "Experiencias inmersivas para aprender y crear",
  },
  {
    src: "/impresoras.jpeg",
    alt: "Area de impresion 3D del Centro",
    caption: "Impresion 3D para transformar ideas en piezas reales",
  },
  {
    src: "/reunion.jpeg",
    alt: "Sesion de trabajo colaborativo en el laboratorio",
    caption: "Trabajo interdisciplinario orientado a proyectos",
  },
  {
    src: "/taller.jpg",
    alt: "Taller de co-creacion en el Centro de Prototipado",
    caption: "Formacion practica para explorar, experimentar y crear",
  },
]

export function GallerySection() {
  const autoplay = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  )

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [autoplay.current]
  )

  return (
    <section className="relative w-full border-b">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />

      <div className="border-b px-12 py-16 md:px-16 md:py-20">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <h2 className="text-3xl font-bold text-balance md:text-5xl lg:font-black">
            Asi se vive el Centro de Prototipado
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Un espacio abierto para explorar, aprender y crear con tecnologias
            como impresion 3D, corte laser, CNC, escaneo 3D, realidad virtual,
            microcontroladores y robotica educativa.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden p-4 md:p-6">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-4 flex">
            {slides.map((slide) => (
              <div
                className="min-w-0 shrink-0 grow-0 basis-full pl-4 md:basis-1/2"
                key={slide.src}
              >
                <figure className="group relative overflow-hidden rounded-lg border bg-card">
                  <Image
                    alt={slide.alt}
                    className={cn(
                      "h-65 w-full object-cover transition duration-700 ease-out",
                      "group-hover:scale-[1.02] md:h-80"
                    )}
                    loading="lazy"
                    src={slide.src}
                    width={1600}
                    height={1067}
                  />
                  <figcaption className="absolute right-3 bottom-3 left-3 rounded-md border border-white/20 bg-black/45 px-3 py-2 text-xs text-white backdrop-blur-sm md:text-sm">
                    {slide.caption}
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
