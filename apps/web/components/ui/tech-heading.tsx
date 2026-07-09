"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

type Tag = "h1" | "h2" | "h3"

/**
 * Heading whose words "materialize" (blur → focus, staggered) when scrolled
 * into view. An optional `accent` substring is colored primary + softly glows.
 *
 * Accessibility: SSR / no-JS renders the words fully visible (the reveal only
 * "arms" once JS mounts), so headings are never blank without JavaScript.
 */
export function TechHeading({
  text,
  accent,
  as = "h2",
  className,
  style,
}: {
  text: string
  accent?: string
  as?: Tag
  className?: string
  style?: React.CSSProperties
}) {
  const Tag = as
  const ref = useRef<HTMLHeadingElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" })
  const [armed, setArmed] = useState(false)

  useEffect(() => setArmed(true), [])

  if (reduce) {
    return (
      <Tag className={className} style={style}>
        {renderStatic(text, accent)}
      </Tag>
    )
  }

  // Split into [before, accent, after] so accent words stay grouped/colored.
  const segments = splitAccent(text, accent)
  let wordIndex = 0

  return (
    <Tag ref={ref} className={className} style={style}>
      {segments.map((seg, s) =>
        seg.text.split(/(\s+)/).map((chunk, c) => {
          if (/^\s+$/.test(chunk)) return chunk
          if (chunk === "") return null
          const i = wordIndex++
          return (
            <span
              key={`${s}-${c}`}
              className={cn("fx-word", seg.accent && "fx-accent text-primary")}
              data-armed={armed || undefined}
              data-in={inView || undefined}
              style={{ "--wi": i } as React.CSSProperties}
            >
              {chunk}
            </span>
          )
        })
      )}
    </Tag>
  )
}

function renderStatic(text: string, accent?: string) {
  const segments = splitAccent(text, accent)
  return segments.map((seg, i) =>
    seg.accent ? (
      <span key={i} className="text-primary">
        {seg.text}
      </span>
    ) : (
      <span key={i}>{seg.text}</span>
    )
  )
}

function splitAccent(text: string, accent?: string) {
  if (!accent) return [{ text, accent: false }]
  const idx = text.indexOf(accent)
  if (idx === -1) return [{ text, accent: false }]
  const segments: { text: string; accent: boolean }[] = []
  if (idx > 0) segments.push({ text: text.slice(0, idx), accent: false })
  segments.push({ text: accent, accent: true })
  const rest = text.slice(idx + accent.length)
  if (rest) segments.push({ text: rest, accent: false })
  return segments
}
