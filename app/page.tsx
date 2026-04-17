import { CallToAction } from "@/components/sections/cta"
import { ContactSection } from "@/components/sections/contact-section"
import { FaqsSection } from "@/components/sections/faqs-page"
import { FeatureSection } from "@/components/sections/feature-section"
import { GallerySection } from "@/components/sections/gallery-section"
import { InstagramSection } from "@/components/sections/instagram-section"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/sections/hero"

import { DecorIcon } from "@/components/ui/decor-icon"

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
        style={{
          backgroundImage: `
            radial-gradient(circle 1500px at 0% 400px, color-mix(in oklch, var(--primary) 8%, transparent), transparent 40%),
            radial-gradient(circle 1500px at 100% 400px, color-mix(in oklch, var(--primary) 8%, transparent), transparent 40%)
          `,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 dark:hidden"
        style={{
          backgroundImage: `
          repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.01) 1px, transparent 1px, transparent 10px),
          repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.01) 1px, transparent 1px, transparent 10px)
        `,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.03) 0, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 0, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 20px)
          `,
          backgroundSize: "40px 40px",
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
              <GallerySection />
              <InstagramSection />
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
