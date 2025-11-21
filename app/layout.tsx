import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { RecaptchaProvider } from "@/components/recaptcha-provider"
import { AuthProvider } from "@/lib/auth-context"
import { OffersProvider } from "@/lib/offers-context"
import { ExchangesProvider } from "@/lib/exchanges-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TruequeHub - Plataforma de Intercambios",
  description: "Intercambia productos y servicios de forma segura con búsqueda inteligente impulsada por IA",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <RecaptchaProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <OffersProvider>
                <ExchangesProvider>
                  {children}
                  <Toaster />
                  <Analytics />
                </ExchangesProvider>
              </OffersProvider>
            </AuthProvider>
          </ThemeProvider>
        </RecaptchaProvider>
      </body>
    </html>
  )
}
