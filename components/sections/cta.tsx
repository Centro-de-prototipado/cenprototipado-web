import Link from "next/link"
import { DecorIcon } from "@/components/ui/decor-icon"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

export function CallToAction() {
  return (
    <section className="relative flex w-full flex-col border-b">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />
      <div className="relative border-b px-12 py-20 md:px-16 md:py-30">
        <h2 className="text-center text-3xl font-bold text-balance md:text-5xl lg:text-5xl">
          Descubre el Centro de Prototipado
        </h2>
        <p className="mt-3 text-center text-sm text-balance text-muted-foreground md:text-base">
          Un espacio para explorar, aprender y crear sin limites con tecnologias
          que convierten ideas en soluciones reales.
        </p>
      </div>
      <div className="relative flex items-center justify-center gap-3 bg-secondary/50 px-12 py-8 md:px-16 md:py-10 dark:bg-secondary/20">
        <Link href="/contacto">
          <Button variant="outline" size="lg">
            Contáctanos
          </Button>
        </Link>
        <Link href="/centro">
          <Button size="lg">
            Conoce el Centro <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </Link>
      </div>
      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
