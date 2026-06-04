import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

// Render de Markdown (cuerpo de página de Notion) con estilos del sistema.
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
        components={{
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
          ul: ({ children }) => (
            <ul className="my-4 flex list-none flex-col gap-2 p-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 flex list-decimal flex-col gap-2 pl-5">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-primary">→</span>
              <span>{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          code: ({ children }) => (
            <code className="border bg-muted/40 px-1.5 py-0.5 font-mono text-sm text-foreground">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-primary pl-4 text-foreground/80 italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
