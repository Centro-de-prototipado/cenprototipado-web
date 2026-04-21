import { HeroSection } from "@/components/sections/hero"
import { InstitutionalPreviewSection } from "@/components/sections/institutional-preview-section"
import { GallerySection } from "@/components/sections/gallery-section"
import { FeatureSection } from "@/components/sections/feature-section"
import { CasesSection } from "@/components/sections/cases-section"
import { CallToAction } from "@/components/sections/cta"
import { ContactSection } from "@/components/sections/contact-section"

export default function HomePage() {
  return (
    <div className="bg-background">
      <HeroSection />
      <InstitutionalPreviewSection />
      <GallerySection />
      <FeatureSection />
      <CasesSection />
      <ContactSection />
      <CallToAction />
    </div>
  )
}
