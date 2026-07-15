"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function SignaturePad({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (dataUrl: string) => void
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [hasInk, setHasInk] = useState(Boolean(value))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.strokeStyle = "#111"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
  }, [])

  useEffect(() => {
    if (value !== "") return
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height)
    setHasInk(false)
  }, [value])

  const pos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const start = (e: React.PointerEvent) => {
    drawing.current = true
    const ctx = canvasRef.current!.getContext("2d")!
    const { x, y } = pos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext("2d")!
    const { x, y } = pos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasInk(true)
  }
  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    onChange(canvasRef.current!.toDataURL("image/png"))
  }
  const clear = () => {
    const canvas = canvasRef.current!
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height)
    setHasInk(false)
    onChange("")
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <canvas
        ref={canvasRef}
        width={480}
        height={140}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        onPointerCancel={end}
        className="w-full touch-none border bg-white"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {hasInk ? "Firma capturada" : "Dibuja tu firma en el recuadro"}
        </span>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-primary underline"
        >
          Limpiar
        </button>
      </div>
    </div>
  )
}
