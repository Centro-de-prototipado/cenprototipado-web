"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRightIcon, LayersIcon } from "lucide-react"

import { YoutubeIcon } from "@/components/ui/brand-icons"
import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { Reveal } from "@/components/ui/reveal"
import { TechHeading } from "@/components/ui/tech-heading"
import { Button } from "@/components/ui/button"
import { YouTubeFacade } from "@/components/ui/youtube-facade"
import type { YouTubePlaylist, YouTubeVideo } from "@/lib/institutional-data"
import { cn } from "@/lib/utils"

const ALL = "todas"

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

const formatDate = (iso: string): string => {
  if (!iso) return ""
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date)
}

export function AprendeClient({
  videos,
  playlists,
  channelUrl,
}: {
  videos: YouTubeVideo[]
  playlists: YouTubePlaylist[]
  channelUrl: string
}) {
  const [filter, setFilter] = useState(ALL)

  const filtered =
    filter === ALL
      ? videos
      : videos.filter((v) => v.playlistIds.includes(filter))

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <div className="absolute inset-0 opacity-40">
            <GridPattern
              className="size-full stroke-foreground/8"
              height={40}
              width={40}
              x={0}
            />
          </div>
          <div
            className="fx-aurora absolute top-0 right-0 h-full w-1/2 opacity-0 blur-[70px] dark:opacity-15"
            style={{
              background:
                "radial-gradient(ellipse at top right, var(--color-cyan-400), transparent 65%)",
            }}
          />
        </div>

        <div className="flex flex-col gap-5 border-b px-8 py-16 lg:border-r lg:border-b-0 lg:px-14 lg:py-20">
          <Reveal
            as="span"
            immediate
            index={0}
            className="inline-flex w-fit border bg-card px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase"
          >
            Aprende con nosotros · {videos.length} videos
          </Reveal>
          <Reveal
            as="h1"
            immediate
            index={1}
            className="m-0 text-4xl leading-[0.98] font-extrabold tracking-[-0.03em] text-balance text-foreground lg:text-[clamp(36px,5vw,72px)]"
          >
            Aprende a <span className="fx-accent text-primary">fabricar</span>{" "}
            paso a paso.
          </Reveal>
          <Reveal
            as="p"
            immediate
            index={2}
            className="m-0 max-w-[44ch] text-base leading-relaxed text-muted-foreground"
          >
            Guías en video del equipo del Centro: preparación de archivos,
            manejo de equipos y buenas prácticas para que llegues al taller con
            el trabajo adelantado.
          </Reveal>
          <Reveal as="div" immediate index={3} className="flex flex-wrap gap-3">
            <a href={channelUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                Ver el canal <YoutubeIcon data-icon="inline-end" />
              </Button>
            </a>
          </Reveal>
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      {/* ── Grid de videos ── */}
      <section className="relative border-b py-14 lg:py-16">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        {/* Cada playlist pública del canal es una categoría */}
        {playlists.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2 px-8 lg:px-16">
            <FilterChip
              label="Todas"
              count={videos.length}
              Icon={LayersIcon}
              active={filter === ALL}
              onClick={() => setFilter(ALL)}
            />
            {playlists.map((p) => (
              <FilterChip
                key={p.id}
                label={p.title}
                count={p.count}
                Icon={YoutubeIcon}
                active={filter === p.id}
                onClick={() => setFilter(p.id)}
              />
            ))}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between gap-3 px-8 lg:px-16">
          <span className="font-mono text-xs text-muted-foreground">
            {String(filtered.length).padStart(2, "0")} /{" "}
            {String(videos.length).padStart(2, "0")} videos
          </span>
          {filter !== ALL && (
            <button
              onClick={() => setFilter(ALL)}
              className="text-[11px] text-primary hover:underline"
            >
              Ver todos
            </button>
          )}
        </div>

        {videos.length === 0 ? (
          <p className="px-8 text-sm text-muted-foreground lg:px-16">
            Aún no hay tutoriales publicados. Muy pronto encontrarás aquí las
            guías del Centro.
          </p>
        ) : filtered.length === 0 ? (
          <p className="px-8 text-sm text-muted-foreground lg:px-16">
            No hay videos en esta lista.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 px-8 sm:grid-cols-2 lg:grid-cols-3 lg:px-16">
            {filtered.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} />
            ))}
          </div>
        )}

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden border-b bg-muted/30">
        <div
          aria-hidden="true"
          className="fx-grid-drift pointer-events-none absolute inset-0 hidden opacity-40 dark:block"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            WebkitMaskImage:
              "radial-gradient(ellipse at 80% 0%, black, transparent 75%)",
            maskImage:
              "radial-gradient(ellipse at 80% 0%, black, transparent 75%)",
          }}
        />
        <div className="relative z-1 grid grid-cols-1 gap-8 px-8 py-16 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-16">
          <Reveal as="div">
            <span className="fx-accent text-[11px] font-semibold tracking-[0.24em] text-primary uppercase">
              ¿Te quedaste con dudas?
            </span>
            <TechHeading
              as="h2"
              text="Del video al taller."
              className="mt-2.5 leading-[1.05] font-extrabold tracking-[-0.02em] text-foreground dark:text-white"
              style={{ fontSize: "clamp(26px,3.6vw,46px)" }}
            />
            <p className="mt-3.5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Escríbenos y coordinamos asesoría técnica para llevar tu proyecto
              a un prototipo real.
            </p>
          </Reveal>
          <Reveal as="div" index={1} className="flex flex-col gap-3">
            <Link href="/contacto">
              <Button size="lg" className="w-full">
                Escríbenos <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </Link>
            <Link href="/tecnologias">
              <Button variant="outline" size="lg" className="w-full">
                Ver tecnologías <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function FilterChip({
  label,
  count,
  Icon,
  active,
  onClick,
}: {
  label: string
  count: number
  Icon: React.ComponentType<{ className?: string }>
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 border px-3.5 py-2 text-xs font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
      )}
    >
      <Icon className="size-3.5" />
      {label}
      <span
        className={cn(
          "font-mono text-[10px]",
          active ? "opacity-80" : "opacity-55"
        )}
      >
        {count}
      </span>
    </button>
  )
}

function VideoCard({ video, index }: { video: YouTubeVideo; index: number }) {
  const published = formatDate(video.publishedAt)
  return (
    <Reveal
      as="article"
      index={index}
      className="fx-card group relative flex min-w-0 flex-col overflow-hidden border bg-card shadow-[4px_4px_0_0_rgba(0,0,0,0.06)] transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/50 dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.06)]"
    >
      <DecorIcon className="size-2" position="top-left" />

      <div className="border-b">
        <YouTubeFacade videoId={video.id} title={video.title} />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-6 pb-6">
        <div className="-mt-6 flex items-center justify-between gap-3">
          <div className="fx-icon relative z-10 flex h-12 w-12 items-center justify-center border bg-background text-primary shadow-[3px_3px_0_0_rgba(0,0,0,0.05)] dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.06)]">
            <YoutubeIcon className="size-5" />
          </div>
        </div>
        <h3 className="m-0 text-base font-bold text-balance text-foreground">
          {video.title}
        </h3>
        {video.description && (
          <p className="m-0 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {video.description}
          </p>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[11px] text-muted-foreground/70">
          {published}
        </span>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-primary hover:underline"
        >
          Ver en YouTube ↗
        </a>
      </div>
    </Reveal>
  )
}
