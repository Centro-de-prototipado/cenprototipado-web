import type { PageObjectResponse } from "@notionhq/client"

// Helpers para extraer valores de propiedades de una página de Notion.
type Props = PageObjectResponse["properties"]

export const getTitle = (props: Props, name: string): string => {
  const p = props[name]
  return p?.type === "title" ? p.title.map((t) => t.plain_text).join("") : ""
}

export const getRichText = (props: Props, name: string): string => {
  const p = props[name]
  return p?.type === "rich_text"
    ? p.rich_text.map((t) => t.plain_text).join("")
    : ""
}

export const getSelect = (props: Props, name: string): string => {
  const p = props[name]
  return p?.type === "select" ? (p.select?.name ?? "") : ""
}

export const getMultiSelect = (props: Props, name: string): string[] => {
  const p = props[name]
  return p?.type === "multi_select" ? p.multi_select.map((o) => o.name) : []
}

export const getNumber = (props: Props, name: string): number | null => {
  const p = props[name]
  return p?.type === "number" ? p.number : null
}

export const getCheckbox = (props: Props, name: string): boolean => {
  const p = props[name]
  return p?.type === "checkbox" ? p.checkbox : false
}

export const getUrl = (props: Props, name: string): string => {
  const p = props[name]
  return p?.type === "url" ? (p.url ?? "") : ""
}

// Texto multilínea → lista (una entrada por línea no vacía).
export const getMultilineList = (props: Props, name: string): string[] =>
  getRichText(props, name)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
