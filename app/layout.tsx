import "./globals.css"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import localFont from "next/font/local"

const ancizarFont = localFont({
  src: [
    {
      path: "../fonts/AncizarSans-VariableFont_wght.ttf",
      style: "normal",
      weight: "400 900",
    },
  ],
  variable: "--font-sans",
  display: "swap",
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", ancizarFont.variable, "font-sans")}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <div className="relative min-h-screen w-full overflow-hidden bg-background">
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
              {children}
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
