import type { Metadata } from "next"
import { ContactoClient } from "@/components/sections/contacto-client"
import { getFaq } from "@/lib/notion/faq"

export const metadata: Metadata = {
  title: "Contacto | Centro de Prototipado",
  description:
    "Contacta al Centro de Prototipado para visitas académicas, capacitaciones y desarrollo de proyectos.",
}

export default async function ContactoPage() {
  const faq = await getFaq()
  return <ContactoClient faq={faq} />
}
