"use client"

import { useAppStore } from "@/store/appStore"
import { Card, CardContent } from "@/components/ui/card"
import type { CategorizedTransaction, CategorySummary } from "@/lib/types"
import { DollarSign, TrendingUp, Activity, Zap } from "lucide-react"

const EXCLUDED_FROM_SPENDING = new Set(["Card Payment", "Transfers", "Investments"])

function buildSummaries(
  transactions: CategorizedTransaction[]
): CategorySummary[] {
  const totals: Record<string, { total: number; count: number }> = {}
  let grandTotal = 0

  for (const tx of transactions) {
    if (!totals[tx.category]) totals[tx.category] = { total: 0, count: 0 }
    totals[tx.category].total += tx.amount
    totals[tx.category].count += 1
    if (!EXCLUDED_FROM_SPENDING.has(tx.category)) grandTotal += tx.amount
  }

  return Object.entries(totals).map(([category, { total, count }]) => ({
    category: category as CategorySummary["category"],
    total,
    count,
    percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
  }))
}

export function OverviewCards() {
  const { transactions } = useAppStore()
  const summaries = buildSummaries(transactions)
  const grandTotal = transactions
    .filter((t) => !EXCLUDED_FROM_SPENDING.has(t.category))
    .reduce((s, t) => s + t.amount, 0)
  const topCategory = summaries.sort((a, b) => b.total - a.total)[0]
  const avgPerTx = transactions.length ? grandTotal / transactions.length : 0

  const stats = [
    {
      label: "Total Spending",
      value: `$${grandTotal.toFixed(2)}`,
      sub: `${transactions.length} transactions`,
      icon: DollarSign,
    },
    {
      label: "Largest Category",
      value: topCategory?.category ?? "—",
      sub: topCategory ? `$${topCategory.total.toFixed(2)}` : "",
      icon: TrendingUp,
    },
    {
      label: "Avg per Transaction",
      value: `$${avgPerTx.toFixed(2)}`,
      sub: "per purchase",
      icon: Zap,
    },
    {
      label: "Categories Found",
      value: summaries.length.toString(),
      sub: "spending types",
      icon: Activity,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <Card key={s.label} className="border-[--border] bg-card hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                  <p className="mt-2 text-3xl font-bold text-forest">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
                </div>
                <div className="rounded-xl p-2.5 bg-forest">
                  <Icon className="h-5 w-5 text-lime" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
