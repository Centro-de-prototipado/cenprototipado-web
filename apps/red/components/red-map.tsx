import { aulasMunicipales, aulasColegio, centro, siluetaCaldas } from "@/lib/aulas"
import { MapMotionToggle } from "@/components/map-motion-toggle"

// Mapa de la Red en estilo Blueprint + Neón nocturno (ver «Identidad visual y
// accesibilidad», tablero IV-04). SVG puro con animaciones CSS: sin WebGL ni
// librerías de mapas. `prefers-reduced-motion` y el botón de pausa detienen
// los pulsos y anillos.

const W = 800
const H = 600
const LON_MIN = -75.97
const LON_MAX = -74.45
const LAT_MIN = 4.8
const LAT_MAX = 5.82

function project([lon, lat]: [number, number]): [number, number] {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10]
}

export function RedMap() {
  const hub = project(centro.coordenadas)
  const silueta = siluetaCaldas.map((p) => project(p).join(",")).join(" ")
  // Los colegios de Manizales se dibujan en un anillo de detalle junto al nodo central.
  const colegios = aulasColegio.map((aula, i) => {
    const angle = (i / aulasColegio.length) * Math.PI * 2 - Math.PI / 2
    return { aula, x: hub[0] + Math.cos(angle) * 46, y: hub[1] + Math.sin(angle) * 46 }
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
          {`Manizales es el nodo central. ${aulasMunicipales.length} aulas municipales y ${aulasColegio.length} aulas de colegio están conectadas a él. La lista de aulas debajo del mapa tiene la misma información.`}
        </desc>
        <defs>
          <pattern id="grid-minor" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#16324c" strokeWidth="1" opacity="0.55" />
          </pattern>
          <pattern id="grid-major" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="url(#grid-minor)" />
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#16324c" strokeWidth="1" />
          </pattern>
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="60%" stopColor="#0b1726" stopOpacity="0" />
            <stop offset="100%" stopColor="#050b14" stopOpacity="0.85" />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill="url(#grid-major)" />
        <polygon points={silueta} className="red-map__silueta" />

        <g aria-hidden="true">
          {aulasMunicipales.map((aula, i) => {
            const [x, y] = project(aula.coordenadas)
            return (
              <g key={aula.slug}>
                <line x1={x} y1={y} x2={hub[0]} y2={hub[1]} className="red-map__line" />
                <line
                  x1={x}
                  y1={y}
                  x2={hub[0]}
                  y2={hub[1]}
                  className="red-map__pulse"
                  style={{ animationDelay: `${(i % 5) * 0.9}s` }}
                />
              </g>
            )
          })}
          <circle cx={hub[0]} cy={hub[1]} r="46" className="red-map__ring-static" />
          <circle cx={hub[0]} cy={hub[1]} r="30" className="red-map__ring" />
          <circle cx={hub[0]} cy={hub[1]} r="30" className="red-map__ring red-map__ring--late" />
        </g>

        {aulasMunicipales.map((aula) => {
          const [x, y] = project(aula.coordenadas)
          // Cerca del nodo central no hay espacio para el rótulo: el nombre sigue
          // en aria-label y en la lista de aulas.
          const showLabel = Math.hypot(x - hub[0], y - hub[1]) > 70
          const alignEnd = x > W - 140
          // Si otra aula queda justo a la derecha, el rótulo va debajo del punto.
          const crowded = aulasMunicipales.some((otra) => {
            if (otra.slug === aula.slug) return false
            const [ox, oy] = project(otra.coordenadas)
            return ox > x && ox - x < 90 && Math.abs(oy - y) < 24
          })
          return (
            <a key={aula.slug} href={`#aula-${aula.slug}`} aria-label={`${aula.nombre}, ${aula.municipio}`} className="red-map__node">
              <circle cx={x} cy={y} r="14" fill="transparent" />
              <circle cx={x} cy={y} r="7" className="red-map__dot" />
              <circle cx={x} cy={y} r="3" fill="#0b1726" />
              {showLabel && (
                <text
                  x={alignEnd ? x - 12 : x + 12}
                  y={crowded ? y + 24 : y - 10}
                  textAnchor={alignEnd ? "end" : "start"}
                  className="red-map__label"
                >
                  {aula.municipio.toUpperCase()}
                </text>
              )}
            </a>
          )
        })}

        {colegios.map(({ aula, x, y }) => (
          <a key={aula.slug} href={`#aula-${aula.slug}`} aria-label={`${aula.nombre}, aula de colegio en Manizales`} className="red-map__node">
            <rect x={x - 9} y={y - 9} width="18" height="18" fill="transparent" />
            <rect x={x - 5} y={y - 5} width="10" height="10" transform={`rotate(45 ${x} ${y})`} className="red-map__diamond" />
          </a>
        ))}

        <a href={`#aula-${centro.slug}`} aria-label={`${centro.nombre}, nodo central en Manizales`} className="red-map__node">
          <circle cx={hub[0]} cy={hub[1]} r="20" fill="#22d3ee" opacity="0.18" />
          <circle cx={hub[0]} cy={hub[1]} r="11" className="red-map__hub" />
          <circle cx={hub[0]} cy={hub[1]} r="4" fill="#ffffff" />
          <text x={hub[0]} y={hub[1] + 74} textAnchor="middle" className="red-map__label red-map__label--hub">
            MANIZALES · NODO CENTRAL
          </text>
        </a>

        <rect width={W} height={H} fill="url(#vignette)" pointerEvents="none" />
        <text x="16" y="26" className="red-map__label red-map__title">
          RED STEAM · CALDAS · BLUEPRINT + NEÓN
        </text>
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
        <span className="text-slate-400">Ubicación aproximada por municipio</span>
        <MapMotionToggle />
      </figcaption>
    </figure>
  )
}
