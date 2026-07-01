"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const HeroRobot = dynamic(
  () => import("@/components/sections/hero-robot").then((m) => m.HeroRobot),
  { ssr: false }
)

// Desktop-only: avoids shipping/mounting the Three.js bundle on mobile,
// where it competed with hydration and could leave the page looking blank.
export function HeroRobotGate({ className }: { className?: string }) {
  const [showRobot, setShowRobot] = useState(false)

  useEffect(() => {
    if (window.innerWidth >= 1024) setShowRobot(true)
  }, [])

  if (!showRobot) return null
  return <HeroRobot className={className} />
}
