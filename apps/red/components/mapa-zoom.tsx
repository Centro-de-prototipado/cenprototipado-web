"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react"
import { ArrowLeftIcon, ZoomInIcon } from "lucide-react"
import { MapMotionToggle } from "@/components/map-motion-toggle"

type Vista = "caldas" | "manizales"

// Alterna entre el mapa de Caldas y la vista ampliada de Manizales. Los dos mapas se
// dibujan en el servidor; aquí solo se maneja el zoom. Cualquier elemento con
// data-zoom="manizales" dentro del mapa de Caldas abre la vista ampliada (clic, Enter o
// Espacio). La dirección /#manizales abre el mapa ya ampliado.
export function MapaZoom({
  caldas,
  manizales,
  origen,
  leyendaCaldas,
  leyendaManizales,
  colegios,
}: {
  caldas: ReactNode
  manizales: ReactNode
  /** Punto de Manizales en el mapa de Caldas, en % del ancho y del alto (origen del zoom). */
  origen: [number, number]
  leyendaCaldas: ReactNode
  leyendaManizales: ReactNode
  colegios: number
}) {
  const [vista, setVista] = useState<Vista>("caldas")
  const volverRef = useRef<HTMLButtonElement>(null)
  const ampliarRef = useRef<HTMLButtonElement>(null)
  const interaccion = useRef(false)

  // Enlace directo: /#manizales
  useEffect(() => {
    const leer = () => setVista(window.location.hash === "#manizales" ? "manizales" : "caldas")
    const id = requestAnimationFrame(leer)
    window.addEventListener("hashchange", leer)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener("hashchange", leer)
    }
  }, [])

  // Lleva el foco al control de la vista nueva (solo si la persona cambió de vista).
  useEffect(() => {
    if (!interaccion.current) return
    ;(vista === "manizales" ? volverRef : ampliarRef).current?.focus({ preventScroll: true })
  }, [vista])

  const cambiar = (nueva: Vista) => {
    interaccion.current = true
    setVista(nueva)
    const url = nueva === "manizales" ? "#manizales" : window.location.pathname + window.location.search
    window.history.replaceState(null, "", url)
  }

  const desdeMapa = (e: MouseEvent | KeyboardEvent) => {
    if ("key" in e && e.key !== "Enter" && e.key !== " ") return
    const objetivo = (e.target as Element).closest("[data-zoom='manizales']")
    if (!objetivo) return
    e.preventDefault()
    cambiar("manizales")
  }

  const ampliado = vista === "manizales"
  const transformOrigin = `${origen[0]}% ${origen[1]}%`

  return (
    <figure id="manizales" className="red-map relative scroll-mt-24 overflow-hidden border border-cyan-950 bg-[#0b1726]">
      <div className="relative">
        <div
          className="mapa-zoom__capa"
          data-oculta={ampliado || undefined}
          style={{ transformOrigin }}
          inert={ampliado}
          onClick={desdeMapa}
          onKeyDown={desdeMapa}
        >
          {caldas}
        </div>
        <div
          className="mapa-zoom__capa mapa-zoom__capa--manizales absolute inset-0"
          data-oculta={!ampliado || undefined}
          style={{ transformOrigin }}
          inert={!ampliado}
        >
          {manizales}
        </div>
      </div>

      <figcaption className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-cyan-950 px-4 py-3 font-mono text-xs text-slate-300">
        {ampliado ? leyendaManizales : leyendaCaldas}
        <div className="ml-auto flex flex-wrap gap-2">
          {ampliado ? (
            <button
              ref={volverRef}
              type="button"
              onClick={() => cambiar("caldas")}
              className="inline-flex min-h-10 items-center gap-2 border border-cyan-400 bg-cyan-400/10 px-3 text-cyan-100 hover:bg-cyan-400/20 focus-visible:ring-3 focus-visible:ring-cyan-400/50 focus-visible:outline-none"
            >
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Volver a Caldas
            </button>
          ) : (
            <button
              ref={ampliarRef}
              type="button"
              onClick={() => cambiar("manizales")}
              className="inline-flex min-h-10 items-center gap-2 border border-amber-400/70 bg-amber-400/10 px-3 text-amber-100 hover:bg-amber-400/20 focus-visible:ring-3 focus-visible:ring-amber-400/50 focus-visible:outline-none"
            >
              <ZoomInIcon className="size-4" aria-hidden="true" />
              Ver Manizales ({colegios} colegios)
            </button>
          )}
          <MapMotionToggle />
        </div>
      </figcaption>
      <p className="sr-only" aria-live="polite">
        {ampliado ? "Mapa ampliado de Manizales." : "Mapa de Caldas."}
      </p>
    </figure>
  )
}
