import Link from "next/link"
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, ArrowRightIcon } from "lucide-react"
import { DecorIcon } from "@/components/ui/decor-icon"
import { Reveal } from "@/components/ui/reveal"
import { Button } from "@/components/ui/button"
import { getConfig } from "@/lib/notion/config"
import { cn } from "@/lib/utils"

export async function ContactSection() {
  const config = await getConfig()
  const contactItems = [
    { Icon: MailIcon,   label: "Correo",   value: config["contacto-email"],    href: `mailto:${config["contacto-email"]}` },
    { Icon: PhoneIcon,  label: "Teléfono", value: config["contacto-telefono"], href: `tel:${config["contacto-telefono"]?.replace(/\s/g, "")}` },
    { Icon: MapPinIcon, label: "Sede",     value: config["contacto-sede"],     href: "/contacto#mapa" },
    { Icon: ClockIcon,  label: "Horario",  value: config["contacto-horario"],  href: "#" },
  ].filter((c) => c.value)
  const hasContactItems = contactItems.length > 0
  return (
    <section className="relative w-full border-b" id="contacto">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />

      <div className={cn("grid grid-cols-1", hasContactItems && "lg:grid-cols-2")}>
        {/* Left: copy + CTAs */}
        <Reveal
          as="div"
          className={cn(
            "flex flex-col justify-center gap-5 px-8 py-14 lg:px-14 lg:py-16",
            hasContactItems && "border-b lg:border-r lg:border-b-0"
          )}
        >
          <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">Hablemos</span>
          <h2 className="m-0 text-3xl font-extrabold leading-[1.05] tracking-[-0.015em] text-balance text-foreground md:text-4xl">
            ¿Tienes una idea o proyecto?
          </h2>
          <p className="m-0 max-w-md text-sm leading-relaxed text-muted-foreground">
            Coordinamos asesoría técnica, talleres, reservas de equipo y proyectos colaborativos con la comunidad académica y aliados externos.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contacto">
              <Button size="lg">Contactar al Centro <ArrowRightIcon data-icon="inline-end" /></Button>
            </Link>
            <Link href="/contacto">
              <Button variant="outline" size="lg">Reservar equipo</Button>
            </Link>
          </div>
        </Reveal>

        {/* Right: contact info */}
        {hasContactItems && (
        <div className="flex flex-col">
          {contactItems.map(({ Icon, label, value, href }, i) => (
            <Reveal
              as="a"
              index={i}
              key={label}
              href={href}
              className="group grid items-center gap-4 border-b px-8 py-5 transition-colors last:border-b-0 hover:bg-muted/30 lg:px-10"
              style={{ gridTemplateColumns: "40px 1fr" }}
            >
              <div className="flex h-10 w-10 items-center justify-center border bg-background text-primary transition-colors group-hover:border-primary">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="m-0 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
                <p className="m-0 mt-0.5 text-sm font-medium text-foreground">{value}</p>
              </div>
            </Reveal>
          ))}
        </div>
        )}
      </div>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
