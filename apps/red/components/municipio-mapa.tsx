import Link from "next/link"
import type { Aula } from "@/lib/red-data"
import { CALDAS_VIEWBOX, municipiosCaldas } from "@/lib/caldas-geo"
import { MANIZALES_VIEWBOX, comunasManizales, corregimientosManizales, perimetroUrbano, proyectarManizales } from "@/lib/manizales-geo"

const sinTildes = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

/** Ubicación del aula (estilo Blueprint + Neón): en Manizales, su punto en la ciudad;
 *  en los demás municipios, Caldas con el municipio resaltado. */
export function MunicipioMapa({ aula }: { aula: Aula }) {
  const enManizales = sinTildes(aula.municipio.nombre) === "manizales" && aula.lat != null && aula.lon != null
  return enManizales ? <PuntoManizales aula={aula} /> : <MunicipioCaldas municipio={aula.municipio.nombre} />
}

function PuntoManizales({ aula }: { aula: Aula }) {
  const { width: W, height: H } = MANIZALES_VIEWBOX
  const [x, y] = proyectarManizales(aula.lat!, aula.lon!)
  const colegio = aula.tipo === "colegio"
  return (
    <figure className="border border-cyan-950 bg-[#0b1726]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Ubicación${aula.ubicacion_aproximada ? " aproximada" : ""} de ${aula.nombre} en Manizales`}
        className="block h-auto w-full"
      >
        <g aria-hidden="true">
          {corregimientosManizales.map((z) => (
            <path key={z.nombre} d={z.d} className="red-map__mpio" />
          ))}
          <g className="red-map__halo">
            <path d={perimetroUrbano} />
          </g>
          {comunasManizales.map((z) => (
            <path key={z.nombre} d={z.d} className="red-map__mpio red-map__mpio--aula red-map__comuna" />
          ))}
          <circle cx={x} cy={y} r="34" className="red-map__ring" />
          {aula.ubicacion_aproximada && <circle cx={x} cy={y} r="22" className="red-map__aprox" />}
          {colegio ? (
            <rect x={x - 10} y={y - 10} width="20" height="20" transform={`rotate(45 ${x} ${y})`} className="red-map__diamond" />
          ) : (
            <circle cx={x} cy={y} r="13" className="red-map__hub" />
          )}
          <text x={x} y={y - 30} textAnchor="middle" className="red-map__label" style={{ fontSize: 22 }}>
            MANIZALES
          </text>
        </g>
      </svg>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-cyan-950 px-3 py-2 font-mono text-[11px] text-slate-400">
        <span>Manizales · {aula.ubicacion_aproximada ? "ubicación aproximada" : "ubicación de la sede"}</span>
        <Link href="/#manizales" className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200">
          Ver en el mapa
        </Link>
      </figcaption>
    </figure>
  )
}

function MunicipioCaldas({ municipio }: { municipio: string }) {
  const objetivo = municipiosCaldas.find((m) => sinTildes(m.nombre) === sinTildes(municipio))
  const { width: W, height: H } = CALDAS_VIEWBOX
  return (
    <figure className="border border-cyan-950 bg-[#0b1726]">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Ubicación aproximada: municipio de ${municipio}, Caldas`} className="block h-auto w-full">
        <g aria-hidden="true">
          {municipiosCaldas.map((m) => (
            <path
              key={m.codigo}
              d={m.d}
              className={m === objetivo ? "red-map__mpio red-map__mpio--destacado" : "red-map__mpio"}
            />
          ))}
        </g>
        {objetivo && (
          <g aria-hidden="true">
            <circle cx={objetivo.centro[0]} cy={objetivo.centro[1]} r="30" className="red-map__ring" />
            <circle cx={objetivo.centro[0]} cy={objetivo.centro[1]} r="11" className="red-map__hub" />
            <text x={objetivo.centro[0]} y={objetivo.centro[1] - 26} textAnchor="middle" className="red-map__label" style={{ fontSize: 22 }}>
              {objetivo.nombre.toUpperCase()}
            </text>
          </g>
        )}
      </svg>
      <figcaption className="border-t border-cyan-950 px-3 py-2 font-mono text-[11px] text-slate-400">
        Caldas · ubicación aproximada por municipio
      </figcaption>
    </figure>
  )
}
