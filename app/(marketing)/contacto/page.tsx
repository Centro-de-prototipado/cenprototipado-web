import { ContactSection } from "@/components/sections/contact-section"
import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { MapPinIcon, MailIcon, PhoneIcon } from "lucide-react"

export const metadata = {
  title: "Contacto | Centro de Prototipado",
  description:
    "Contacta al Centro de Prototipado para visitas académicas, capacitaciones y desarrollo de proyectos.",
}

const highlights = [
  {
    icon: MapPinIcon,
    label: "Ubicación",
    value: "Museo Interactivo Samoga, segundo piso · Manizales",
  },
  {
    icon: MailIcon,
    label: "Correo",
    value: "cenprototipado_man@unal.edu.co",
  },
  {
    icon: PhoneIcon,
    label: "Teléfono",
    value: "+57 321 851 4862",
  },
]

export default function ContactoPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b px-12 py-20 md:px-16 md:py-28">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div className="pointer-events-none absolute inset-0 opacity-30">
          <GridPattern
            className="absolute inset-0 size-full stroke-foreground/15"
            height={40}
            width={40}
            x={0}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-0 size-72 translate-x-1/3 rounded-none bg-primary/8 blur-3xl"
        />

        <div className="relative mx-auto max-w-5xl space-y-8">
          <div className="space-y-4">
            <p className="inline-flex w-fit items-center rounded-none border bg-card/80 px-3 py-1 text-xs tracking-[0.24em] text-muted-foreground uppercase backdrop-blur">
              Comunícate con nosotros
            </p>
            <h1 className="max-w-2xl text-4xl leading-tight font-black text-balance md:text-6xl lg:text-7xl">
              Contacto
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Resolvemos dudas sobre visitas académicas, capacitaciones y
              desarrollo de proyectos. Escríbenos o visítanos directamente.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 border bg-card/80 p-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.06)] backdrop-blur dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.06)]"
              >
                <div className="flex size-8 shrink-0 items-center justify-center border bg-background">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground/70 uppercase">
                    {label}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-foreground">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      <ContactSection />
    </>
  )
}
