"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Portal, PortalBackdrop } from "@/components/ui/portal"
import { Button } from "@/components/ui/button"
import { LinkItem } from "@/components/shared/shared"
import { centroLinks, exploreLinks } from "@/components/layout/nav-links"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { XIcon, MenuIcon, MessageCircleIcon } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        <div
          className={cn(
            "transition-all",
            open ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        >
          <XIcon />
        </div>
        <div
          className={cn(
            "absolute transition-all",
            open ? "scale-0 opacity-0" : "scale-100 opacity-100"
          )}
        >
          <MenuIcon />
        </div>
      </Button>

      {open && (
        <Portal className="top-14">
          <PortalBackdrop onClick={() => setOpen(false)} />
          <div
            className={cn(
              "size-full overflow-y-auto bg-background p-4",
              "ease-out data-[slot=open]:animate-in data-[slot=open]:zoom-in-97"
            )}
            data-slot={open ? "open" : "closed"}
          >
            <div className="flex w-full flex-col gap-y-5">
              {/* Centro group */}
              <div>
                <p className="mb-2 px-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Centro
                </p>
                <div className="space-y-1 border bg-card p-2">
                  {centroLinks.map((link, i) => (
                    <LinkItem
                      key={`centro-${i}`}
                      {...link}
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </div>
              </div>

              {/* Explorar group */}
              <div>
                <p className="mb-2 px-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Explorar
                </p>
                <div className="space-y-1 border bg-card p-2">
                  {exploreLinks.map((link, i) => (
                    <LinkItem
                      key={`explore-${i}`}
                      {...link}
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <ThemeToggle showLabel className="w-full" />
              <Link href="/login">
                <Button className="w-full" variant="outline">
                  Ingresar
                </Button>
              </Link>
              <Link href="/contacto" onClick={() => setOpen(false)}>
                <Button className="w-full">
                  <MessageCircleIcon data-icon="inline-start" /> Contacto
                </Button>
              </Link>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
