"use client"

import { MiCuenta } from "@cen/auth"
import { RolesRed } from "@/components/roles-red"

export function CuentaRed() {
  return <MiCuenta>{(userId) => <RolesRed userId={userId} />}</MiCuenta>
}
