import Image from "next/image"
import { LinkIcon } from "lucide-react"

import { Reveal } from "@/components/ui/reveal"
import type { TeamMember } from "@/lib/institutional-data"

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
                  <LinkIcon className="size-4" />
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
