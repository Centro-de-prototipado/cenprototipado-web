import { HeroSection } from "@/components/sections/hero"
import { TickerStrip } from "@/components/sections/ticker-strip"
import { MetricsBand } from "@/components/sections/metrics-band"
import { FeatureSection } from "@/components/sections/feature-section"
import { GallerySection } from "@/components/sections/gallery-section"
import { CasesSection } from "@/components/sections/cases-section"
import { ContactSection } from "@/components/sections/contact-section"
import { CallToAction } from "@/components/sections/cta"
import { getTechnologies } from "@/lib/notion/technologies"
import { getMetrics, pickMetrics } from "@/lib/notion/metrics"

export default async function HomePage() {
  const [technologies, metrics] = await Promise.all([
    getTechnologies(),
    getMetrics(),
  ])

  return (
    <div className="bg-background">
      <HeroSection
        miniStats={pickMetrics(metrics, [
          "tecnologias",
          "proyectos",
          "aulas-stem",
          "municipios",
        ])}
      />
      <TickerStrip technologies={technologies} />
      <MetricsBand
        metrics={pickMetrics(metrics, [
          "tecnologias",
          "proyectos",
          "aulas-stem",
          "personas-formadas",
        ])}
      />
      <FeatureSection technologies={technologies} />
      <GallerySection />
      <CasesSection />
      <ContactSection />
      <CallToAction />
    </div>
  )
}
