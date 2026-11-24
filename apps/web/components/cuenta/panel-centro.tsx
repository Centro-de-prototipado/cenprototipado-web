import { Logo } from "@/components/shared/logo"
import { FloatingPaths } from "@/components/ui/floating-paths"

/** Panel de marca de las páginas de cuenta del Centro (diseño original del /login). */
export function PanelCentro() {
  return (
    <>
      <div className="absolute inset-0 bg-secondary dark:bg-secondary/20" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
      <span className="relative">
        <Logo className="h-24" />
      </span>

      <div className="relative z-10 mt-auto">
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
    </>
  )
}
