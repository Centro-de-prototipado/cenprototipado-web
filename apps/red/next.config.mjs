/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exportación estática para Cloudflare Pages (salida en `out/`). Cuando la Red
  // necesite servidor (inicio de sesión, base de datos), migrar a
  // @opennextjs/cloudflare (Workers) y quitar esta línea.
  output: "export",
  logging: {
    browserToTerminal: true,
  },
}

export default nextConfig
