import { CALDAS_VIEWBOX, municipiosCaldas } from "@/lib/caldas-geo"

const sinTildes = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

/** Caldas con el municipio del aula resaltado (estilo Blueprint + Neón). */
export function MunicipioMapa({ municipio, colegio = false }: { municipio: string; colegio?: boolean }) {
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
            {colegio ? (
              <rect
                x={objetivo.centro[0] - 9}
                y={objetivo.centro[1] - 9}
                width="18"
                height="18"
                transform={`rotate(45 ${objetivo.centro[0]} ${objetivo.centro[1]})`}
                className="red-map__diamond"
              />
            ) : (
              <circle cx={objetivo.centro[0]} cy={objetivo.centro[1]} r="11" className="red-map__hub" />
            )}
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
