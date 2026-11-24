import type { Metadata } from "next"
import { CuentaRed } from "@/components/cuenta-red"
import { PaginaCuenta } from "@/components/cuenta/pagina-cuenta"

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false } }

export default function Pagina() {
  return (
    <PaginaCuenta>
      <CuentaRed />
    </PaginaCuenta>
  )
}
