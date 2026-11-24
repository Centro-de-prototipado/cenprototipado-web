"use client"

import { Suspense, type ReactNode } from "react"
import Link from "next/link"
import { ChevronLeftIcon } from "lucide-react"
import { CuentaProvider } from "@cen/auth"
import { configCuenta } from "@/lib/cuenta-config"
import { Logo } from "@/components/shared/logo"

/** Marco de las páginas de cuenta del Centro (registro, recuperación, mi cuenta…). */
export function PaginaCuenta({ children }: { children: ReactNode }) {
  return (
    <CuentaProvider config={configCuenta}>
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <Link
          href="/"
          className="absolute top-6 left-5 inline-flex min-h-10 items-center gap-1 px-3 text-sm font-medium hover:bg-accent"
        >
          <ChevronLeftIcon className="size-4" aria-hidden="true" /> Inicio
        </Link>
        <Logo className="h-16" />
        <Suspense>{children}</Suspense>
      </main>
    </CuentaProvider>
  )
}

/** Solo el proveedor + Suspense, para insertar un formulario dentro de un diseño existente (/login). */
export function ConCuenta({ children }: { children: ReactNode }) {
  return (
    <CuentaProvider config={configCuenta}>
      <Suspense>{children}</Suspense>
    </CuentaProvider>
  )
}
