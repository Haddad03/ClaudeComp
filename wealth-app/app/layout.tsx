import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner"
import { ThemeApplier } from "@/components/layout/ThemeApplier"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "WealthWise – Smart Money for Everyone",
  description:
    "AI-powered financial tools for Canadians who don't have $1 million yet.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen antialiased">
        <ThemeApplier />
        <Navbar />
        <DisclaimerBanner />
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
