import type React from "react"
import type { Metadata, Viewport } from "next"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { Providers } from "@/store/providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Axiom Pulse - Token Discovery Platform",
  description:
    "Real-time token discovery and trading platform. Track new pairs, final stretch tokens, and successful migrations.",
  keywords: ["crypto", "tokens", "trading", "solana", "defi", "pulse"]
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050505",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Providers>
          <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
