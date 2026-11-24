import { cn } from "@/lib/utils"

// Cruz decorativa en las esquinas de los bloques, igual que en el sitio del Centro.
const posiciones = {
  "top-left": "top-0 left-0 -translate-x-[calc(50%+0.5px)] -translate-y-[calc(50%+0.5px)]",
  "top-right": "top-0 right-0 translate-x-[calc(50%+0.5px)] -translate-y-[calc(50%+0.5px)]",
  "bottom-right": "right-0 bottom-0 translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]",
  "bottom-left": "bottom-0 left-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]",
}

export function DecorIcon({ position, className }: { position: keyof typeof posiciones; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute z-50 size-3 shrink-0 stroke-foreground/60 stroke-1", posiciones[position], className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
