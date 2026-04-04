"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"
import {
  generateProjectionData,
  formatCAD,
  SUGGESTED_RETURN_RATES,
} from "@/lib/growthProjection"

const MILESTONES = [10000, 50000, 100000, 500000, 1000000]

export function GrowthProjectionSection() {
  const [monthly, setMonthly] = useState(300)
  const [years, setYears] = useState(20)
  const [rateKey, setRateKey] = useState("TFSA / RRSP – Balanced ETF (7%)")
  const [currentSavings, setCurrentSavings] = useState(0)

  const rate = SUGGESTED_RETURN_RATES[rateKey]
  const data = generateProjectionData(monthly, rate, years, currentSavings)
  const finalValue = data[data.length - 1]?.withSavings ?? 0
  const totalContributed = data[data.length - 1]?.contributionsOnly ?? 0
  const growth = finalValue - totalContributed
  const milestonesHit = MILESTONES.filter((m) => finalValue >= m)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Growth Projection</h2>
        <p className="text-muted-foreground">
          See how your savings grow with compound interest — the snowball effect
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-[--border] bg-card lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-foreground">Your inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Monthly savings:{" "}
                <span className="font-bold text-violet-600">${monthly}</span>
              </Label>
              <Slider min={50} max={2000} step={50} value={[monthly]} onValueChange={([v]) => setMonthly(v)} />
              <div className="flex justify-between text-xs text-muted-foreground"><span>$50</span><span>$2,000</span></div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Current savings:{" "}
                <span className="font-bold text-sky-600">${currentSavings.toLocaleString()}</span>
              </Label>
              <Slider min={0} max={50000} step={500} value={[currentSavings]} onValueChange={([v]) => setCurrentSavings(v)} />
              <div className="flex justify-between text-xs text-muted-foreground"><span>$0</span><span>$50K</span></div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Time horizon:{" "}
                <span className="font-bold text-emerald-600">{years} years</span>
              </Label>
              <Slider min={1} max={40} step={1} value={[years]} onValueChange={([v]) => setYears(v)} />
              <div className="flex justify-between text-xs text-muted-foreground"><span>1 yr</span><span>40 yrs</span></div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Account / return rate</Label>
              <Select value={rateKey} onValueChange={setRateKey}>
                <SelectTrigger className="border-[--border] bg-[--secondary] text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[--border] bg-card">
                  {Object.keys(SUGGESTED_RETURN_RATES).map((k) => (
                    <SelectItem key={k} value={k} className="text-foreground">
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Final value", value: formatCAD(finalValue), color: "text-violet-600" },
              { label: "You contribute", value: formatCAD(totalContributed), color: "text-sky-600" },
              { label: "Market growth", value: formatCAD(growth), color: "text-emerald-600" },
            ].map((s) => (
              <Card key={s.label} className="border-[--border] bg-card">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-[--border] bg-card">
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="year" tickFormatter={(v) => `Yr ${v}`} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <YAxis tickFormatter={formatCAD} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={60} />
                  <Tooltip
                    formatter={(value, name) => [
                      formatCAD(Number(value)),
                      name === "withSavings" ? "With investing" : name === "contributionsOnly" ? "Contributions only" : "No saving",
                    ]}
                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--card-foreground)" }}
                  />
                  <Legend
                    formatter={(v) => v === "withSavings" ? "With investing" : v === "contributionsOnly" ? "Contributions only" : "No saving"}
                    wrapperStyle={{ fontSize: "12px", color: "var(--muted-foreground)" }}
                  />
                  {milestonesHit.map((m) => (
                    <ReferenceLine key={m} y={m} stroke="var(--border)" strokeDasharray="4 4"
                      label={{ value: formatCAD(m), position: "insideTopRight", fill: "var(--muted-foreground)", fontSize: 10 }} />
                  ))}
                  <Line type="monotone" dataKey="withSavings" stroke="#7c3aed" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="contributionsOnly" stroke="#0284c7" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="withoutSavings" stroke="#64748b" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            * Projections are illustrative only. Past returns do not guarantee future results. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  )
}
