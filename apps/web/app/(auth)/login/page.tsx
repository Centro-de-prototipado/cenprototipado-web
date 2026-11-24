import { FloatingPaths } from "@/components/ui/floating-paths"
import { Reveal } from "@/components/ui/reveal"
import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { FormIngresar } from "@cen/auth"
import { ConCuenta } from "@/components/cuenta/pagina-cuenta"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col border-r bg-secondary p-10 lg:flex dark:bg-secondary/20">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
        <span>
          <Logo className="h-24" />
        </span>

        <div className="z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl">
              &ldquo;El Centro de Prototipado nos dio las herramientas y el
              acompañamiento para convertir una idea de clase en un prototipo
              funcional.&rdquo;
            </p>
            <footer className="font-mono text-sm font-semibold">
              ~ Comunidad UNAL Manizales
            </footer>
          </blockquote>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>
      <div className="relative flex min-h-screen flex-col justify-center bg-background/60 px-8">
        {/* Top Shades */}
        <div
          aria-hidden
          className="absolute inset-0 isolate -z-10 opacity-60 contain-strict"
        >
          <div className="rounded-none-none absolute top-0 right-0 h-320 w-140 -translate-y-87.5 bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
          <div className="rounded-none-none absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
          <div className="rounded-none-none absolute top-0 right-0 h-320 w-60 -translate-y-87.5 bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
        </div>
        <Link href="/">
          <Button className="absolute top-7 left-5" variant="ghost">
            <ChevronLeftIcon data-icon="inline-start" />
            Inicio
          </Button>
        </Link>

        <Logo className="h-24 lg:hidden" />
        <Reveal as="div" immediate className="mx-auto w-full">
          <ConCuenta>
            <FormIngresar />
          </ConCuenta>
        </Reveal>
      </div>
    </main>
  )
}
