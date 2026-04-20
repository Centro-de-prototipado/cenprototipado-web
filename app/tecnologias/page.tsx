import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { TechnologiesSection } from "@/components/sections/technologies-section"

export default function TechnologiesPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Header />
      <main className="relative mx-auto w-full max-w-6xl overflow-x-hidden border-x">
        <TechnologiesSection />
      </main>
      <Footer />
    </div>
  )
}
