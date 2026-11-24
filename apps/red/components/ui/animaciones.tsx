"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { cn } from "@/lib/utils"

// Animaciones de texto del sitio del Centro, sin depender de motion/react:
// - TituloEntrada: palabras que entran con desenfoque al cargar la página (título principal).
// - TituloAnimado: palabras que se "materializan" al aparecer en pantalla (títulos de sección).
// - Contador: número que sube de 0 al valor real al aparecer en pantalla.
// Sin JavaScript o con «reducir movimiento» todo se ve completo y quieto (ver globals.css).

function useVisible<T extends Element>(margen = "0px 0px -12% 0px") {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { rootMargin: margen }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [margen])
  return [ref, visible] as const
}

function partir(texto: string, acento?: string) {
  if (!acento) return [{ texto, acento: false }]
  const i = texto.indexOf(acento)
  if (i === -1) return [{ texto, acento: false }]
  return [
    { texto: texto.slice(0, i), acento: false },
    { texto: acento, acento: true },
    { texto: texto.slice(i + acento.length), acento: false },
  ].filter((s) => s.texto)
}

/** Título principal: cada palabra entra con desenfoque al cargar (como el hero del Centro). */
export function TituloEntrada({ texto, acento, className }: { texto: string; acento?: string; className?: string }) {
  let n = 0
  return (
    <h1 className={className}>
      {partir(texto, acento).map((seg, s) =>
        seg.texto.split(/(\s+)/).map((trozo, c) => {
          if (!trozo) return null
          if (/^\s+$/.test(trozo)) return trozo
          const i = n++
          return (
            <span
              key={`${s}-${c}`}
              className={cn("hero-word", seg.acento && "hero-glow text-primary")}
              style={{ "--wi": i } as CSSProperties}
            >
              {trozo}
            </span>
          )
        })
      )}
    </h1>
  )
}

/** Título de sección: palabras que aparecen al hacer scroll (TechHeading del Centro). */
export function TituloAnimado({
  texto,
  acento,
  id,
  as: Tag = "h2",
  className,
}: {
  texto: string
  acento?: string
  id?: string
  as?: "h1" | "h2" | "h3"
  className?: string
}) {
  const [ref, visible] = useVisible<HTMLHeadingElement>()
  // Se "arma" solo con JavaScript, así sin JS el título nunca queda en blanco.
  const [armado, setArmado] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setArmado(true))
    return () => cancelAnimationFrame(raf)
  }, [])
  let n = 0
  return (
    <Tag ref={ref} id={id} className={className}>
      {partir(texto, acento).map((seg, s) =>
        seg.texto.split(/(\s+)/).map((trozo, c) => {
          if (!trozo) return null
          if (/^\s+$/.test(trozo)) return trozo
          const i = n++
          return (
            <span
              key={`${s}-${c}`}
              className={cn("fx-word", seg.acento && "fx-accent text-primary")}
              data-armed={armado || undefined}
              data-in={visible || undefined}
              style={{ "--wi": i } as CSSProperties}
            >
              {trozo}
            </span>
          )
        })
      )}
    </Tag>
  )
}

/** Número que cuenta desde 0 al aparecer. Mantiene sufijos («+», «%»). */
export function Contador({ valor, className }: { valor: string | number; className?: string }) {
  const texto = String(valor)
  const m = texto.match(/^(\d+)(.*)$/)
  const [ref, visible] = useVisible<HTMLSpanElement>("0px 0px -15% 0px")

  useEffect(() => {
    const el = ref.current
    if (!m || !visible || !el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const meta = Number(m[1])
    const sufijo = m[2]
    const inicio = performance.now()
    let raf = 0
    const paso = (t: number) => {
      const p = Math.min((t - inicio) / 1100, 1)
      const suave = 1 - Math.pow(2, -10 * p) // easeOutExpo, igual que el Centro
      el.textContent = `${Math.round(meta * (p === 1 ? 1 : suave))}${sufijo}`
      if (p < 1) raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, texto])

  return (
    <span ref={ref} className={className}>
      {texto}
    </span>
  )
}
