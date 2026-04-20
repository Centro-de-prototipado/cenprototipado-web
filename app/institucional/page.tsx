import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { InstitutionalSection } from "@/components/sections/institutional-section"

export default function InstitutionalPage() {
  return (
    <>
      <Header />
      <main className="relative mx-auto w-full max-w-6xl border-x bg-background/60">
        <InstitutionalSection />
      </main>
      <Footer />
    </>
  )
}
