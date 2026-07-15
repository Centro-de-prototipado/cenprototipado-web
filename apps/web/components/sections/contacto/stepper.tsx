"use client"

import type { StepDef } from "@/lib/forms/steps"
import { cn } from "@/lib/utils"

export function Stepper({
  steps,
  current,
  onStepClick,
}: {
  steps: StepDef[]
  current: number
  onStepClick: (i: number) => void
}) {
  return (
    <nav aria-label="Progreso del formulario" className="flex flex-col gap-2">
      {/* Móvil: texto + barra */}
      <div className="flex items-center justify-between sm:hidden">
        <span className="text-xs font-semibold text-foreground">
          Paso {current + 1} de {steps.length}
        </span>
        <span className="text-xs text-muted-foreground">
          {steps[current]?.label}
        </span>
      </div>
      <div className="h-1 w-full bg-muted sm:hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((current + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Desktop: dots con etiquetas */}
      <ol className="hidden items-center gap-1 sm:flex">
        {steps.map((s, i) => {
          const done = i < current
          const active = i === current
          const clickable = i <= current
          return (
            <li key={s.id} className="flex flex-1 items-center gap-1">
              <button
                type="button"
                disabled={!clickable}
                aria-current={active ? "step" : undefined}
                onClick={() => clickable && onStepClick(i)}
                className={cn(
                  "flex items-center gap-2 text-left",
                  clickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center border text-xs font-semibold transition-colors",
                    active &&
                      "border-primary bg-primary text-primary-foreground",
                    done && "border-primary bg-primary/10 text-primary",
                    !active && !done && "border-border text-muted-foreground"
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <span className="h-px flex-1 bg-border" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
