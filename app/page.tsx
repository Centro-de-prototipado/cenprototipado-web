import { CallToAction } from "@/components/sections/cta"
import { ContactSection } from "@/components/sections/contact-section"
import { FaqsSection } from "@/components/sections/faqs-page"
import { FeatureSection } from "@/components/sections/feature-section"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/sections/hero"

import { DecorIcon } from "@/components/ui/decor-icon"

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 dark:hidden"
        style={{
          backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
          `,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(226, 232, 240, 0.07) 2px, rgba(226, 232, 240, 0.07) 3px, transparent 3px, transparent 9px),
            repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(203, 213, 225, 0.06) 2px, rgba(203, 213, 225, 0.06) 3px, transparent 3px, transparent 9px),
            repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(148, 163, 184, 0.05) 2px, rgba(148, 163, 184, 0.05) 3px, transparent 3px, transparent 9px),
            repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(100, 116, 139, 0.04) 2px, rgba(100, 116, 139, 0.04) 3px, transparent 3px, transparent 9px)
          `,
        }}
      />
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
        <div className="overflow-x-hidden">
          <main className="relative mx-auto w-full max-w-6xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            />
            <div className="relative z-10 border-x">
              <HeroSection />
              <FeatureSection />
              {/* <TestimonialsSection /> */}
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
      </div>
    </div>
  )
}
