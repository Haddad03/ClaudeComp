"use client"

import { useAppStore } from "@/store/appStore"
import { Card, CardContent } from "@/components/ui/card"
import { CATEGORY_COLORS } from "@/lib/categories"
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
      color: "text-violet-400",
      icon: DollarSign,
      bgGradient: "from-violet-600/20 to-violet-600/5",
      borderColor: "border-violet-500/20",
    },
    {
      label: "Largest Category",
      value: topCategory?.category ?? "—",
      sub: topCategory ? `$${topCategory.total.toFixed(2)}` : "",
      color: "text-emerald-400",
      icon: TrendingUp,
      bgGradient: "from-emerald-600/20 to-emerald-600/5",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Avg per Transaction",
      value: `$${avgPerTx.toFixed(2)}`,
      sub: "per purchase",
      color: "text-cyan-400",
      icon: Zap,
      bgGradient: "from-cyan-600/20 to-cyan-600/5",
      borderColor: "border-cyan-500/20",
    },
    {
      label: "Categories Found",
      value: summaries.length.toString(),
      sub: "spending types",
      color: "text-blue-400",
      icon: Activity,
      bgGradient: "from-blue-600/20 to-blue-600/5",
      borderColor: "border-blue-500/20",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <Card key={s.label} className={`border-[--border] bg-gradient-to-br ${s.bgGradient} hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-400">{s.label}</p>
                  <p className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{s.sub}</p>
                </div>
                <div className={`rounded-lg p-2.5 bg-${s.color.split('-')[1]}-500/10`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
