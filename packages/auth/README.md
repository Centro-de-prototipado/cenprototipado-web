# @cen/auth — cuenta única del Centro y la Red STEAM

Una sola cuenta (Supabase Auth, proyecto «Red STEAM») para el sitio del Centro (`apps/web`) y la Red (`apps/red`). Cada sitio guarda su propia sesión; el **paso de sesión** permite entrar al otro sitio con un clic, sin volver a escribir la contraseña.

## Qué incluye

| Parte | Dónde |
| --- | --- |
| Formularios: ingresar, registro, recuperar, restablecer, mi cuenta | `src/ui/*` |
| Paso de sesión entre sitios (recibir `?token_hash` / enviar `?redirect_to`) | `src/ui/continuar.tsx` |
| Cliente de navegador, mensajes de error en español | `src/cliente.ts` |
| Perfiles (`public.perfiles`) y roles de la Red (`red.miembros`) | `supabase/migrations/` (ya aplicada) |
| Edge Function `paso-de-sesion` | `supabase/functions/` (ya desplegada) |

### Paso de sesión

1. En el sitio A (con sesión) se pide a la Edge Function un código de un solo uso para el sitio B.
2. La función valida el token y el destino (lista de orígenes permitidos) y genera un enlace mágico **sin enviar correo**.
3. El sitio B canjea el código (`verifyOtp`) y abre una sesión **nueva e independiente**. No se comparte el token de renovación entre sitios (compartirlo cerraría la sesión en ambos por la detección de reutilización de Supabase).

## Uso en una app

```tsx
// layout o página
<CuentaProvider config={configCuenta}>…</CuentaProvider>

// páginas (las que leen la URL van dentro de <Suspense>)
<FormIngresar /> <FormRegistro /> <FormRecuperar /> <FormRestablecer /> <MiCuenta /> <Continuar />
```

La app debe declarar `transpilePackages: ["@cen/auth"]` en `next.config.mjs` y `@source "../../../packages/auth/src";` en su `globals.css`.

## Configuración pendiente en el panel de Supabase

1. **Authentication → URL Configuration**
   - Site URL: `https://red-steam-caldas.pages.dev`
   - Redirect URLs: `https://red-steam-caldas.pages.dev/**`, `https://cenprototipado.vercel.app/**`, `http://localhost:3000/**`, `http://localhost:3001/**`
2. **Authentication → Emails → SMTP Settings**: activar SMTP propio con **Resend** (host `smtp.resend.com`, puerto `465`, usuario `resend`, contraseña = clave de API de Resend, remitente de un dominio verificado en Resend). Sin esto, Supabase solo envía unos pocos correos por hora.
3. **Authentication → Providers → Email**: mantener «Confirm email» activado.
4. (Opcional) **Authentication → Emails → Templates**: traducir al español los correos de confirmación y recuperación.

## Variables de entorno

- Ambas apps: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Red: `NEXT_PUBLIC_CENTRO_SSO=1` para mostrar «Continuar con mi sesión del sitio del Centro» (activar cuando el sitio del Centro tenga estas páginas desplegadas).
