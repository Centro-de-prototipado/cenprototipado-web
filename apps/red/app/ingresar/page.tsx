import type { Metadata } from "next"
import { FormIngresar } from "@cen/auth"
import { PaginaCuenta } from "@/components/cuenta/pagina-cuenta"

export const metadata: Metadata = { title: "Ingresar", robots: { index: false } }

export default function Pagina() {
  return (
    <PaginaCuenta>
      <FormIngresar />
    </PaginaCuenta>
  )
}
