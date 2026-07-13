"use client"

import { useAppStore } from "@/store/appStore"
import { OverviewPage } from "@/components/overview/OverviewPage"
import { UploadSection } from "@/components/upload/UploadSection"
import { GrowthProjectionSection } from "@/components/growth/GrowthProjectionSection"
import { AccountsExplainer } from "@/components/accounts/AccountsExplainer"
import { TaxSimulator } from "@/components/tax/TaxSimulator"
import { NetWorthCalculator } from "@/components/networth/NetWorthCalculator"
import { TermsPage } from "@/components/layout/TermsPage"
import { LandingPage } from "@/components/landing/LandingPage"
import { HistoryPage } from "@/components/history/HistoryPage"

export default function Home() {
  const { activeTab, hasOnboarded } = useAppStore()

  // New user — go through intro + goal selection
  if (!hasOnboarded) {
    return <LandingPage />
  }

  return (
    <main className="min-h-[80vh] py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(activeTab === "home" || activeTab === "dashboard") && <OverviewPage />}
        {activeTab === "upload" && <UploadSection />}
        {activeTab === "growth" && <GrowthProjectionSection />}
        {activeTab === "accounts" && <AccountsExplainer />}
        {activeTab === "tax" && <TaxSimulator />}
        {activeTab === "networth" && <NetWorthCalculator />}
        {activeTab === "history" && <HistoryPage />}
        {activeTab === "terms" && <TermsPage />}
      </div>
    </main>
  )
}
