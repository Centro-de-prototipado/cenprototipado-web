import type { ReactNode } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

// Tags de bloque de Notion Enhanced Markdown que rodeamos con líneas en blanco.
const BLOCK_TAGS =
  "callout|details|summary|columns|column|table|table_of_contents|colgroup|col|thead|tbody|tr|td|th"
const BLOCK_TAG_LINE = new RegExp(`^</?(?:${BLOCK_TAGS})(?:[\\s/>]|$)`)

// Notion (retrieveMarkdown) separa bloques con saltos simples y serializa los
// bloques sin sintaxis markdown nativa como tags tipo XML con hijos indentados
// por tabs. CommonMark trata <callout>…</callout> como un bloque HTML crudo: no
// parsea el markdown interno y, sin una línea en blanco de cierre, absorbe el
// contenido que le sigue. Normalizamos antes de renderizar:
//   1. quitamos los atributos de color `{color="…"}` (se normalizan al tema),
//   2. des-indentamos los tabs estructurales (un tab inicial = bloque de código),
//   3. rodeamos cada tag de bloque con líneas en blanco para que rehypeRaw
//      recomponga el árbol y el markdown interno (negritas, listas) se parsee.
function normalizeNotionMarkdown(md: string): string {
  const cleaned = md.replace(/[ \t]*\{(?:[a-zA-Z_-]+="[^"]*"\s*)+\}/g, "")
  const out: string[] = []
  for (const rawLine of cleaned.split("\n")) {
    const line = rawLine.replace(/^\t+/, "")
    if (BLOCK_TAG_LINE.test(line)) {
      if (out.length && out[out.length - 1].trim() !== "") out.push("")
      out.push(line, "")
    } else {
      out.push(line)
    }
  }
  return out.join("\n")
}

// Sanitización tras rehypeRaw: el contenido viene de Notion (confiable), pero
// evitamos que HTML pegado por un editor inyecte <script>/on*/javascript:.
// Extendemos el schema por defecto con los tags Enhanced Markdown que usamos.
const schema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "callout",
    "columns",
    "column",
    "table_of_contents",
    "details",
    "summary",
  ],
  attributes: {
    ...defaultSchema.attributes,
    callout: ["icon"],
  },
}

// Props para los renderers de tags XML de Notion (no cubiertos por `Components`).
type RawProps = { node?: unknown; children?: ReactNode }

// Notion (retrieveMarkdown) emite "Enhanced Markdown": además de GFM, usa tags
// tipo XML para bloques sin sintaxis markdown nativa (callout, toggle, columns,
// table, table_of_contents, span con color). rehypeRaw los convierte en nodos
// reales para poder estilizarlos. Los atributos de color de Notion se ignoran
// (normalizamos al tema del sitio); esta función limpia el ruido `{color="…"}`.
const hasClass = (node: unknown, name: string): boolean => {
  const cls = (node as { properties?: { className?: unknown } } | undefined)
    ?.properties?.className
  return Array.isArray(cls) && cls.includes(name)
}

const components = {
  // ── Encabezados (Notion sólo tiene h1–h3; h4–h6 por si llegan vía raw) ──
  h1: ({ children }) => (
    <h2 className="mt-8 mb-3 text-2xl font-extrabold tracking-[-0.015em] text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h3 className="mt-7 mb-3 text-xl font-bold tracking-[-0.01em] text-foreground first:mt-0">
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-6 mb-2 text-lg font-bold text-foreground first:mt-0">
      {children}
    </h4>
  ),
  h4: ({ children }) => (
    <h5 className="mt-5 mb-2 text-base font-bold text-foreground first:mt-0">
      {children}
    </h5>
  ),
  h5: ({ children }) => (
    <h6 className="mt-4 mb-2 text-sm font-bold text-foreground first:mt-0">
      {children}
    </h6>
  ),
  h6: ({ children }) => (
    <p className="mt-4 mb-2 text-sm font-bold text-foreground first:mt-0">
      {children}
    </p>
  ),

  // ── Texto ──
  p: ({ children }) => <p className="my-4 first:mt-0">{children}</p>,
  a: ({ children, href }) => (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => (
    <del className="text-muted-foreground line-through">{children}</del>
  ),
  // `<span color="…">`: ignoramos el color, sólo conservamos el texto.
  span: ({ children }) => <span>{children}</span>,

  // ── Listas ──
  ul: ({ children }) => (
    <ul className="my-4 flex list-none flex-col gap-2 p-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 flex list-decimal flex-col gap-2 pl-5">{children}</ol>
  ),
  li: ({ node, children }) =>
    // to_do (`- [ ]` / `- [x]`): conserva el checkbox sin la flecha decorativa.
    hasClass(node, "task-list-item") ? (
      <li className="flex list-none items-start gap-2">{children}</li>
    ) : (
      <li className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0 text-primary">→</span>
        <span>{children}</span>
      </li>
    ),
  input: ({ checked }) => (
    <input
      type="checkbox"
      checked={checked}
      disabled
      className="mt-1.5 size-4 shrink-0 accent-primary"
    />
  ),

  // ── Código ──
  code: ({ children }) => (
    <code className="border bg-muted/40 px-1.5 py-0.5 font-mono text-sm text-foreground">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto border bg-muted/40 p-4 font-mono text-sm text-foreground [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0">
      {children}
    </pre>
  ),

  // ── Cita ──
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-primary pl-4 text-foreground/80 italic">
      {children}
    </blockquote>
  ),

  // ── Divisor ──
  hr: () => <hr className="my-8 border-border" />,

  // ── Imagen (caption = alt) ──
  img: ({ src, alt }) => (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={typeof src === "string" ? src : ""}
        alt={alt ?? ""}
        loading="lazy"
        className="w-full border border-border"
      />
      {alt && (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  // ── Tabla (Notion emite <table> con header-row; estilizamos 1ª fila) ──
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm [&_tr:first-child]:font-bold [&_tr:first-child]:text-foreground">
        {children}
      </table>
    </div>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-border last:border-0">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-bold text-foreground">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-left align-top">{children}</td>
  ),

  // ── Bloques Enhanced Markdown (tags XML de Notion) ──
  callout: ({ node, children }: RawProps) => {
    const icon = (node as { properties?: { icon?: string } } | undefined)
      ?.properties?.icon
    return (
      <div className="my-4 flex gap-3 border border-border bg-muted/30 p-4 [&>div>*:first-child]:mt-0 [&>div>*:last-child]:mb-0">
        {icon && (
          <span className="shrink-0 text-lg leading-7" aria-hidden>
            {icon}
          </span>
        )}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    )
  },
  // Toggle: <details>/<summary> nativos (expandible sin JS).
  details: ({ children }: RawProps) => (
    <details className="group my-4 border border-border px-4 py-3 [&[open]>summary]:mb-2">
      {children}
    </details>
  ),
  summary: ({ children }: RawProps) => (
    <summary className="cursor-pointer font-medium text-foreground marker:text-primary">
      {children}
    </summary>
  ),
  // Columnas: stack en móvil, lado a lado en md+ (soporta N columnas).
  columns: ({ children }: RawProps) => (
    <div className="my-4 flex flex-col gap-6 md:flex-row">{children}</div>
  ),
  column: ({ children }: RawProps) => <div className="min-w-0 flex-1">{children}</div>,
  // Tabla de contenidos: auto-generada por Notion; la omitimos.
  table_of_contents: () => null,
} as Components

// Render del cuerpo markdown de Notion con estilos del sistema.
export function Markdown({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "max-w-[68ch] text-base leading-relaxed text-muted-foreground",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
        components={components}
      >
        {normalizeNotionMarkdown(children)}
      </ReactMarkdown>
    </div>
  )
}
