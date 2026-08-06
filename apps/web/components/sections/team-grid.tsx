import Image from "next/image"

import { Reveal } from "@/components/ui/reveal"
import type { TeamMember } from "@/lib/institutional-data"

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
    >
      {members.map((m, i) => (
        <Reveal
          as="article"
          key={m.name}
          index={i}
          className="group overflow-hidden border bg-card dark:border-white/12 dark:bg-white/5"
        >
          <div
            className="relative"
            style={{ aspectRatio: "4/5", overflow: "hidden" }}
          >
            <Image
              src={m.portrait}
              alt={m.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 45vw, 200px"
            />
          </div>
          <div className="border-t p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="m-0 text-sm font-bold text-foreground">{m.name}</p>
                <p className="m-0 mt-1 text-xs text-muted-foreground">{m.role}</p>
              </div>
              {m.linkedin && (
                <a
                  aria-label={`LinkedIn de ${m.name}`}
                  className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                  href={m.linkedin}
                  rel="noreferrer"
                  target="_blank"
                >
                  <LinkedinIcon className="size-4" />
                </a>
              )}
            </div>
            {m.bio && (
              <p className="m-0 mt-1.5 text-xs leading-relaxed text-muted-foreground/80">
                {m.bio}
              </p>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  )
}
