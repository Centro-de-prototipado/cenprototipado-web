"use client"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/logo"
import { useScroll } from "@/hooks/use-scroll"
import { Button } from "@/components/ui/button"
import { DesktopNav } from "@/components/layout/desktop-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { DecorIcon } from "@/components/ui/decor-icon"
import Link from "next/link"

export function Header() {
  const scrolled = useScroll(10)

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "mx-auto w-full max-w-6xl border-x border-b bg-background/60",
          {
            "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60":
              scrolled,
          }
        )}
      >
        <nav className="relative flex h-16 w-full items-center justify-between px-12 md:px-16">
          <DecorIcon className="size-3" position="bottom-left" />
          <DecorIcon className="size-3" position="bottom-right" />

          <div className="flex items-center gap-5">
            <a
              className="inline-flex h-14 items-center justify-center rounded-lg px-1 hover:bg-muted dark:hover:bg-muted/50"
              href="#"
            >
              <Logo className="h-full" />
            </a>
            <DesktopNav />
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/login">
              <Button variant="outline">Ingresar</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Ir al panel</Button>
            </Link>
          </div>
          <MobileNav />
        </nav>
      </div>
    </header>
  )
}
