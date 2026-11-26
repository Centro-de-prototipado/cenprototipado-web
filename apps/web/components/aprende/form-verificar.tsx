"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FormVerificar() {
  const router = useRouter()
  const [codigo, setCodigo] = useState("")
  const [error, setError] = useState<string | null>(null)

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const limpio = codigo.trim().toUpperCase().replace(/\s+/g, "")
    if (!/^CP-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(limpio)) {
      setError(
        "El código tiene el formato CP-XXXX-XXXX, por ejemplo CP-7KQM-2HWD."
      )
      return
    }
    setError(null)
    router.push(`/verificar/${limpio}`)
  }

  return (
    <form onSubmit={enviar} noValidate className="flex max-w-md flex-col gap-2">
      <label htmlFor="codigo" className="text-sm font-semibold">
        Código del certificado
      </label>
      <div className="flex gap-2">
        <input
          id="codigo"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="CP-XXXX-XXXX"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "codigo-error" : undefined}
          className="min-h-11 flex-1 border border-input bg-background px-3 font-mono text-base uppercase outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <Button type="submit" size="lg" className="h-11">
          <SearchIcon data-icon="inline-start" /> Verificar
        </Button>
      </div>
      {error && (
        <p id="codigo-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  )
}
