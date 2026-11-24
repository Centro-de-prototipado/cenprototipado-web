import { CALDAS_VIEWBOX, municipiosCaldas } from "@/lib/caldas-geo"

// Municipios con aula (mapa del panel; la lista completa vive en Supabase).
const CON_AULA = new Set([
  "Manizales",
  "Aguadas",
  "Belalcázar",
  "La Dorada",
  "Marmato",
  "Marquetalia",
  "Neira",
  "Pácora",
  "Palestina",
  "San José",
  "Victoria",
  "Villamaría",
])

export function MarcaRed({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="grid size-12 place-items-center bg-cyan-500 text-2xl font-extrabold text-neutral-950">
        R
      </span>
      <span className="leading-tight">
        <span className="block text-2xl font-extrabold">Red STEAM</span>
        <span className="block font-mono text-xs tracking-[0.3em] text-cyan-400">CALDAS</span>
      </span>
    </span>
  )
}

/**
 * Panel de marca de las páginas de cuenta de la Red: espejo del panel del Centro (marca arriba,
 * cita abajo) con el mapa de Caldas en estilo Blueprint + Neón en lugar de las líneas flotantes.
 */
export function PanelRed() {
  const { width: W, height: H } = CALDAS_VIEWBOX
  const hub = municipiosCaldas.find((m) => m.nombre === "Manizales")!.centro
  const nodos = municipiosCaldas.filter((m) => CON_AULA.has(m.nombre) && m.nombre !== "Manizales")

  return (
    <>
      {/* Fondo azul noche con retícula técnica */}
      <div className="absolute inset-0 bg-[#0b1726]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(#16324c 1px, transparent 1px), linear-gradient(90deg, #16324c 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0b1726]" />

      {/* Mapa de Caldas en neón */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 w-[115%] max-w-none -translate-x-1/2 -translate-y-[55%] opacity-90"
      >
        <g className="red-map__halo">
          {municipiosCaldas.map((m) => (
            <path key={m.codigo} d={m.d} />
          ))}
        </g>
        {municipiosCaldas.map((m) => (
          <path key={m.codigo} d={m.d} className={CON_AULA.has(m.nombre) ? "red-map__mpio red-map__mpio--aula" : "red-map__mpio"} />
        ))}
        {nodos.map((m, i) => (
          <g key={m.codigo}>
            <line x1={m.centro[0]} y1={m.centro[1]} x2={hub[0]} y2={hub[1]} className="red-map__line" />
            <line
              x1={m.centro[0]}
              y1={m.centro[1]}
              x2={hub[0]}
              y2={hub[1]}
              pathLength={100}
              className="red-map__pulse"
              style={{ animationDelay: `${(i % 6) * 0.8}s` }}
            />
            <circle cx={m.centro[0]} cy={m.centro[1]} r="7" className="red-map__dot" />
          </g>
        ))}
        <circle cx={hub[0]} cy={hub[1]} r="26" className="red-map__ring" />
        <circle cx={hub[0]} cy={hub[1]} r="26" className="red-map__ring red-map__ring--late" />
        <circle cx={hub[0]} cy={hub[1]} r="12" className="red-map__hub" />
        <circle cx={hub[0]} cy={hub[1]} r="4.5" fill="#ffffff" />
      </svg>

      <span className="relative text-white">
        <MarcaRed />
      </span>

      <div className="relative z-10 mt-auto text-white">
        <blockquote className="space-y-2">
          <p className="text-xl">
            &ldquo;Aulas STEAM conectadas en todo Caldas: equipos, saberes y proyectos que se comparten de un municipio a
            otro.&rdquo;
          </p>
          <footer className="font-mono text-sm font-semibold text-cyan-300">~ Red STEAM Caldas · Centro de Prototipado UNAL</footer>
        </blockquote>
      </div>
    </>
  )
}
