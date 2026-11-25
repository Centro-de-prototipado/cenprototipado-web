import Link from "next/link"
import { ArrowRightIcon, FolderKanbanIcon } from "lucide-react"
import { AREAS, urlProyecto, type Proyecto } from "@/lib/proyectos"
import { tipo } from "@/components/ui/tipografia"

/** Tarjeta de un proyecto publicado (galería y página del aula). */
export function TarjetaProyecto({ proyecto, mostrarAula = true }: { proyecto: Proyecto; mostrarAula?: boolean }) {
  return (
    <li>
      <Link href={urlProyecto(proyecto.id)} className="iso-panel group flex h-full flex-col overflow-hidden">
        {proyecto.portada_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={proyecto.portada_url} alt="" className="aspect-video w-full object-cover" loading="lazy" />
        ) : (
          <div aria-hidden="true" className="grid aspect-video place-items-center bg-[#0b1726] text-cyan-400/60">
            <FolderKanbanIcon className="size-10" />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <span className={tipo.etiqueta}>
            {AREAS[proyecto.area]}
            {proyecto.anio ? ` · ${proyecto.anio}` : ""}
          </span>
          <span className={tipo.h3}>{proyecto.titulo}</span>
          <span className={`line-clamp-3 ${tipo.textoTarjeta}`}>{proyecto.resumen}</span>
          {mostrarAula && proyecto.aula && <span className="text-xs font-semibold text-muted-foreground">{proyecto.aula.nombre}</span>}
          <span className="text-link mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold">
            Ver proyecto <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </li>
  )
}
