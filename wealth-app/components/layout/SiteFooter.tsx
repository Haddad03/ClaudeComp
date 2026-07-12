"use client"

import { useAppStore } from "@/store/appStore"

export function SiteFooter() {
  const { hasOnboarded, setActiveTab } = useAppStore()

  if (!hasOnboarded) return null

  return (
    <footer className="border-t border-[--border] bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
        <p>WealthWise — for educational purposes only, not financial advice.</p>
        <button
          onClick={() => setActiveTab("terms")}
          className="underline underline-offset-4 transition-colors hover:text-forest"
        >
          Terms &amp; Disclaimer
        </button>
      </div>
    </footer>
  )
}
