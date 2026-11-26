// Insignia del Centro: hexágono con el título de la charla o del curso. SVG puro, sirve
// en el servidor y en el navegador. Colores fijos (la insignia se ve igual en tema claro
// y oscuro, como una pieza gráfica).

/** Parte el título en líneas de hasta `max` caracteres, sin cortar palabras. */
function lineas(texto: string, max: number, tope: number) {
  const salida: string[] = []
  let actual = ""
  for (const palabra of texto.split(/\s+/)) {
    if ((actual + " " + palabra).trim().length > max && actual) {
      salida.push(actual)
      actual = palabra
    } else actual = (actual + " " + palabra).trim()
  }
  if (actual) salida.push(actual)
  if (salida.length > tope) {
    const cortadas = salida.slice(0, tope)
    cortadas[tope - 1] = cortadas[tope - 1].replace(/.{0,2}$/, "…")
    return cortadas
  }
  return salida
}

export function Insignia({
  titulo,
  tipo,
  horas,
  className,
}: {
  titulo: string
  tipo: "charla" | "curso"
  horas: number
  className?: string
}) {
  const filas = lineas(titulo.toUpperCase(), 16, 4)
  const alto = 22
  const y0 = 196 - ((filas.length - 1) * alto) / 2
  return (
    <svg
      viewBox="0 0 320 360"
      role="img"
      aria-label={`Insignia: ${titulo}`}
      className={className}
    >
      <defs>
        <linearGradient id="ins-fondo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b2a3f" />
          <stop offset="1" stopColor="#071521" />
        </linearGradient>
      </defs>
      {/* Hexágono exterior e interior */}
      <polygon
        points="160,8 306,92 306,268 160,352 14,268 14,92"
        fill="#06b6d4"
      />
      <polygon
        points="160,22 294,99 294,261 160,338 26,261 26,99"
        fill="url(#ins-fondo)"
      />
      <polygon
        points="160,34 283,105 283,255 160,326 37,255 37,105"
        fill="none"
        stroke="#22d3ee"
        strokeOpacity="0.45"
        strokeDasharray="3 5"
      />
      {/* Encabezado */}
      <text
        x="160"
        y="92"
        textAnchor="middle"
        fill="#67e8f9"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="12"
        letterSpacing="3"
      >
        CENTRO DE PROTOTIPADO
      </text>
      <text
        x="160"
        y="110"
        textAnchor="middle"
        fill="#94a3b8"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="10"
        letterSpacing="2"
      >
        UNAL · MANIZALES
      </text>
      <line
        x1="110"
        y1="126"
        x2="210"
        y2="126"
        stroke="#22d3ee"
        strokeOpacity="0.6"
      />
      {/* Título */}
      {filas.map((f, i) => (
        <text
          key={i}
          x="160"
          y={y0 + i * alto}
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="system-ui, sans-serif"
          fontWeight="800"
          fontSize="19"
        >
          {f}
        </text>
      ))}
      {/* Pie: tipo y horas */}
      <rect x="92" y="262" width="136" height="30" fill="#06b6d4" />
      <text
        x="160"
        y="282"
        textAnchor="middle"
        fill="#0b1726"
        fontFamily="system-ui, sans-serif"
        fontWeight="800"
        fontSize="13"
        letterSpacing="1"
      >
        {tipo === "curso" ? "CURSO" : "CHARLA"} ·{" "}
        {Number(horas).toLocaleString("es-CO")} H
      </text>
    </svg>
  )
}
