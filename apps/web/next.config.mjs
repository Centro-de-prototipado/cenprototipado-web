/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Hosts permitidos para la propiedad "Imagen" (URL externa permanente) en Notion.
    // Añade aquí el dominio de tu CDN/almacenamiento. NO uses "**" (riesgo de SSRF
    // vía el optimizador de imágenes). Ejemplos:
    //   { protocol: "https", hostname: "res.cloudinary.com" },
    //   { protocol: "https", hostname: "*.supabase.co" },
    remotePatterns: [],
  },
  logging: {
    browserToTerminal: true,
    // 'error' — errors only (default)
    // 'warn'  — warnings and errors
    // true    — all console output
    // false   — disabled
  },
  cacheComponents: true,
}

export default nextConfig
