"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

// Botón para alternar el tema. Mismo comportamiento que el atajo "D".
// `showLabel` lo renderiza con texto (útil en el menú móvil a ancho completo).
export function ThemeToggle({
  showLabel = false,
  className,
}: {
  showLabel?: boolean
  className?: string
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="outline"
      size={showLabel ? "default" : "icon"}
      className={className}
      aria-label="Cambiar tema"
      title="Cambiar tema (D)"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Hasta montar, render fijo para no romper la hidratación. */}
      {mounted && isDark ? <SunIcon /> : <MoonIcon />}
      {showLabel && <span>{mounted && isDark ? "Tema claro" : "Tema oscuro"}</span>}
    </Button>
  )
}
