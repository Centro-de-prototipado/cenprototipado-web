import { cacheLife } from "next/cache"

// El año se cachea para poder incluirlo en el HTML prerenderizado bajo Cache
// Components (leer la hora actual sin cachear lanza next-prerender-current-time).
// Se refresca en cada build/revalidación, suficiente para un año de copyright.
export async function getCurrentYear() {
  "use cache"
  cacheLife("max")
  return new Date().getFullYear()
}
