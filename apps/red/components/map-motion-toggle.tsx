"use client"

import { useState } from "react"
import { PauseIcon, PlayIcon } from "lucide-react"

// Pausa o reanuda las animaciones del mapa (lineamiento 8 de accesibilidad).
export function MapMotionToggle() {
  const [paused, setPaused] = useState(false)

  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={(event) => {
        const figure = event.currentTarget.closest(".red-map")
        figure?.classList.toggle("red-map--paused", !paused)
        setPaused(!paused)
      }}
      className="ml-auto inline-flex min-h-10 items-center gap-2 border border-cyan-900 px-3 text-slate-200 hover:border-cyan-400 focus-visible:ring-3 focus-visible:ring-cyan-400/50 focus-visible:outline-none"
    >
      {paused ? <PlayIcon className="size-4" /> : <PauseIcon className="size-4" />}
      {paused ? "Reanudar animación" : "Pausar animación"}
    </button>
  )
}
