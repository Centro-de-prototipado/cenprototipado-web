/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Hosts permitidos para la propiedad "Imagen" (URL externa permanente) en Notion.
    // Añade aquí el dominio de tu CDN/almacenamiento. NO uses "**" (riesgo de SSRF
    // vía el optimizador de imágenes). Ejemplos:
    //   { protocol: "https", hostname: "res.cloudinary.com" },
    //   { protocol: "https", hostname: "*.supabase.co" },
    remotePatterns: [
      // Notion proxied image endpoint (e.g. https://www.notion.so/image/....)
      { protocol: "https", hostname: "www.notion.so", pathname: "/image/**" },
      // Notion static files served via AWS S3 (common):
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com", pathname: "/secure.notion-static.com/**" },
      // Some Notion images use secure.notion-static.com directly
      { protocol: "https", hostname: "secure.notion-static.com", pathname: "/**" },
      // Cloudinary (used by some image URLs from Notion or external assets)
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
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
