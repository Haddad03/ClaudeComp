"use client"

import { useAppStore } from "@/store/appStore"
import { HomePage } from "@/components/home/HomePage"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { UploadSection } from "@/components/upload/UploadSection"
import { GrowthProjectionSection } from "@/components/growth/GrowthProjectionSection"
import { AccountsExplainer } from "@/components/accounts/AccountsExplainer"
import { TaxSimulator } from "@/components/tax/TaxSimulator"
import { TermsPage } from "@/components/layout/TermsPage"
import { LandingPage } from "@/components/landing/LandingPage"
import { HistoryPage } from "@/components/history/HistoryPage"
import { AuthPage } from "@/components/auth/AuthPage"

export default function Home() {
  const { activeTab, hasOnboarded, currentUser } = useAppStore()

  // Returning user who got logged out — show auth directly
  if (!currentUser && hasOnboarded) {
    return <AuthPage />
  }

  // New user — go through intro + goal selection + auth
  if (!hasOnboarded) {
    return <LandingPage />
  }

  return (
    <main className="min-h-[80vh] py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {activeTab === "home" && <HomePage />}
        {activeTab === "dashboard" && <DashboardShell />}
        {activeTab === "upload" && <UploadSection />}
        {activeTab === "growth" && <GrowthProjectionSection />}
        {activeTab === "accounts" && <AccountsExplainer />}
        {activeTab === "tax" && <TaxSimulator />}
        {activeTab === "history" && <HistoryPage />}
        {activeTab === "terms" && <TermsPage />}
      </div>
    </main>
  )
}
