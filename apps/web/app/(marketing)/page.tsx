import { HeroSection } from "@/components/sections/hero"
import { TickerStrip } from "@/components/sections/ticker-strip"
import { MetricsBand } from "@/components/sections/metrics-band"
import { FeatureSection } from "@/components/sections/feature-section"
import { GallerySection } from "@/components/sections/gallery-section"
import { CasesSection } from "@/components/sections/cases-section"
import { ContactSection } from "@/components/sections/contact-section"
import { CallToAction } from "@/components/sections/cta"

export default function HomePage() {
  return (
    <div className="bg-background">
      <HeroSection />
      <TickerStrip />
      <MetricsBand />
      <FeatureSection />
      <GallerySection />
      <CasesSection />
      <ContactSection />
      <CallToAction />
    </div>
  )
}
