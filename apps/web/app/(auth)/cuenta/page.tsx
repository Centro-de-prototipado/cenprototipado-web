import type { Metadata } from "next"
import { MiCuenta } from "@cen/auth"
import { PaginaCuenta } from "@/components/cuenta/pagina-cuenta"

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false },
}

export default function Pagina() {
  return (
    <PaginaCuenta>
      <MiCuenta />
    </PaginaCuenta>
  )
}
