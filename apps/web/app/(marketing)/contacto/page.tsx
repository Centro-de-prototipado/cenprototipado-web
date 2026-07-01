import type { Metadata } from "next"
import { ContactoClient } from "@/components/sections/contacto-client"
import { getFaq } from "@/lib/notion/faq"
import { getConfig } from "@/lib/notion/config"

export const metadata: Metadata = {
  title: "Contacto | Centro de Prototipado",
  description:
    "Contacta al Centro de Prototipado para visitas académicas, capacitaciones y desarrollo de proyectos.",
}

export default async function ContactoPage() {
  const [faq, config] = await Promise.all([getFaq(), getConfig()])
  return <ContactoClient config={config} faq={faq} />
}
