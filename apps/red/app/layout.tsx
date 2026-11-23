import "./globals.css"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { RED_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config"

// Misma fuente institucional que apps/web.
const ancizarFont = localFont({
  src: [{ path: "../fonts/AncizarSans-VariableFont_wght.ttf", style: "normal", weight: "400 900" }],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(RED_URL),
  title: { default: `${SITE_NAME} | Centro de Prototipado UNAL`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: { type: "website", locale: "es_CO", siteName: SITE_NAME, title: SITE_NAME, description: SITE_DESCRIPTION },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning className={cn("overflow-x-hidden antialiased", ancizarFont.variable, "font-sans")}>
      <body>
        <ThemeProvider>
          <a
            href="#contenido"
            className="sr-only z-50 bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
          >
            Saltar al contenido
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
