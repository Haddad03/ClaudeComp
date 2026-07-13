"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/store/appStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import type { NetWorthItem } from "@/lib/types"
import { ASSET_CATEGORIES } from "@/lib/netWorth"

function fmt(n: number) {
  const abs = Math.abs(Math.round(n)).toLocaleString("en-CA")
  return `${n < 0 ? "−" : ""}$${abs}`
}

let seedCounter = 0
function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${++seedCounter}`
}

const DEFAULT_ASSETS: NetWorthItem[] = [
  { id: "a-cheq", label: "Chequing / Savings", amount: 4000, category: "cash" },
  { id: "a-tfsa", label: "TFSA", amount: 8000, category: "investment" },
  { id: "a-rrsp", label: "RRSP", amount: 3000, category: "investment" },
]

const DEFAULT_LIABILITIES: NetWorthItem[] = [
  { id: "l-cc", label: "Credit card debt", amount: 1500 },
  { id: "l-loan", label: "Student loan", amount: 12000 },
]

const ASSET_COLOR = "#2f9e63" // brand green
const LIABILITY_COLOR = "#c34f2e" // terracotta/red

export function NetWorthCalculator() {
  const { netWorth, setNetWorth } = useAppStore()

  // Seed sensible examples on first visit; otherwise restore saved rows.
  const [assets, setAssets] = useState<NetWorthItem[]>(
    netWorth.assets.length || netWorth.liabilities.length
      ? netWorth.assets
      : DEFAULT_ASSETS
  )
  const [liabilities, setLiabilities] = useState<NetWorthItem[]>(
    netWorth.assets.length || netWorth.liabilities.length
      ? netWorth.liabilities
      : DEFAULT_LIABILITIES
  )

  // Persist to the store whenever rows change.
  useEffect(() => {
    setNetWorth({ assets, liabilities })
  }, [assets, liabilities, setNetWorth])

  const totalAssets = assets.reduce((s, a) => s + Math.max(0, a.amount), 0)
  const totalLiabilities = liabilities.reduce((s, l) => s + Math.max(0, l.amount), 0)
  const netWorthValue = totalAssets - totalLiabilities
  const positive = netWorthValue >= 0

  const chartData = [
    { name: "Assets", value: totalAssets, color: ASSET_COLOR },
    { name: "Liabilities", value: totalLiabilities, color: LIABILITY_COLOR },
  ].filter((d) => d.value > 0)

  function updateRow(
    list: NetWorthItem[],
    setList: (v: NetWorthItem[]) => void,
    id: string,
    patch: Partial<NetWorthItem>
  ) {
    setList(list.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function addRow(
    list: NetWorthItem[],
    setList: (v: NetWorthItem[]) => void,
    prefix: string,
    withCategory: boolean
  ) {
    setList([
      ...list,
      { id: newId(prefix), label: "", amount: 0, ...(withCategory ? { category: "cash" as const } : {}) },
    ])
  }

  function removeRow(
    list: NetWorthItem[],
    setList: (v: NetWorthItem[]) => void,
    id: string
  ) {
    setList(list.filter((r) => r.id !== id))
  }

  const renderRows = (
    list: NetWorthItem[],
    setList: (v: NetWorthItem[]) => void,
    prefix: string,
    placeholder: string,
    withCategory: boolean
  ) => (
    <div className="space-y-2">
      {list.map((row) => (
        <div key={row.id} className="flex flex-wrap items-center gap-2">
          <Input
            value={row.label}
            onChange={(e) => updateRow(list, setList, row.id, { label: e.target.value })}
            placeholder={placeholder}
            className="min-w-[8rem] flex-1 border-[--border] bg-[--secondary] text-foreground"
          />
          {withCategory && (
            <select
              value={row.category ?? "cash"}
              onChange={(e) =>
                updateRow(list, setList, row.id, {
                  category: e.target.value as NetWorthItem["category"],
                })
              }
              aria-label="Asset type"
              className="h-9 rounded-md border border-[--border] bg-[--secondary] px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {ASSET_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          )}
          <div className="relative w-28">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              min={0}
              value={row.amount === 0 ? "" : row.amount}
              onChange={(e) =>
                updateRow(list, setList, row.id, {
                  amount: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)),
                })
              }
              placeholder="0"
              className="border-[--border] bg-[--secondary] pl-6 text-foreground"
            />
          </div>
          <button
            onClick={() => removeRow(list, setList, row.id)}
            aria-label="Remove row"
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => addRow(list, setList, prefix, withCategory)}
        className="gap-1.5 border-dashed border-[--border] bg-transparent text-muted-foreground hover:text-forest"
      >
        <Plus className="h-3.5 w-3.5" />
        Add row
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-forest">Net Worth Calculator</h1>
        <p className="text-lg text-muted-foreground">
          Add up what you own, subtract what you owe, and see where you stand today.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Inputs */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-[--border] bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-emerald-700">
                <TrendingUp className="h-4 w-4" />
                Assets — what you own
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderRows(assets, setAssets, "a", "e.g. Car, TFSA, Property", true)}
              <div className="mt-4 flex items-center justify-between border-t border-[--border] pt-3">
                <span className="text-sm font-medium text-muted-foreground">Total assets</span>
                <span className="font-mono text-lg font-bold text-emerald-700">{fmt(totalAssets)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Rows tagged <span className="font-medium text-forest">Investment</span> flow into your Growth projection.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[--border] bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-red-700">
                <TrendingDown className="h-4 w-4" />
                Liabilities — what you owe
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderRows(liabilities, setLiabilities, "l", "e.g. Credit card, Student loan", false)}
              <div className="mt-4 flex items-center justify-between border-t border-[--border] pt-3">
                <span className="text-sm font-medium text-muted-foreground">Total liabilities</span>
                <span className="font-mono text-lg font-bold text-red-700">{fmt(totalLiabilities)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Result */}
        <div className="space-y-6">
          <Card
            className={`border-2 ${
              positive ? "border-emerald-500/40 bg-emerald-50" : "border-red-500/40 bg-red-50"
            }`}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-medium">Your net worth</span>
              </div>
              <p
                className={`break-all text-4xl font-bold ${
                  positive ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {fmt(netWorthValue)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {positive
                  ? "You own more than you owe — keep it growing! 📈"
                  : "You owe more than you own right now — a plan can turn this around. 💪"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-[--border] bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-forest">Assets vs Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="var(--card)"
                      strokeWidth={2}
                    >
                      {chartData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [fmt(Number(v)), ""]}
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Add some values to see the breakdown.
                </p>
              )}
              <ul className="mt-2 space-y-1.5">
                <li className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 rounded-[4px]" style={{ backgroundColor: ASSET_COLOR }} />
                  <span className="flex-1 text-foreground">Assets</span>
                  <span className="font-medium text-foreground">{fmt(totalAssets)}</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 rounded-[4px]" style={{ backgroundColor: LIABILITY_COLOR }} />
                  <span className="flex-1 text-foreground">Liabilities</span>
                  <span className="font-medium text-foreground">{fmt(totalLiabilities)}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Your entries are saved on this device only. For educational purposes — not financial advice.
      </p>
    </div>
  )
}
