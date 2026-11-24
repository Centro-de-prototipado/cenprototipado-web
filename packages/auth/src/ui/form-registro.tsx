"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useConfigCuenta } from "../config"
import { mensajeError, useSupabase } from "../cliente"
import { Aviso, BotonPrincipal, Campo, PanelCuenta, enlace } from "./formulario"

type Errores = Partial<
  Record<"nombre" | "correo" | "contrasena" | "confirmar", string>
>

export function FormRegistro() {
  const { sitio, rutas } = useConfigCuenta()
  const sb = useSupabase()
  const [errores, setErrores] = useState<Errores>({})
  const [error, setError] = useState<string | null>(null)
  const [enviado, setEnviado] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const datos = new FormData(e.currentTarget)
    const nombre = String(datos.get("nombre")).trim()
    const correo = String(datos.get("correo")).trim()
    const contrasena = String(datos.get("contrasena"))
    const confirmar = String(datos.get("confirmar"))

    const nuevos: Errores = {}
    if (nombre.length < 3) nuevos.nombre = "Escribe tu nombre completo."
    if (!/^\S+@\S+\.\S+$/.test(correo))
      nuevos.correo =
        "Escribe un correo válido, por ejemplo nombre@dominio.com."
    if (contrasena.length < 8)
      nuevos.contrasena = "La contraseña debe tener al menos 8 caracteres."
    if (confirmar !== contrasena)
      nuevos.confirmar = "Las contraseñas no coinciden."
    setErrores(nuevos)
    if (Object.keys(nuevos).length) return

    setEnviando(true)
    setError(null)
    const { data, error } = await sb.auth.signUp({
      email: correo,
      password: contrasena,
      options: {
        data: { nombre },
        emailRedirectTo: `${window.location.origin}${rutas.cuenta}?bienvenida=1`,
      },
    })
    setEnviando(false)
    if (error) return setError(mensajeError(error))
    // Supabase no revela si el correo ya existía: devuelve un usuario sin identidades.
    if (data.user && data.user.identities?.length === 0)
      return setError(mensajeError("User already registered"))
    setEnviado(correo)
  }

  if (enviado) {
    return (
      <PanelCuenta sitio={sitio} titulo="Revisa tu correo">
        <Aviso tipo="exito">
          Te enviamos un enlace a <strong>{enviado}</strong> para confirmar tu
          cuenta. Ábrelo desde este mismo navegador. Si no llega en unos
          minutos, revisa la carpeta de spam.
        </Aviso>
        <p className="mt-6 text-sm">
          <Link href={rutas.ingresar} className={enlace}>
            Volver a ingresar
          </Link>
        </p>
      </PanelCuenta>
    )
  }

  return (
    <PanelCuenta
      sitio={sitio}
      titulo="Crear cuenta"
      descripcion="Con una sola cuenta usas el sitio del Centro y la Red STEAM."
    >
      <form onSubmit={enviar} className="space-y-4" noValidate>
        {error && <Aviso tipo="error">{error}</Aviso>}
        <Campo
          id="nombre"
          etiqueta="Nombre completo"
          autoComplete="name"
          required
          error={errores.nombre}
        />
        <Campo
          id="correo"
          etiqueta="Correo electrónico"
          type="email"
          autoComplete="email"
          required
          error={errores.correo}
        />
        <Campo
          id="contrasena"
          etiqueta="Contraseña"
          type="password"
          autoComplete="new-password"
          required
          error={errores.contrasena}
          ayuda="Mínimo 8 caracteres."
        />
        <Campo
          id="confirmar"
          etiqueta="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          required
          error={errores.confirmar}
        />
        <BotonPrincipal type="submit" disabled={enviando}>
          {enviando ? "Creando cuenta…" : "Crear cuenta"}
        </BotonPrincipal>
        <p className="text-xs text-muted-foreground">
          Al registrarte aceptas el tratamiento de tus datos personales para
          usar la plataforma (Ley 1581 de 2012).
        </p>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href={rutas.ingresar} className={enlace}>
          Ingresa
        </Link>
      </p>
    </PanelCuenta>
  )
}
