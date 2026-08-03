"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { PlayIcon, XIcon } from "lucide-react"

import { Portal, PortalBackdrop } from "@/components/ui/portal"
import { cn } from "@/lib/utils"

/**
 * Reels con fachada: la tarjeta muestra nuestra portada y, al pulsar play, abre
 * el embed oficial de Instagram en un modal.
 *
 * El embed va en modal y no dentro de la tarjeta porque trae su propio chrome
 * (cabecera, likes, pie) y un ancho mínimo de ~326px que no cabe en el carrusel
 * sin quedar apretado. Cargarlo solo al abrir evita además que la home arrastre
 * el iframe de Meta —y sus cookies— en cada visita.
 */
export function ReelPlayer({
  embedUrl,
  poster,
  caption,
  className,
}: {
  embedUrl: string
  poster: string
  caption: string
  className?: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <>
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={caption ? `Reproducir: ${caption}` : "Reproducir el reel"}
          className="group/play absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 768px) 80vw, 288px"
            className="object-cover transition-transform duration-500 group-hover/play:scale-[1.04]"
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
          {caption && (
            <span className="pointer-events-none absolute inset-x-0 bottom-0 block bg-gradient-to-t from-black/85 via-black/25 to-transparent px-4 pt-10 pb-4 text-left text-xs leading-relaxed text-white opacity-0 transition-opacity duration-300 group-hover/play:opacity-100">
              <span className="line-clamp-3">{caption}</span>
            </span>
          )}
        </button>
      </div>

      {open && (
        <Portal className="items-center justify-center p-4">
          <PortalBackdrop onClick={() => setOpen(false)} />
          <div className="relative flex max-h-full w-full max-w-[400px] flex-col border bg-card shadow-[6px_6px_0_0_rgba(0,0,0,0.12)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
              <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                Reel
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="flex size-7 cursor-pointer items-center justify-center border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <XIcon className="size-3.5" />
              </button>
            </div>
            <iframe
              src={embedUrl}
              title={caption || "Reel de Instagram"}
              scrolling="no"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              // El embed de un reel necesita ~700px para no recortar su barra
              // de acciones; el tope en vh evita que se salga en pantallas bajas.
              className="h-[min(78vh,700px)] w-full border-0 bg-black"
            />
          </div>
        </Portal>
      )}
    </>
  )
}
