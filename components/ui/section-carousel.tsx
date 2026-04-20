"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

type SectionCarouselProps = React.ComponentProps<"div"> & {
  title?: string
  description?: string
  children: React.ReactNode
  autoplay?: boolean
  autoplayInterval?: number
}

export function SectionCarousel({
  title,
  description,
  children,
  className,
  autoplay = true,
  autoplayInterval = 3000,
  ...props
}: SectionCarouselProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = React.useState(false)
  
  const scrollByCard = React.useCallback((direction: "left" | "right") => {
    const track = trackRef.current
    if (!track) return

    const offset = track.clientWidth * 0.8
    track.scrollBy({
      left: direction === "left" ? -offset : offset,
      behavior: "smooth",
    })
  }, [])

  React.useEffect(() => {
    if (!autoplay || isPaused) return

    const interval = setInterval(() => {
      const track = trackRef.current
      if (!track) return

      const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10
      
      if (isAtEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        scrollByCard("right")
      }
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [autoplay, autoplayInterval, isPaused, scrollByCard])

  return (
    <div 
      className={cn("space-y-4", className)} 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      {...props}
    >
      {(title || description) && (
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            {title && <h3 className="text-2xl font-semibold md:text-3xl">{title}</h3>}
            {description && (
              <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
                {description}
              </p>
            )}
          </div>
          <div className="hidden gap-2 md:flex">
            <Button aria-label="Anterior" onClick={() => scrollByCard("left")} size="icon" variant="outline">
              <ChevronLeftIcon />
            </Button>
            <Button aria-label="Siguiente" onClick={() => scrollByCard("right")} size="icon" variant="outline">
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      )}

      <div
        ref={trackRef}
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {children}
      </div>

      <div className="flex gap-2 md:hidden">
        <Button aria-label="Anterior" onClick={() => scrollByCard("left")} size="icon" variant="outline">
          <ChevronLeftIcon />
        </Button>
        <Button aria-label="Siguiente" onClick={() => scrollByCard("right")} size="icon" variant="outline">
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}