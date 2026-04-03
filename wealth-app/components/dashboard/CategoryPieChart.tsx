"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useAppStore } from "@/store/appStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CATEGORY_COLORS, CATEGORY_EMOJIS } from "@/lib/categories"
import type { TransactionCategory } from "@/lib/types"

export function CategoryPieChart() {
  const { transactions } = useAppStore()

  const EXCLUDED = new Set(["Card Payment", "Transfers", "Investments"])
  const totals: Record<string, number> = {}
  for (const tx of transactions) {
    if (EXCLUDED.has(tx.category)) continue
    totals[tx.category] = (totals[tx.category] ?? 0) + tx.amount
  }

  const data = Object.entries(totals).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }))

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: { name: string; value: number }[]
  }) => {
    if (active && payload?.length) {
      const cat = payload[0].name as TransactionCategory
      return (
        <div className="rounded-lg border border-[--border] bg-[--card] p-3 text-sm shadow-xl">
          <p className="font-medium text-white">
            {CATEGORY_EMOJIS[cat]} {cat}
          </p>
          <p className="text-slate-400">${payload[0].value.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-[--border] bg-[--card]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    CATEGORY_COLORS[entry.name as TransactionCategory] ??
                    "#64748b"
                  }
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) =>
                `${CATEGORY_EMOJIS[value as TransactionCategory] ?? ""} ${value}`
              }
              wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
