import type { Aula } from "@/lib/red-data"
import {
  MANIZALES_PX_POR_KM,
  MANIZALES_VIEWBOX,
  comunasManizales,
  corregimientosManizales,
  perimetroUrbano,
  proyectarManizales,
} from "@/lib/manizales-geo"

// Vista ampliada de Manizales: corregimientos, perímetro urbano y comunas (límites de
// OpenStreetMap) con las aulas de colegio y el nodo central en su ubicación real.
// Mismo estilo Blueprint + Neón y mismo tamaño de lienzo que el mapa de Caldas.

const { width: W, height: H } = MANIZALES_VIEWBOX

/** Nombre corto para el rótulo: sin «IE» ni «Rural», con «Instituto» abreviado. */
const corto = (nombre: string) =>
  nombre
    .replace(/^IE\s+/, "")
    .replace(/^Rural\s+/, "")
    .replace(/^Instituto Técnico\s+/, "Inst. Téc. ")
    .replace(/^Instituto\s+/, "Inst. ")

type Caja = { x: number; y: number; w: number; h: number }
/** Área en que se pisan dos cajas (0 si no se tocan). */
const cruce = (a: Caja, b: Caja) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))

/** Ubica cada rótulo alrededor de su punto en la posición que menos pisa a los demás
 *  (prefiere derecha e izquierda; luego arriba, abajo y en diagonal). */
function rotular(puntos: { x: number; y: number; texto: string }[], ocupadas: Caja[]) {
  const ANCHO_LETRA = 6.9
  const ALTO = 13
  // Primero los puntos con más vecinos cerca, que tienen menos opciones.
  const orden = puntos
    .map((p, i) => ({ i, vecinos: puntos.filter((q) => Math.hypot(q.x - p.x, q.y - p.y) < 60).length }))
    .sort((a, b) => b.vecinos - a.vecinos)
  const resultado: { tx: number; ty: number; anchor: "start" | "end" | "middle"; caja: Caja }[] = []
  for (const { i } of orden) {
    const { x, y, texto } = puntos[i]
    const w = texto.length * ANCHO_LETRA
    const der = (dy: number) => ({ tx: x + 12, ty: y + 4 + dy, anchor: "start" as const, caja: { x: x + 10, y: y - 8 + dy, w, h: ALTO } })
    const izq = (dy: number) => ({ tx: x - 12, ty: y + 4 + dy, anchor: "end" as const, caja: { x: x - 10 - w, y: y - 8 + dy, w, h: ALTO } })
    const opciones = [
      der(0),
      izq(0),
      { tx: x, ty: y - 13, anchor: "middle" as const, caja: { x: x - w / 2, y: y - 25, w, h: ALTO } },
      { tx: x, ty: y + 22, anchor: "middle" as const, caja: { x: x - w / 2, y: y + 10, w, h: ALTO } },
      der(-12),
      izq(-12),
      der(12),
      izq(12),
    ]
    // Penaliza un poco las posiciones menos naturales para desempatar.
    const costo = (o: (typeof opciones)[number], k: number) => ocupadas.reduce((s, c) => s + cruce(c, o.caja), 0) + k * 0.5
    const elegida = opciones.reduce((mejor, o, k) => (costo(o, k) < costo(mejor.o, mejor.k) ? { o, k } : mejor), { o: opciones[0], k: 0 }).o
    ocupadas.push(elegida.caja)
    resultado[i] = elegida
  }
  return resultado
}

/** Arco suave hacia arriba entre dos puntos. */
function arco([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  const dist = Math.hypot(x2 - x1, y2 - y1) || 1
  const lift = Math.min(60, dist * 0.25)
  let nx = -(y2 - y1) / dist
  let ny = (x2 - x1) / dist
  if (ny > 0) {
    nx = -nx
    ny = -ny
  }
  const mx = (x1 + x2) / 2 + nx * lift
  const my = (y1 + y2) / 2 + ny * lift
  return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`
}

export function MapaManizalesSvg({ aulas }: { aulas: Aula[] }) {
  const centro = aulas.find((a) => a.tipo === "centro")
  const colegios = aulas.filter((a) => a.tipo === "colegio")
  const ubicados = colegios.filter((a) => a.lat != null && a.lon != null)
  const hub: [number, number] =
    centro?.lat != null && centro.lon != null ? proyectarManizales(centro.lat, centro.lon) : [W / 2, H / 2]

  const puntos = ubicados.map((aula) => {
    const [x, y] = proyectarManizales(aula.lat!, aula.lon!)
    return { aula, x, y, texto: corto(aula.nombre).toUpperCase() }
  })
  // El nodo central y su rótulo se reservan primero (repetidos: pisarlos cuesta el triple).
  const zonaCentro: Caja[] = [
    { x: hub[0] - 18, y: hub[1] - 18, w: 36, h: 36 },
    { x: hub[0] - 95, y: hub[1] + 22, w: 190, h: 14 },
  ]
  const ocupadas: Caja[] = [
    ...zonaCentro,
    ...zonaCentro,
    ...zonaCentro,
    ...puntos.map((p) => ({ x: p.x - 7, y: p.y - 7, w: 14, h: 14 })),
  ]
  const rotulos = rotular(puntos, ocupadas)
  const escalaKm = 2
  const escalaPx = escalaKm * MANIZALES_PX_POR_KM

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="mz-title mz-desc" className="block h-auto w-full">
      <title id="mz-title">Mapa de Manizales con las aulas de colegio</title>
      <desc id="mz-desc">
        {`Manizales con sus comunas y corregimientos. El Centro de Prototipado es el nodo central y ${ubicados.length} aulas de colegio aparecen en su ubicación. La lista de aulas debajo del mapa tiene la misma información.`}
      </desc>
      <defs>
        <pattern id="mz-grid-minor" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#16324c" strokeWidth="0.8" opacity="0.5" />
        </pattern>
        <pattern id="mz-grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#mz-grid-minor)" />
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#1d3f5e" strokeWidth="1" />
        </pattern>
        <radialGradient id="mz-vignette" cx="50%" cy="50%" r="72%">
          <stop offset="55%" stopColor="#0b1726" stopOpacity="0" />
          <stop offset="100%" stopColor="#040a12" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="mz-hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="url(#mz-grid)" />

      {/* Zona rural: corregimientos. */}
      <g aria-hidden="true">
        {corregimientosManizales.map((z) => (
          <path key={z.nombre} d={z.d} className="red-map__mpio" />
        ))}
        {corregimientosManizales.map(
          (z) =>
            z.centro && (
              <text key={z.nombre} x={z.centro[0]} y={z.centro[1]} textAnchor="middle" className="red-map__mpio-label">
                {z.nombre.toUpperCase()}
              </text>
            )
        )}
      </g>

      {/* Zona urbana: halo del perímetro y comunas. */}
      <g aria-hidden="true" className="red-map__halo">
        <path d={perimetroUrbano} />
      </g>
      <g aria-hidden="true">
        {comunasManizales.map((z) => (
          <path key={z.nombre} d={z.d} className="red-map__mpio red-map__mpio--aula red-map__comuna" />
        ))}
        {comunasManizales.map(
          (z) =>
            z.centro && (
              <text key={z.nombre} x={z.centro[0]} y={z.centro[1]} textAnchor="middle" className="red-map__mpio-label red-map__comuna-label">
                {z.nombre.toUpperCase()}
              </text>
            )
        )}
      </g>

      {/* Conexiones de cada colegio con el nodo central. */}
      <g aria-hidden="true">
        {puntos.map(({ aula, x, y }, i) => {
          const d = arco([x, y], hub)
          return (
            <g key={aula.slug}>
              <path d={d} className="red-map__line red-map__line--fina" />
              <path d={d} pathLength={100} className="red-map__pulse" style={{ animationDelay: `${(i % 6) * 0.8}s` }} />
            </g>
          )
        })}
        <circle cx={hub[0]} cy={hub[1]} r="60" fill="url(#mz-hub-glow)" />
        <circle cx={hub[0]} cy={hub[1]} r="22" className="red-map__ring" />
        <circle cx={hub[0]} cy={hub[1]} r="22" className="red-map__ring red-map__ring--late" />
      </g>

      {/* Aulas de colegio. */}
      {puntos.map(({ aula, x, y }, i) => {
        const r = rotulos[i]
        return (
          <a
            key={aula.slug}
            href={`/aulas/${aula.slug}`}
            aria-label={`${aula.nombre}${aula.ubicacion_aproximada ? ", ubicación aproximada" : ""}`}
            className="red-map__node"
          >
            <rect x={x - 11} y={y - 11} width="22" height="22" fill="transparent" />
            {aula.ubicacion_aproximada && <circle cx={x} cy={y} r="12" className="red-map__aprox" />}
            <rect x={x - 5.5} y={y - 5.5} width="11" height="11" transform={`rotate(45 ${x} ${y})`} className="red-map__diamond" />
            <text x={r.tx} y={r.ty} textAnchor={r.anchor} className="red-map__label red-map__label--colegio">
              {corto(aula.nombre).toUpperCase()}
            </text>
          </a>
        )
      })}

      {/* Nodo central. */}
      {centro && (
        <a href={`/aulas/${centro.slug}`} aria-label={`${centro.nombre}, nodo central`} className="red-map__node">
          <circle cx={hub[0]} cy={hub[1]} r="11" className="red-map__hub" />
          <circle cx={hub[0]} cy={hub[1]} r="4" fill="#ffffff" />
          <text x={hub[0]} y={hub[1] + 32} textAnchor="middle" className="red-map__label red-map__label--hub">
            CENTRO DE PROTOTIPADO
          </text>
        </a>
      )}

      <rect width={W} height={H} fill="url(#mz-vignette)" pointerEvents="none" />

      {/* Rótulos técnicos. */}
      <g aria-hidden="true">
        <text x="20" y="34" className="red-map__label red-map__title">
          MANIZALES · NODO CENTRAL
        </text>
        <text x="20" y="52" className="red-map__coord">
          12 COMUNAS · 7 CORREGIMIENTOS · {ubicados.length + 1} NODOS
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
  )
}
