import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { DecorIcon } from "@/components/ui/decor-icon"
import { MailIcon, PhoneIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const contactInfo = [
  {
    icon: <MailIcon className="size-5" />,
    label: "Correo",
    value: "centroprototipado_man@unal.edu.co",
  },
  {
    icon: <PhoneIcon className="size-5" />,
    label: "Teléfono",
    value: "+57 (606) 887 9300",
  },
]

export function ContactSection() {
  return (
    <section className="relative w-full border-b">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />

      {/* Header */}
      <div className="border-b px-12 py-20 md:px-16 md:py-30">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl lg:font-black">
            Contacta al Centro de Prototipado
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Si necesitas más información sobre las Aulas STEM y STEAM, completa
            el formulario y te contactaremos.
          </p>
          <p className="text-xs text-muted-foreground md:text-sm">
            Nuestro equipo responde en el menor tiempo posible.
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="relative grid w-full md:grid-cols-2">
        {/* Left Column - Contact Info */}
        <div className="md:border-r">
          {contactInfo?.map((info, idx) => (
            <ContactInfo key={info.label} index={idx} {...info} />
          ))}
        </div>

        {/* Right Column - Contact Form */}
        <div className="px-12 py-10 md:px-16 md:py-12">
          <ContactForm />
        </div>
      </div>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}

function ContactForm() {
  return (
    <form className="w-full">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="full-name">Nombre completo</FieldLabel>
          <Input autoComplete="off" id="full-name" placeholder="Tu nombre" />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
          <Input
            autoComplete="off"
            id="email"
            placeholder="tu.correo@ejemplo.com"
            type="email"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
          <Input
            autoComplete="off"
            id="phone"
            placeholder="+57 300 123 4567"
            type="tel"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="message">Mensaje</FieldLabel>
          <Textarea
            autoComplete="off"
            id="message"
            placeholder="Cuéntanos tu solicitud"
          />
        </Field>
      </FieldGroup>
      <Button className="mt-6 w-full" type="button">
        Enviar solicitud
      </Button>
    </form>
  )
}

type ContactInfoProps = {
  icon: React.ReactNode
  label: string
  value: string
  index: number
}

function ContactInfo({ icon, label, value }: ContactInfoProps) {
  return (
    <div
      className={cn(
        "group relative border-b bg-background px-12 py-6 transition-colors hover:bg-muted/20 md:px-16 md:py-8"
      )}
    >
      <DecorIcon
        className="size-1.5 opacity-0 transition-opacity group-hover:opacity-100"
        position="top-left"
      />
      <DecorIcon
        className="size-1.5 opacity-0 transition-opacity group-hover:opacity-100"
        position="top-right"
      />
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-md border bg-background">
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {label}
          </p>
          <p className="text-sm font-medium">{value}</p>
        </div>
      </div>
      <DecorIcon
        className="size-1.5 opacity-0 transition-opacity group-hover:opacity-100"
        position="bottom-left"
      />
      <DecorIcon
        className="size-1.5 opacity-0 transition-opacity group-hover:opacity-100"
        position="bottom-right"
      />
    </div>
  )
}
