import type { FormType } from "@/lib/forms/schemas"

export const DRAFT_KEY = "contacto-draft"

export type DraftState = {
  type: FormType
  step: number
  values: Record<string, unknown>
}

const hasStorage = () =>
  typeof window !== "undefined" && typeof localStorage !== "undefined"

export function saveDraft(state: DraftState): void {
  if (!hasStorage()) return
  // Nunca persistir la firma (imagen grande y sensible).
  const values = { ...state.values }
  delete values.firma
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...state, values }))
  } catch {
    // Cuota llena o storage no disponible: ignorar (el borrador es best-effort).
  }
}

export function loadDraft(): DraftState | null {
  if (!hasStorage()) return null
  const raw = localStorage.getItem(DRAFT_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object" || !parsed.type) return null
    return parsed as DraftState
  } catch {
    return null
  }
}

export function clearDraft(): void {
  if (!hasStorage()) return
  localStorage.removeItem(DRAFT_KEY)
}
