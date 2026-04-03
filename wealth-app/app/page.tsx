"use client"

import { useAppStore } from "@/store/appStore"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { UploadSection } from "@/components/upload/UploadSection"
import { GrowthProjectionSection } from "@/components/growth/GrowthProjectionSection"
import { AccountsExplainer } from "@/components/accounts/AccountsExplainer"
import { TaxSimulator } from "@/components/tax/TaxSimulator"
import { TermsPage } from "@/components/layout/TermsPage"

export default function Home() {
  const { activeTab } = useAppStore()

  return (
    <div className="min-h-[80vh]">
      {activeTab === "dashboard" && <DashboardShell />}
      {activeTab === "upload" && <UploadSection />}
      {activeTab === "growth" && <GrowthProjectionSection />}
      {activeTab === "accounts" && <AccountsExplainer />}
      {activeTab === "tax" && <TaxSimulator />}
      {activeTab === "terms" && <TermsPage />}
    </div>
  )
}
