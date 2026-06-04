import type { Metadata } from "next"
import { ContactoClient } from "@/components/sections/contacto-client"

export const metadata: Metadata = {
  title: "Contacto | Centro de Prototipado",
  description:
    "Contacta al Centro de Prototipado para visitas académicas, capacitaciones y desarrollo de proyectos.",
}

export default function ContactoPage() {
  return <ContactoClient />
}
