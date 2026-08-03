"use client"

import { useState } from "react"
import Image from "next/image"
import { PlayIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Fachada de video: muestra la miniatura de YouTube y solo carga el iframe
 * (≈1 MB de JS de terceros) cuando el usuario pulsa play.
 *
 * Se implementa a mano en vez de usar `lite-youtube-embed` porque ese paquete
 * —también el que envuelve `@next/third-parties`— se sirve desde un CDN externo
 * sin versión fijada y trae su propio chrome visual, imposible de tematizar.
 * Aquí el estado en reposo es nuestro y el iframe apunta a youtube-nocookie.
 */
export function YouTubeFacade({
  videoId,
  title,
  className,
}: {
  videoId: string
  title: string
  className?: string
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden bg-muted",
        className
      )}
    >
      {playing ? (
        <iframe
          // autoplay: el usuario ya expresó la intención al pulsar play.
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Reproducir: ${title}`}
          className="group/play absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            // hqdefault viene en 4:3 con bandas negras; el zoom recorta hasta 16:9.
            className="scale-[1.35] object-cover transition-transform duration-500 group-hover/play:scale-[1.4]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover/play:bg-black/10"
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/25 bg-background/85 text-primary shadow-[3px_3px_0_0_rgba(0,0,0,0.18)] backdrop-blur-sm transition-transform duration-300 group-hover/play:scale-110"
          >
            <PlayIcon className="size-5 translate-x-px fill-current" />
          </span>
        </button>
      )}
    </div>
  )
}
