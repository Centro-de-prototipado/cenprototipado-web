"use client"

import { useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import useEmblaCarousel from "embla-carousel-react"

import { InstagramEmbed } from "react-social-media-embed"

import { DecorIcon } from "@/components/ui/decor-icon"

type InstagramItem = {
  url: string
}

const instagramItems: InstagramItem[] = [
  {
    url: "https://www.instagram.com/reel/DWEfNzdEcGD/?",
  },
  {
    url: "https://www.instagram.com/p/DVjTTNACfNO/",
  },
  {
    url: "https://www.instagram.com/p/DWRiGGLEZKB/",
  },
  {
    url: "https://www.instagram.com/p/DVq_5WIEVxO",
  },
]

export function InstagramSection() {
  const autoplay = useRef(
    Autoplay({
      delay: 4500,
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
            Instagram y reels del Centro
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Conoce publicaciones y reels con actividades, procesos y resultados
            del Centro de Prototipado.
          </p>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {instagramItems.map((item) => (
            <article className="" key={item.url}>
              <InstagramEmbed url={item.url} width={328} />
            </article>
          ))}
        </div>
      </div>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
