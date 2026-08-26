const GROUPS = 3

/**
 * Fondo decorativo de líneas. Sin JS por frame: las 36 rutas se rasterizan una
 * sola vez y el movimiento vive en `transform` + `opacity` sobre 3 grupos, que
 * son las dos únicas propiedades que el compositor puede animar sin repintar.
 *
 * (La versión anterior animaba `pathLength`/`pathOffset` con motion/react, lo
 * que reescribía `stroke-dasharray` en las 72 rutas en cada frame y forzaba un
 * repintado completo del SVG — de ahí el parpadeo.)
 */
export function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-primary"
        fill="none"
        viewBox="0 0 696 316"
      >
        <title>Background Paths</title>
        {Array.from({ length: GROUPS }, (_, group) => (
          <g
            className="fx-floating-path"
            key={group}
            style={{
              animationDuration: `${18 + group * 5}s, ${26 + group * 7}s`,
              animationDelay: `${group * -3.5}s, ${group * -5}s`,
            }}
          >
            {paths
              .filter((path) => path.id % GROUPS === group)
              .map((path) => (
                <path
                  d={path.d}
                  key={path.id}
                  stroke="currentColor"
                  strokeOpacity={0.1 + path.id * 0.03}
                  strokeWidth={path.width}
                />
              ))}
          </g>
        ))}
      </svg>
    </div>
  )
}
