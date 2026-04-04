"use client"

import { useAppStore } from "@/store/appStore"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { UploadSection } from "@/components/upload/UploadSection"
import { GrowthProjectionSection } from "@/components/growth/GrowthProjectionSection"
import { AccountsExplainer } from "@/components/accounts/AccountsExplainer"
import { TaxSimulator } from "@/components/tax/TaxSimulator"
import { TermsPage } from "@/components/layout/TermsPage"
import { LandingPage } from "@/components/landing/LandingPage"

export default function Home() {
  const { activeTab, hasOnboarded } = useAppStore()

  if (!hasOnboarded) {
    return <LandingPage />
  }

  return (
    <main className="min-h-[80vh] bg-gradient-to-b from-[--background] to-[--background] py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {activeTab === "dashboard" && <DashboardShell />}
        {activeTab === "upload" && <UploadSection />}
        {activeTab === "growth" && <GrowthProjectionSection />}
        {activeTab === "accounts" && <AccountsExplainer />}
        {activeTab === "tax" && <TaxSimulator />}
        {activeTab === "terms" && <TermsPage />}
      </div>
    </main>
  )
}
