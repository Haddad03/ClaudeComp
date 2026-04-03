"use client"

import { useAppStore } from "@/store/appStore"
import { Card, CardContent } from "@/components/ui/card"
import { CATEGORY_COLORS } from "@/lib/categories"
import type { CategorizedTransaction, CategorySummary } from "@/lib/types"

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
    },
    {
      label: "Largest Category",
      value: topCategory?.category ?? "—",
      sub: topCategory ? `$${topCategory.total.toFixed(2)}` : "",
      color: topCategory
        ? `text-[${CATEGORY_COLORS[topCategory.category]}]`
        : "text-slate-400",
    },
    {
      label: "Avg per Transaction",
      value: `$${avgPerTx.toFixed(2)}`,
      sub: "per purchase",
      color: "text-cyan-400",
    },
    {
      label: "Categories Found",
      value: summaries.length.toString(),
      sub: "spending types",
      color: "text-emerald-400",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} className="border-[--border] bg-[--card]">
          <CardContent className="p-4">
            <p className="text-sm text-slate-400">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{s.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
