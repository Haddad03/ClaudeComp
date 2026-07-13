"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { useAppStore } from "@/store/appStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatMoney } from "@/lib/utils"

// Colorblind-safe categorical palette, validated against the white card
// surface (lightness band, chroma floor, CVD separation, 3:1 contrast).
// Slot 1 anchors to the brand green; assigned to categories by spend rank.
const SLOT_COLORS = [
  "#2f9e63", // green (brand anchor)
  "#4d8fe8", // blue
  "#bd7f00", // gold
  "#c34f2e", // terracotta
  "#6d3fb8", // violet
  "#0e94ab", // teal
]
const OTHER_COLOR = "#8a8f87" // neutral — "Other" is deliberately recessive

const MAX_SLICES = 6

export function CategoryPieChart() {
  const { transactions } = useAppStore()

  const EXCLUDED = new Set(["Card Payment", "Transfers", "Investments"])
  const totals: Record<string, number> = {}
  for (const tx of transactions) {
    if (EXCLUDED.has(tx.category) || tx.type === "credit") continue
    totals[tx.category] = (totals[tx.category] ?? 0) + tx.amount
  }

  const sorted = Object.entries(totals)
    .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value)

  const top = sorted.slice(0, MAX_SLICES)
  const rest = sorted.slice(MAX_SLICES)
  const otherTotal = rest.reduce((s, d) => s + d.value, 0)
  const data =
    otherTotal > 0
      ? [...top, { name: `Other (${rest.length})`, value: parseFloat(otherTotal.toFixed(2)) }]
      : top

  const grandTotal = data.reduce((s, d) => s + d.value, 0)

  const colorFor = (index: number) =>
    index < top.length ? SLOT_COLORS[index] : OTHER_COLOR

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: { name: string; value: number }[]
  }) => {
    if (active && payload?.length) {
      const share = grandTotal > 0 ? (payload[0].value / grandTotal) * 100 : 0
      return (
        <div className="rounded-xl border border-[--border] bg-card p-3 text-sm shadow-md">
          <p className="font-medium text-forest">{payload[0].name}</p>
          <p className="text-muted-foreground">
            {formatMoney(payload[0].value)} · {share.toFixed(0)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-[--border] bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-forest">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="var(--card)"
                strokeWidth={2}
              >
                {data.map((entry, i) => (
                  <Cell key={entry.name} fill={colorFor(i)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center total */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground">Total spent</p>
            <p className="text-xl font-bold text-forest">{formatMoney(grandTotal)}</p>
          </div>
        </div>

        {/* Legend: swatch carries the color, text stays in ink */}
        <ul className="mt-4 space-y-1.5">
          {data.map((entry, i) => {
            const share = grandTotal > 0 ? (entry.value / grandTotal) * 100 : 0
            return (
              <li key={entry.name} className="flex items-center gap-2 text-sm">
                <span
                  className="h-3 w-3 shrink-0 rounded-[4px]"
                  style={{ backgroundColor: colorFor(i) }}
                />
                <span className="flex-1 truncate text-foreground">{entry.name}</span>
                <span className="font-medium text-foreground">{formatMoney(entry.value)}</span>
                <span className="w-10 text-right text-xs text-muted-foreground">
                  {share.toFixed(0)}%
                </span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
