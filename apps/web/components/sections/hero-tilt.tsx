"use client"

import { useRef } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react"

/**
 * Subtle 3D tilt for the robot media card. Follows the pointer with a damped
 * spring (max ~3.5°) and exposes --mx/--my CSS vars so the card's border glow
 * can track the cursor. Renders children flat under reduced motion.
 */
export function HeroTilt({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 140, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 140, damping: 20 })

  const onPointerMove = (event: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height

    // Border glow tracks the cursor even under reduced motion (it's static).
    el.style.setProperty("--mx", `${(px * 100).toFixed(2)}%`)
    el.style.setProperty("--my", `${(py * 100).toFixed(2)}%`)

    if (reduceMotion) return
    rotateY.set((px - 0.5) * 7) // look left/right
    rotateX.set((0.5 - py) * 5) // look up/down
  }

  const onPointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div className={className} style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        className="flex h-full w-full flex-1 flex-col"
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
