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
        {/* Gradient hero */}
        <div className="relative">
          <div className="absolute -inset-20 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-600/20 ring-1 ring-violet-500/30">
            <TrendingUp className="h-10 w-10 text-violet-400" />
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Your money,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              finally clear
            </span>
          </h1>
          <p className="mt-3 max-w-md text-slate-400">
            Upload a bank statement to get AI-powered spending insights, tax
            tips, and a personalised savings plan — no $1M required.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setActiveTab("upload")}
            className="gap-2 bg-violet-600 hover:bg-violet-700"
          >
            <Upload className="h-4 w-4" />
            Upload Statement
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab("tax")}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
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
              className="rounded-xl border border-[--border] bg-[--card] p-4 text-left"
            >
              <div className="mb-2 text-2xl">{f.icon}</div>
              <div className="font-semibold text-white">{f.title}</div>
              <div className="mt-1 text-sm text-slate-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Your Financial Dashboard</h2>
        <p className="text-slate-400">
          {transactions.length} transactions analysed
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
