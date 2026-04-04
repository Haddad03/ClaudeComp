"use client"

import { useAppStore } from "@/store/appStore"
import { OverviewCards } from "./OverviewCards"
import { CategoryPieChart } from "./CategoryPieChart"
import { AISuggestionsPanel } from "../suggestions/AISuggestionsPanel"
import { Button } from "@/components/ui/button"
import { Upload, TrendingUp } from "lucide-react"

export function DashboardShell() {
  const { transactions, setActiveTab } = useAppStore()

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        {/* Hero icon */}
        <div className="relative">
          <div className="absolute -inset-20 rounded-full bg-lime/10 blur-3xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-forest shadow-lg">
            <TrendingUp className="h-10 w-10 text-lime" />
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-forest">
            Your money,{" "}
            <span className="bg-lime px-2 rounded-lg text-forest">
              finally clear
            </span>
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Upload a bank statement to get AI-powered spending insights, tax
            tips, and a personalised savings plan — no $1M required.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setActiveTab("upload")}
            className="gap-2 bg-lime text-forest hover:bg-lime-dark font-semibold shadow-sm"
          >
            <Upload className="h-4 w-4" />
            Upload Statement
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab("tax")}
            className="border-[--border] text-forest hover:bg-cream-dark"
          >
            Try Tax Simulator
          </Button>
        </div>

        {/* Feature cards */}
        <div className="mt-8 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          {[
            {
              icon: "🤖",
              title: "AI Categorization",
              desc: "Claude reads your transactions and sorts them instantly",
            },
            {
              icon: "📈",
              title: "Growth Projection",
              desc: "See how small savings snowball over time",
            },
            {
              icon: "🍁",
              title: "Canadian Tax Sim",
              desc: "Calculate your taxes and find RRSP/TFSA savings",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[--border] bg-card p-4 text-left hover:border-forest/20 hover:shadow-sm transition-all duration-300"
            >
              <div className="mb-2 text-2xl">{f.icon}</div>
              <div className="font-semibold text-forest">{f.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-forest">
          Your Financial Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          {transactions.length} transactions analysed • AI-powered insights
        </p>
      </div>
      <OverviewCards />
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryPieChart />
        <AISuggestionsPanel />
      </div>
    </div>
  )
}
