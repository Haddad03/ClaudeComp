"use client"

import { useState } from "react"
import { useAppStore } from "@/store/appStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Trash2, Save, CalendarDays, BarChart2, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { CATEGORY_COLORS } from "@/lib/categories"
import type { TransactionCategory } from "@/lib/types"

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function fmt(n: number) {
  return `$${n.toFixed(2)}`
}

export function HistoryPage() {
  const { transactions, snapshots, saveSnapshot, deleteSnapshot } = useAppStore()
  const [saveLabel, setSaveLabel] = useState(() => {
    const now = new Date()
    return `${MONTHS[now.getMonth()]} ${now.getFullYear()}`
  })
  const [compareA, setCompareA] = useState<string>("")
  const [compareB, setCompareB] = useState<string>("")
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (!transactions.length) return
    saveSnapshot(saveLabel)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // --- Comparison data ---
  const snapA = snapshots.find((s) => s.id === compareA)
  const snapB = snapshots.find((s) => s.id === compareB)

  const comparisonData = (() => {
    if (!snapA && !snapB) return []
    const categories = new Set<string>([
      ...Object.keys(snapA?.categoryTotals ?? {}),
      ...Object.keys(snapB?.categoryTotals ?? {}),
    ])
    return Array.from(categories)
      .map((cat) => ({
        cat: cat.length > 14 ? cat.slice(0, 13) + "…" : cat,
        fullCat: cat,
        [snapA?.label ?? "A"]: parseFloat((snapA?.categoryTotals[cat] ?? 0).toFixed(2)),
        [snapB?.label ?? "B"]: parseFloat((snapB?.categoryTotals[cat] ?? 0).toFixed(2)),
      }))
      .filter((d) => (d[snapA?.label ?? "A"] as number) > 0 || (d[snapB?.label ?? "B"] as number) > 0)
      .sort((a, b) => (b[snapA?.label ?? "A"] as number) - (a[snapA?.label ?? "A"] as number))
  })()

  // --- Year trend data ---
  const years = [...new Set(snapshots.map((s) => s.year))].sort()
  const trendData = years.flatMap((year) =>
    MONTHS.map((mon, i) => {
      const snap = snapshots.find((s) => s.year === year && s.month === i + 1)
      return snap ? { label: `${mon} ${year}`, total: parseFloat(snap.totalSpending.toFixed(2)) } : null
    }).filter(Boolean)
  ) as { label: string; total: number }[]

  // --- Year summaries ---
  const yearSummaries = years.map((year) => {
    const yearSnaps = snapshots.filter((s) => s.year === year)
    const total = yearSnaps.reduce((sum, s) => sum + s.totalSpending, 0)
    const avg = yearSnaps.length ? total / yearSnaps.length : 0
    const prevYear = years[years.indexOf(year) - 1]
    const prevTotal = prevYear
      ? snapshots.filter((s) => s.year === prevYear).reduce((sum, s) => sum + s.totalSpending, 0)
      : null
    const change = prevTotal ? ((total - prevTotal) / prevTotal) * 100 : null
    return { year, total, avg, months: yearSnaps.length, change }
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Spending History</h1>
          <p className="mt-1 text-muted-foreground">Save monthly snapshots and compare your spending over time</p>
        </div>
      </div>

      {/* Save current month */}
      <Card className="border-[--border] bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-foreground">
            <Save className="h-4 w-4" />
            Save Current Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions loaded. Upload a statement or load demo data first.</p>
          ) : (
            <div className="flex items-center gap-3">
              <input
                value={saveLabel}
                onChange={(e) => setSaveLabel(e.target.value)}
                className="rounded-xl border border-[--border] bg-[--secondary] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 w-48"
                placeholder="e.g. March 2024"
              />
              <Button onClick={handleSave} className="gap-2 bg-primary text-primary-foreground">
                <Save className="h-4 w-4" />
                {saved ? "Saved!" : "Save Snapshot"}
              </Button>
              <p className="text-sm text-muted-foreground">{transactions.length} transactions · ${transactions.reduce((s, t) => s + t.amount, 0).toFixed(2)} total</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved snapshots list */}
      {snapshots.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Saved Months ({snapshots.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...snapshots].reverse().map((snap) => {
              const topCats = Object.entries(snap.categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
              return (
                <Card key={snap.id} className="border-[--border] bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{snap.label}</p>
                        <p className="text-2xl font-bold text-primary mt-0.5">{fmt(snap.totalSpending)}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{snap.transactions.length} transactions</p>
                      </div>
                      <button
                        onClick={() => deleteSnapshot(snap.id)}
                        className="rounded-lg p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 space-y-1">
                      {topCats.map(([cat, amt]) => (
                        <div key={cat} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: CATEGORY_COLORS[cat as TransactionCategory] ?? "#94a3b8" }}
                            />
                            <span className="text-muted-foreground">{cat}</span>
                          </div>
                          <span className="font-medium text-foreground">{fmt(amt)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Month comparison */}
      {snapshots.length >= 2 && (
        <div>
          <h2 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Compare Two Months
          </h2>
          <Card className="border-[--border] bg-card">
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <Select value={compareA} onValueChange={setCompareA}>
                  <SelectTrigger className="w-44 border-[--border] bg-[--secondary] text-foreground">
                    <SelectValue placeholder="Month A" />
                  </SelectTrigger>
                  <SelectContent className="border-[--border] bg-card">
                    {snapshots.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-foreground">{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground font-medium">vs</span>
                <Select value={compareB} onValueChange={setCompareB}>
                  <SelectTrigger className="w-44 border-[--border] bg-[--secondary] text-foreground">
                    <SelectValue placeholder="Month B" />
                  </SelectTrigger>
                  <SelectContent className="border-[--border] bg-card">
                    {snapshots.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-foreground">{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {snapA && snapB && (
                  <div className="ml-auto flex gap-4 text-sm">
                    {(() => {
                      const diff = snapB.totalSpending - snapA.totalSpending
                      const pct = snapA.totalSpending > 0 ? (diff / snapA.totalSpending) * 100 : 0
                      const up = diff > 0
                      return (
                        <div className={`flex items-center gap-1 font-semibold ${up ? "text-red-500" : "text-emerald-600"}`}>
                          {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                          {up ? "+" : ""}{fmt(diff)} ({pct > 0 ? "+" : ""}{pct.toFixed(1)}%)
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>

              {comparisonData.length > 0 && snapA && snapB && (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={comparisonData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="cat" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tickFormatter={(v) => `$${v}`} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={55} />
                    <Tooltip
                      formatter={(v, name) => [fmt(Number(v)), name]}
                      contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} />
                    <Bar dataKey={snapA.label} fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={snapB.label} fill="#22d3ee" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Year trend */}
      {trendData.length >= 2 && (
        <div>
          <h2 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Spending Over Time
          </h2>
          <Card className="border-[--border] bg-card">
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tickFormatter={(v) => `$${v}`} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={55} />
                  <Tooltip
                    formatter={(v) => [fmt(Number(v)), "Total spending"]}
                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
                  />
                  <Line type="monotone" dataKey="total" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Year summaries */}
      {yearSummaries.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-bold text-foreground">Year Summary</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {yearSummaries.map(({ year, total, avg, months, change }) => (
              <Card key={year} className="border-[--border] bg-card">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-muted-foreground">{year}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{fmt(total)}</p>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>{months} month{months !== 1 ? "s" : ""} recorded</p>
                    <p>Avg / month: <span className="font-semibold text-foreground">{fmt(avg)}</span></p>
                    {change !== null && (
                      <p className={`flex items-center gap-1 font-semibold ${change > 0 ? "text-red-500" : "text-emerald-600"}`}>
                        {change > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {change > 0 ? "+" : ""}{change.toFixed(1)}% vs {year - 1}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {snapshots.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-[--border] p-12 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="font-semibold text-foreground">No snapshots yet</p>
          <p className="text-sm text-muted-foreground mt-1">Load your transactions and click "Save Snapshot" to start tracking month by month.</p>
        </div>
      )}
    </div>
  )
}
