import Image from "next/image"
import { PlayIcon } from "lucide-react"

import { embedUrlFromPost } from "@/lib/instagram/media"
import { InstagramIcon } from "@/components/ui/brand-icons"
import { ReelPlayer } from "@/components/ui/reel-player"
import { DecorIcon } from "@/components/ui/decor-icon"
import { Reveal } from "@/components/ui/reveal"
import { TechHeading } from "@/components/ui/tech-heading"
import { Button } from "@/components/ui/button"
import { SectionCarousel } from "@/components/ui/section-carousel"
import type { InstagramPost } from "@/lib/institutional-data"

/**
 * Posts destacados de Instagram, curados en Notion y renderizados con nuestro
 * propio diseño: nada de `embed.js` de Meta, que impone su chrome visual, no
 * respeta el dark mode y mete cookies de terceros en cada visita a la home.
 */
export function InstagramStrip({
  posts,
  handle,
}: {
  posts: InstagramPost[]
  handle: string
}) {
  if (posts.length === 0) return null

  const profileUrl = handle
    ? `https://www.instagram.com/${handle.replace(/^@/, "")}/`
    : ""

  return (
    <section className="relative w-full border-b" id="instagram">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />

      <Reveal
        as="div"
        className="flex flex-col gap-6 px-8 py-14 lg:flex-row lg:items-end lg:justify-between lg:px-16 lg:py-16"
      >
        <div>
          <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Síguenos
          </span>
          <TechHeading
            as="h2"
            text="Lo último del Centro."
            className="mt-3.5 max-w-2xl text-3xl leading-[1.05] font-extrabold tracking-[-0.015em] text-balance text-foreground md:text-5xl"
          />
          <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Talleres, prototipos recién salidos de la impresora y lo que pasa
            día a día en el laboratorio.
          </p>
        </div>
        {profileUrl && (
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg">
              <InstagramIcon data-icon="inline-start" />{" "}
              {handle.startsWith("@") ? handle : `@${handle}`}
            </Button>
          </a>
        )}
      </Reveal>

      <div className="border-t px-8 py-10 lg:px-16">
        <SectionCarousel>
          {posts.map((post, index) => (
            <PostCard key={post.url} post={post} index={index} />
          ))}
        </SectionCarousel>
      </div>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}

function PostCard({ post, index }: { post: InstagramPost; index: number }) {
  // Sin shortcode reconocible no hay embed posible: la tarjeta se queda como
  // imagen que enlaza a Instagram.
  const embedUrl = embedUrlFromPost(post.url)
  return (
    <article className="group relative min-w-64 snap-start overflow-hidden border bg-card shadow-[4px_4px_0_0_rgba(0,0,0,0.06)] transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/50 md:min-w-72 dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.06)]">
      <div className="relative aspect-[4/5]">
        {embedUrl ? (
          <ReelPlayer
            embedUrl={embedUrl}
            poster={post.image}
            caption={post.caption}
            className="absolute inset-0"
          />
        ) : (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 block overflow-hidden bg-muted"
          >
            <Image
              src={post.image}
              alt={post.caption}
              fill
              sizes="(max-width: 768px) 80vw, 288px"
              priority={index === 0}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {post.caption && (
              <span className="pointer-events-none absolute inset-x-0 bottom-0 block bg-gradient-to-t from-black/85 via-black/25 to-transparent px-4 pt-10 pb-4 text-xs leading-relaxed text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="line-clamp-3">{post.caption}</span>
              </span>
            )}
          </a>
        )}
        {post.type === "reel" && (
          <span className="pointer-events-none absolute top-3 right-3 z-10 flex items-center gap-1 border bg-background/85 px-2 py-1 font-mono text-[10px] tracking-[0.06em] text-primary backdrop-blur-sm">
            <PlayIcon className="size-2.5 fill-current" /> REEL
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 border-t px-4 py-3">
        <span className="font-mono text-[11px] text-muted-foreground/70">
          {post.type === "reel" ? "Reel" : "Post"}
        </span>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-primary hover:underline"
        >
          Ver en Instagram ↗
        </a>
      </div>
    </article>
  )
}
