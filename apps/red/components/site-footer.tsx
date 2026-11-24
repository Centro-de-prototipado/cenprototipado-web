import { CENTRO_URL } from "@/lib/site-config"
import { DecorIcon } from "@/components/ui/decor-icon"

export function SiteFooter() {
  return (
    <footer className="relative border-t">
      <div className="relative mx-auto w-full max-w-6xl border-x">
        <DecorIcon position="top-left" />
        <DecorIcon position="top-right" />
        <div className="flex flex-wrap items-center gap-4 px-8 py-10 text-sm lg:px-16">
          <p className="font-semibold">Red STEAM Caldas</p>
          <p className="text-muted-foreground">Centro de Prototipado · Universidad Nacional de Colombia, sede Manizales</p>
          <a href={CENTRO_URL} className="text-link ml-auto underline">
            Sitio del Centro
          </a>
        </div>
      </div>
    </footer>
  )
}
