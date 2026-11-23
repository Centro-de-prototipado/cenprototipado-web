import { CENTRO_URL } from "@/lib/site-config"

export function SiteFooter() {
  return (
    <footer className="relative border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-8 text-sm">
        <p className="font-semibold">Red STEAM Caldas</p>
        <p className="text-muted-foreground">Centro de Prototipado · Universidad Nacional de Colombia, sede Manizales</p>
        <a href={CENTRO_URL} className="text-link ml-auto underline">
          Sitio del Centro
        </a>
      </div>
    </footer>
  )
}
