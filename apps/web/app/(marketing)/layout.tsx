import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl border-x bg-background/60">
        {children}
      </main>
      <Footer />
    </>
  )
}
