import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site-config"
import { getPortfolioSlugs } from "@/lib/notion/portfolio"

const STATIC_ROUTES = ["", "/centro", "/tecnologias", "/portafolio", "/contacto"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPortfolioSlugs()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }))

  const portfolioEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/portafolio/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticEntries, ...portfolioEntries]
}
