import Link from "next/link"
import { Logo } from "@/components/shared/logo"
import { getCurrentYear } from "@/components/layout/current-year"
import { DecorIcon } from "@/components/ui/decor-icon"

const nav = [
  { label: "El Centro", href: "/centro" },
  { label: "Tecnologías", href: "/tecnologias" },
  { label: "Portafolio", href: "/portafolio" },
  { label: "Contacto", href: "/contacto" },
]

const contact = [
  {
    label: "cenprototipado_man@unal.edu.co",
    href: "mailto:cenprototipado_man@unal.edu.co",
  },
  { label: "+57 (606) 887 9300", href: "tel:+576068879300" },
  { label: "Samoga · 2do piso · Manizales", href: "/contacto#mapa" },
  { label: "Lun–Vie · 8:00 – 17:00", href: "#" },
]

export async function Footer() {
  const year = await getCurrentYear()
  return (
    <footer className="relative border-t">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />

      {/* Main grid */}
      <div className="mx-auto w-full max-w-6xl border-x">
        <div className="grid grid-cols-1 gap-10 px-8 py-12 sm:grid-cols-[1.6fr_1fr_1fr] lg:px-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="w-fit">
              <Logo className="h-7" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Donde otros ven ideas, aquí las convertimos en prototipos.
              Fabricación digital, realidad inmersiva y robótica al servicio de
              la comunidad.
            </p>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              DIMA · UNAL Sede Manizales
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Navegación
            </p>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Contacto
            </p>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {contact.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-8 py-4 lg:px-16">
          <p className="text-xs text-muted-foreground">
            © {year} Centro de Prototipado · Universidad
            Nacional de Colombia
          </p>
          <p className="font-mono text-[11px] text-muted-foreground/60">
            Dirección de Investigación y Extensión – DIMA
          </p>
        </div>
      </div>
    </footer>
  )
}
