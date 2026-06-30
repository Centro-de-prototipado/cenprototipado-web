"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Portal, PortalBackdrop } from "@/components/ui/portal"
import { Button } from "@/components/ui/button"
import { centroLinks, exploreLinks } from "@/components/layout/nav-links"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { XIcon, MenuIcon, ChevronRightIcon } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

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
          <PortalBackdrop />
          <div
            className={cn(
              "size-full overflow-y-auto bg-background p-4",
              "ease-out data-[slot=open]:animate-in data-[slot=open]:zoom-in-97"
            )}
            data-slot={open ? "open" : "closed"}
          >
            <div className="flex w-full flex-col gap-y-4">
              {/* Centro group */}
              <div>
                <p className="mb-1 px-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Centro
                </p>
                {centroLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-none border border-transparent px-3 py-2.5 transition-colors active:bg-muted dark:active:bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium">{link.label}</p>
                      {link.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {link.description}
                        </p>
                      )}
                    </div>
                    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>

              {/* Explorar group */}
              <div>
                <p className="mb-1 px-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Explorar
                </p>
                {exploreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-none border border-transparent px-3 py-2.5 transition-colors active:bg-muted dark:active:bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium">{link.label}</p>
                      {link.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {link.description}
                        </p>
                      )}
                    </div>
                    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>

              {/* Contacto direct */}
              <Link
                href="/contacto"
                onClick={() => setOpen(false)}
                className="rounded-none border border-transparent px-3 py-2.5 text-sm font-medium transition-colors active:bg-muted dark:active:bg-muted/50"
              >
                Contacto
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <ThemeToggle showLabel className="w-full" />
              <Link href="/login">
                <Button className="w-full" variant="outline">
                  Ingresar
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="w-full">Ir al panel</Button>
              </Link>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
