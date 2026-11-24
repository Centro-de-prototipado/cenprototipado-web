import type { Metadata } from "next"
import { FormRegistro } from "@cen/auth"
import { PaginaCuenta } from "@/components/cuenta/pagina-cuenta"

export const metadata: Metadata = {
  title: "Crear cuenta",
  robots: { index: false },
}

export default function Pagina() {
  return (
    <PaginaCuenta>
      <FormRegistro />
    </PaginaCuenta>
  )
}
