import { CallToAction } from "@/components/sections/cta"
import { ContactSection } from "@/components/sections/contact-section"
import { FaqsSection } from "@/components/sections/faqs-page"
import { InstitutionalPreviewSection } from "@/components/sections/institutional-preview-section"
import { GallerySection } from "@/components/sections/gallery-section"
import { InstagramSection } from "@/components/sections/instagram-section"
import { PortfolioSection } from "../components/sections/portfolio-section"
import { TechnologiesSection } from "@/components/sections/technologies-section"

import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/sections/hero"

import { DecorIcon } from "@/components/ui/decor-icon"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute inset-y-0 left-1/2 hidden w-full max-w-6xl -translate-x-1/2 md:block">
          <div className="absolute inset-y-0 -left-4 w-px bg-border/80" />
          <div className="absolute inset-y-0 -left-8 w-px bg-border/40" />
          <div className="absolute inset-y-0 -right-4 w-px bg-border/80" />
          <div className="absolute inset-y-0 -right-8 w-px bg-border/40" />
        </div>
      </div>

      <div className="mx-auto">
        <Header />
        <main className="relative mx-auto w-full max-w-6xl bg-background/50">
          <div className="relative z-10 border-x">
            <HeroSection />
            <GallerySection />
            <InstitutionalPreviewSection />
            <TechnologiesSection />
            <PortfolioSection />
            <InstagramSection />
            <FaqsSection />
            <ContactSection />
            <CallToAction />
            <DecorIcon className="size-4" position="bottom-left" />
            <DecorIcon className="size-4" position="bottom-right" />
          </div>
        </main>
        <div className="mt-20">
          <Footer />
        </div>
      </div>
    </>
  )
}
