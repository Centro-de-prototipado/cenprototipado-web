import type { Metadata } from "next"
import { FormRestablecer } from "@cen/auth"
import { PaginaCuenta } from "@/components/cuenta/pagina-cuenta"

export const metadata: Metadata = { title: "Nueva contraseña", robots: { index: false } }

export default function Pagina() {
  return (
    <PaginaCuenta>
      <FormRestablecer />
    </PaginaCuenta>
  )
}
