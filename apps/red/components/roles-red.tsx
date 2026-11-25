"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSupabase } from "@cen/auth"

type Rol = { rol: "gestor" | "coordinador" | "admin"; aula: { nombre: string; slug: string } | null }

const ETIQUETA_ROL: Record<Rol["rol"], string> = {
  gestor: "Gestor de aula",
  coordinador: "Coordinación de la red",
  admin: "Administración",
}

/** Roles de la persona en la Red (tabla red.miembros). */
export function RolesRed({ userId }: { userId: string }) {
  const sb = useSupabase()
  const [roles, setRoles] = useState<Rol[]>([])

  useEffect(() => {
    sb.schema("red")
      .from("miembros")
      .select("rol, aula:aulas(nombre, slug)")
      .eq("user_id", userId)
      .then(({ data }) => setRoles((data as unknown as Rol[]) ?? []))
  }, [sb, userId])

  return (
    <section aria-labelledby="roles-titulo">
      <h2 id="roles-titulo" className="font-semibold">
        Tus roles en la Red
      </h2>
      <ul className="mt-2 space-y-2 text-sm">
        <li className="border p-3">Participante · puedes ver aulas, servicios y tus certificados.</li>
        {roles.map((r, i) => (
          <li key={i} className="border border-primary/40 p-3">
            {ETIQUETA_ROL[r.rol]}
            {r.aula && (
              <>
                {" · "}
                <Link href={`/aulas/${r.aula.slug}`} className="text-link underline">
                  {r.aula.nombre}
                </Link>
              </>
            )}
          </li>
        ))}
      </ul>
      {roles.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/mi-aula" className="inline-flex min-h-10 items-center border px-3 text-sm font-semibold hover:bg-accent">
            {roles.some((r) => r.rol !== "gestor") ? "Inventario de las aulas" : "Abrir mi aula"}
          </Link>
          {roles.some((r) => r.rol !== "gestor") && (
            <Link href="/coordinacion" className="inline-flex min-h-10 items-center border px-3 text-sm font-semibold hover:bg-accent">
              Gestionar roles
            </Link>
          )}
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground">Los roles de gestor los asigna la coordinación de la red.</p>
    </section>
  )
}
