import type { Metadata } from "next"
import { FormRecuperar } from "@cen/auth"
import { PaginaCuenta } from "@/components/cuenta/pagina-cuenta"

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false },
}

export default function Pagina() {
  return (
    <PaginaCuenta>
      <FormRecuperar />
    </PaginaCuenta>
  )
}
