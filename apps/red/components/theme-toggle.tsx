"use client"

import { useSyncExternalStore } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

// Mismo botón de tema del Centro (32 px, borde). Hasta hidratar muestra la luna para no
// romper la hidratación; useSyncExternalStore evita el setState dentro de un efecto.
const suscribir = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const montado = useSyncExternalStore(suscribir, () => true, () => false)
  const oscuro = montado && resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label="Cambiar tema"
      title="Cambiar tema"
      onClick={() => setTheme(oscuro ? "light" : "dark")}
      className="inline-flex size-8 items-center justify-center border border-border bg-background shadow-xs transition-all hover:bg-background/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none active:scale-[0.97] dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
    >
      {oscuro ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </button>
  )
}
