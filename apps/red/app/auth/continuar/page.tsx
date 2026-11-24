import type { Metadata } from "next"
import { Continuar } from "@cen/auth"
import { PaginaCuenta } from "@/components/cuenta/pagina-cuenta"

export const metadata: Metadata = { title: "Continuando tu sesión", robots: { index: false } }

export default function Pagina() {
  return (
    <PaginaCuenta>
      <Continuar />
    </PaginaCuenta>
  )
}
