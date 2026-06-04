"use client"

import { useEffect, useRef } from "react"
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react"

/**
 * Scroll-reveal primitive. Wraps any block and animates it into view once.
 *
 * Motion choices (Jakub-weighted, marketing landing):
 * - enter = opacity + 8px translateY + 4px blur → "materializing" feel
 * - spring, bounce: 0 → smooth deceleration, no overshoot (professional)
 * - index → small stagger when used across a list/grid
 * - respects prefers-reduced-motion (renders final state, no motion)
 */
type RevealTag =
  | "div"
  | "section"
  | "article"
  | "figure"
  | "li"
  | "span"
  | "a"

type RevealProps = HTMLMotionProps<"div"> &
  Pick<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "target" | "rel"
  > & {
    as?: RevealTag
    /** Position in a list/grid — drives a subtle stagger. */
    index?: number
    /** Extra delay in seconds, added on top of the stagger. */
    delay?: number
  }

export function Reveal({
  as = "div",
  index = 0,
  delay = 0,
  children,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion()
  const Comp = motion[as] as typeof motion.div

  if (reduceMotion) {
    return <Comp {...props}>{children}</Comp>
  }

  return (
    <Comp
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{
        type: "spring",
        duration: 0.5,
        bounce: 0,
        delay: delay + Math.min(index, 8) * 0.06,
      }}
      {...props}
    >
      {children}
    </Comp>
  )
}

/**
 * Animated number counter. Counts 0 → target when scrolled into view.
 * Parses a leading number and keeps any suffix ("+", "%", …).
 * SSR / no-JS / reduced-motion all render the real final value.
 */
export function CountUp({
  value,
  className,
  style,
}: {
  value: string
  className?: string
  style?: React.CSSProperties
}) {
  const match = value.match(/^([\d.,]+)(.*)$/)
  const target = match ? Number(match[1].replace(/,/g, "")) : NaN
  const suffix = match ? match[2] : ""

  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })
  const reduceMotion = useReducedMotion()
  const count = useMotionValue(0)

  // Not a number we can animate (or reduced motion) → leave the static value.
  const animatable = !Number.isNaN(target) && !reduceMotion

  useEffect(() => {
    if (!animatable || !ref.current) return
    // Reset to 0 only on the client, just before animating, so SSR keeps the real value.
    ref.current.textContent = `0${suffix}`
  }, [animatable, suffix])

  useEffect(() => {
    if (!animatable || !inView) return
    const unsubscribe = count.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`
    })
    const controls = animate(count, target, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo — fast arrival, gentle settle
    })
    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [animatable, inView, target, suffix, count])

  return (
    <span ref={ref} className={className} style={style}>
      {value}
    </span>
  )
}
