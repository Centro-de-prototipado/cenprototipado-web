import { describe, expect, test, beforeEach, vi } from "vitest"
import { loadDraft, saveDraft, clearDraft } from "@/lib/forms/draft"

// jsdom no está activo por defecto (environment: node); simulamos localStorage.
beforeEach(() => {
  const store: Record<string, string> = {}
  vi.stubGlobal("window", {})
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v
    },
    removeItem: (k: string) => {
      delete store[k]
    },
  })
})

describe("draft", () => {
  test("save + load round-trip", () => {
    saveDraft({ type: "servicios", step: 2, values: { nombre: "Ana" } })
    expect(loadDraft()).toEqual({
      type: "servicios",
      step: 2,
      values: { nombre: "Ana" },
    })
  })

  test("save excluye la firma", () => {
    saveDraft({
      type: "servicios",
      step: 1,
      values: { nombre: "Ana", firma: "data:image/png;base64,AAA" },
    })
    const d = loadDraft()
    expect(d?.values.firma).toBeUndefined()
    expect(d?.values.nombre).toBe("Ana")
  })

  test("clear elimina el borrador", () => {
    saveDraft({ type: "general", step: 0, values: { mensaje: "hola" } })
    clearDraft()
    expect(loadDraft()).toBeNull()
  })

  test("load devuelve null si el JSON es inválido", () => {
    localStorage.setItem("contacto-draft", "{ no json")
    expect(loadDraft()).toBeNull()
  })
})
