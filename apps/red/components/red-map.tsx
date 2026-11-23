import type { Aula } from "@/lib/red-data"
import { CALDAS_VIEWBOX, PX_POR_KM, municipiosCaldas } from "@/lib/caldas-geo"
import { MapMotionToggle } from "@/components/map-motion-toggle"

// Mapa de la Red en estilo Blueprint + Neón nocturno (ver «Identidad visual y
// accesibilidad», tablero IV-04), dibujado con los límites reales de los 27
// municipios de Caldas. Cada aula se ubica en el centro de su municipio
// (ubicación aproximada). SVG + CSS, sin librerías de mapas; las animaciones
// se pausan con el botón o con `prefers-reduced-motion`.

const { width: W, height: H } = CALDAS_VIEWBOX

const sinTildes = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
const geoPorNombre = new Map(municipiosCaldas.map((m) => [sinTildes(m.nombre), m]))
const punto = (aula: Aula): [number, number] => geoPorNombre.get(sinTildes(aula.municipio.nombre))?.centro ?? [W / 2, H / 2]

/** Arco suave entre un aula y el nodo central (curva cuadrática hacia arriba). */
function arco([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dist = Math.hypot(x2 - x1, y2 - y1)
  const lift = Math.min(90, dist * 0.22)
  // Normal a la cuerda, siempre hacia arriba del lienzo.
  let nx = -(y2 - y1) / dist
  let ny = (x2 - x1) / dist
  if (ny > 0) {
    nx = -nx
    ny = -ny
  }
  return `M${x1},${y1} Q${(mx + nx * lift).toFixed(1)},${(my + ny * lift).toFixed(1)} ${x2},${y2}`
}

export function RedMap({ aulas }: { aulas: Aula[] }) {
  const centro = aulas.find((a) => a.tipo === "centro")
  const aulasMunicipales = aulas.filter((a) => a.tipo === "municipal")
  const aulasColegio = aulas.filter((a) => a.tipo === "colegio")
  const municipiosConAula = new Set(aulas.filter((a) => a.tipo !== "colegio").map((a) => sinTildes(a.municipio.nombre)))
  if (!centro) return null
  const hub = punto(centro)
  const escalaKm = 20
  const escalaPx = escalaKm * PX_POR_KM

  const colegios = aulasColegio.map((aula, i) => {
    const angle = (i / aulasColegio.length) * Math.PI * 2 - Math.PI / 2
    return { aula, x: hub[0] + Math.cos(angle) * 44, y: hub[1] + Math.sin(angle) * 44 }
  })

  return (
    <figure className="red-map relative overflow-hidden border border-cyan-950 bg-[#0b1726]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="red-map-title red-map-desc"
        className="block h-auto w-full"
      >
        <title id="red-map-title">Mapa de la Red STEAM de Caldas</title>
        <desc id="red-map-desc">
          {`Mapa de los 27 municipios de Caldas. Manizales es el nodo central; ${aulasMunicipales.length} aulas municipales y ${aulasColegio.length} aulas de colegio están conectadas a él. La lista de aulas debajo del mapa tiene la misma información.`}
        </desc>
        <defs>
          <pattern id="rm-grid-minor" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#16324c" strokeWidth="0.8" opacity="0.5" />
          </pattern>
          <pattern id="rm-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#rm-grid-minor)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#1d3f5e" strokeWidth="1" />
          </pattern>
          <radialGradient id="rm-vignette" cx="50%" cy="50%" r="72%">
            <stop offset="55%" stopColor="#0b1726" stopOpacity="0" />
            <stop offset="100%" stopColor="#040a12" stopOpacity="0.9" />
          </radialGradient>
          <radialGradient id="rm-hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <filter id="rm-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={W} height={H} fill="url(#rm-grid)" />

        {/* Halo exterior del departamento: los municipios con trazo grueso y desenfocado. */}
        <g aria-hidden="true" className="red-map__halo">
          {municipiosCaldas.map((m) => (
            <path key={m.codigo} d={m.d} />
          ))}
        </g>

        {/* Municipios. */}
        <g aria-hidden="true">
          {municipiosCaldas.map((m) => (
            <path
              key={m.codigo}
              d={m.d}
              className={municipiosConAula.has(sinTildes(m.nombre)) ? "red-map__mpio red-map__mpio--aula" : "red-map__mpio"}
            >
              <title>{m.nombre}</title>
            </path>
          ))}
        </g>

        {/* Nombres de los municipios sin aula (tenues). */}
        <g aria-hidden="true">
          {municipiosCaldas
            .filter((m) => !municipiosConAula.has(sinTildes(m.nombre)))
            .map((m) => (
              <text key={m.codigo} x={m.centro[0]} y={m.centro[1] + 4} textAnchor="middle" className="red-map__mpio-label">
                {m.nombre.toUpperCase()}
              </text>
            ))}
        </g>

        {/* Conexiones de la red con pulsos. */}
        <g aria-hidden="true">
          {aulasMunicipales.map((aula, i) => {
            const d = arco(punto(aula), hub)
            return (
              <g key={aula.slug}>
                <path d={d} className="red-map__line" />
                <path d={d} pathLength={100} className="red-map__pulse" style={{ animationDelay: `${(i % 6) * 0.8}s` }} />
              </g>
            )
          })}
          <circle cx={hub[0]} cy={hub[1]} r="70" fill="url(#rm-hub-glow)" />
          <circle cx={hub[0]} cy={hub[1]} r="44" className="red-map__ring-static" />
          <circle cx={hub[0]} cy={hub[1]} r="26" className="red-map__ring" />
          <circle cx={hub[0]} cy={hub[1]} r="26" className="red-map__ring red-map__ring--late" />
        </g>

        {/* Aulas municipales. */}
        {aulasMunicipales.map((aula) => {
          const [x, y] = punto(aula)
          return (
            <a key={aula.slug} href={`/aulas/${aula.slug}`} aria-label={`${aula.nombre}, ${aula.municipio.nombre}`} className="red-map__node">
              <circle cx={x} cy={y} r="16" fill="transparent" />
              <circle cx={x} cy={y} r="7.5" className="red-map__dot" />
              <circle cx={x} cy={y} r="3" fill="#0b1726" />
              <text x={x} y={y - 14} textAnchor="middle" className="red-map__label">
                {aula.municipio.nombre.toUpperCase()}
              </text>
            </a>
          )
        })}

        {/* Aulas de colegio en Manizales, en anillo alrededor del nodo central. */}
        {colegios.map(({ aula, x, y }) => (
          <a key={aula.slug} href={`/aulas/${aula.slug}`} aria-label={`${aula.nombre}, aula de colegio en Manizales`} className="red-map__node">
            <rect x={x - 9} y={y - 9} width="18" height="18" fill="transparent" />
            <rect x={x - 5} y={y - 5} width="10" height="10" transform={`rotate(45 ${x} ${y})`} className="red-map__diamond" />
          </a>
        ))}

        {/* Nodo central. */}
        <a href={`/aulas/${centro.slug}`} aria-label={`${centro.nombre}, nodo central en Manizales`} className="red-map__node">
          <circle cx={hub[0]} cy={hub[1]} r="12" className="red-map__hub" />
          <circle cx={hub[0]} cy={hub[1]} r="4.5" fill="#ffffff" />
          <text x={hub[0]} y={hub[1] + 68} textAnchor="middle" className="red-map__label red-map__label--hub">
            MANIZALES · NODO CENTRAL
          </text>
        </a>

        <rect width={W} height={H} fill="url(#rm-vignette)" pointerEvents="none" />

        {/* Rótulos técnicos: título, norte y escala. */}
        <g aria-hidden="true" className="red-map__chrome">
          <text x="20" y="34" className="red-map__label red-map__title">
            RED STEAM · CALDAS
          </text>
          <text x="20" y="52" className="red-map__coord">
            BLUEPRINT + NEÓN · 27 MUNICIPIOS · {aulasMunicipales.length + aulasColegio.length + 1} NODOS
          </text>
          <g transform={`translate(${W - 48} 56)`}>
            <circle r="20" className="red-map__compass" />
            <path d="M0,-15 L5,4 L0,0 L-5,4 Z" fill="#22d3ee" />
            <text y="-26" textAnchor="middle" className="red-map__coord">
              N
            </text>
          </g>
          <g transform={`translate(${W - 40 - escalaPx} ${H - 26})`}>
            <path d={`M0,-6 V0 H${escalaPx} V-6`} className="red-map__scale" />
            <path d={`M${escalaPx / 2},-4 V0`} className="red-map__scale" />
            <text x={escalaPx / 2} y="-10" textAnchor="middle" className="red-map__coord">
              {escalaKm} KM
            </text>
          </g>
        </g>
      </svg>

      <figcaption className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-cyan-950 px-4 py-3 font-mono text-xs text-slate-300">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block size-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          Centro y aulas municipales
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block size-2 rotate-45 bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
          Aulas de colegio (Manizales)
        </span>
        <span className="text-slate-400">Límites: DANE · ubicación aproximada</span>
        <MapMotionToggle />
      </figcaption>
    </figure>
  )
}
