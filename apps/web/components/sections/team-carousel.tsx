"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon, LinkIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ui/reveal"
import type { TeamMember } from "@/lib/institutional-data"

export function TeamCarousel({ members }: { members: TeamMember[] }) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = React.useState(false)

  const scrollByCard = React.useCallback((direction: "left" | "right") => {
    const track = trackRef.current
    if (!track) return

    const firstCard = track.firstElementChild as HTMLElement | null
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
    const step = firstCard
      ? firstCard.getBoundingClientRect().width + gap
      : track.clientWidth * 0.8

    track.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    })
  }, [])

  React.useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      const track = trackRef.current
      if (!track) return

      const isAtEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 10

      if (isAtEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        scrollByCard("right")
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isPaused, scrollByCard])

  return (
    <div
      className="space-y-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className="grid gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(200px, 220px)",
          scrollSnapType: "x proximity",
        }}
      >
        {members.map((m, i) => (
          <Reveal
            as="article"
            key={m.name}
            index={i}
            className="group overflow-hidden border bg-card dark:border-white/12 dark:bg-white/5"
            style={{ scrollSnapAlign: "start" }}
          >
            <div
              className="relative"
              style={{ aspectRatio: "4/5", overflow: "hidden" }}
            >
              <Image
                src={m.portrait}
                alt={m.name}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                sizes="220px"
              />
            </div>
            <div className="border-t p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="m-0 text-sm font-bold text-foreground">{m.name}</p>
                  <p className="m-0 mt-1 text-xs text-muted-foreground">{m.role}</p>
                </div>
                {m.linkedin && (
                  <a
                    aria-label={`LinkedIn de ${m.name}`}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                    href={m.linkedin}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <LinkIcon className="size-4" />
                  </a>
                )}
              </div>
              {m.bio && (
                <p className="m-0 mt-1.5 text-xs leading-relaxed text-muted-foreground/80">
                  {m.bio}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          aria-label="Anterior"
          onClick={() => scrollByCard("left")}
          size="icon"
          variant="outline"
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          aria-label="Siguiente"
          onClick={() => scrollByCard("right")}
          size="icon"
          variant="outline"
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}
