import type { Metadata } from "next"
import { CuentaCentro } from "@/components/aprende/mis-certificados"
import { PaginaCuenta } from "@/components/cuenta/pagina-cuenta"

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false },
}

export default function Pagina() {
  return (
    <PaginaCuenta>
      <CuentaCentro />
    </PaginaCuenta>
  )
}
