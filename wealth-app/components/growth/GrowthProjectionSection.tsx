"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
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
} from "@/lib/growthProjection"
import { useAppStore } from "@/store/appStore"
import { investmentTotal } from "@/lib/netWorth"
import { Link2, Check } from "lucide-react"

const MILESTONES = [10000, 50000, 100000, 500000, 1000000]

const RATE_PRESETS = [
  { label: "GIC", pct: 4, desc: "Guaranteed, low risk" },
  { label: "Bonds", pct: 5, desc: "Conservative fund" },
  { label: "Balanced ETF", pct: 7, desc: "Mixed stocks & bonds" },
  { label: "S&P 500", pct: 10, desc: "US stock index" },
  { label: "Growth", pct: 12, desc: "Aggressive / tech-heavy" },
]

const ACCOUNT_TYPES = ["TFSA", "RRSP", "FHSA", "Taxable"]

export function GrowthProjectionSection() {
  const netWorth = useAppStore((s) => s.netWorth)
  const investFromNetWorth = investmentTotal(netWorth)

  const [monthly, setMonthly] = useState(300)
  const [years, setYears] = useState(20)
  const [ratePct, setRatePct] = useState(7)
  const [currentSavings, setCurrentSavings] = useState(0)
  const [accountType, setAccountType] = useState("TFSA")

  const syncedWithNetWorth = investFromNetWorth > 0 && currentSavings === investFromNetWorth

  const rate = ratePct / 100
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

      <div className="grid gap-6 lg:grid-cols-3 grid-cols-1">
        <Card className="border-[--border] bg-card lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-foreground">Your inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Initial investment:{" "}
                <span className="font-bold text-sky-600">${currentSavings.toLocaleString()}</span>
              </Label>
              <div className="flex items-center gap-3">
                <Slider
                  min={0} max={50000} step={500}
                  value={[Math.min(currentSavings, 50000)]}
                  onValueChange={([v]) => setCurrentSavings(v)}
                  className="flex-1"
                />
                <Input
                  type="number" min={0}
                  value={currentSavings === 0 ? "" : currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-28 border-[--border] bg-[--secondary] text-foreground"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground"><span>$0</span><span>$50K (type for more)</span></div>
              {investFromNetWorth > 0 && (
                syncedWithNetWorth ? (
                  <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <Check className="h-3.5 w-3.5" />
                    Using your {formatCAD(investFromNetWorth)} in investments from Net Worth
                  </p>
                ) : (
                  <button
                    onClick={() => setCurrentSavings(investFromNetWorth)}
                    className="flex items-center gap-1.5 rounded-lg border border-forest/20 bg-forest/5 px-2.5 py-1 text-xs font-medium text-forest transition-colors hover:bg-forest/10"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    Use my ${investFromNetWorth.toLocaleString()} in investments from Net Worth
                  </button>
                )
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Monthly savings:{" "}
                <span className="font-bold text-violet-600">${monthly.toLocaleString()}</span>
              </Label>
              <div className="flex items-center gap-3">
                <Slider
                  min={50} max={2000} step={50}
                  value={[Math.min(Math.max(monthly, 50), 2000)]}
                  onValueChange={([v]) => setMonthly(v)}
                  className="flex-1"
                />
                <Input
                  type="number" min={0}
                  value={monthly === 0 ? "" : monthly}
                  onChange={(e) => setMonthly(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-28 border-[--border] bg-[--secondary] text-foreground"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground"><span>$50</span><span>$2,000 (type for more)</span></div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Time horizon:{" "}
                <span className="font-bold text-emerald-600">{years} years</span>
              </Label>
              <div className="flex items-center gap-3">
                <Slider
                  min={1} max={40} step={1}
                  value={[Math.min(Math.max(years, 1), 40)]}
                  onValueChange={([v]) => setYears(v)}
                  className="flex-1"
                />
                <Input
                  type="number" min={1} max={60}
                  value={years === 0 ? "" : years}
                  onChange={(e) => setYears(e.target.value === "" ? 1 : Math.min(60, Math.max(1, Number(e.target.value))))}
                  className="w-28 border-[--border] bg-[--secondary] text-foreground"
                  placeholder="20"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground"><span>1 yr</span><span>40 yrs (type up to 60)</span></div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Expected return:{" "}
                <span className="font-bold text-amber-600">{ratePct}% / year</span>
              </Label>
              <div className="flex items-center gap-3">
                <Slider
                  min={1} max={15} step={0.5}
                  value={[Math.min(Math.max(ratePct, 1), 15)]}
                  onValueChange={([v]) => setRatePct(v)}
                  className="flex-1"
                />
                <Input
                  type="number" min={0} max={30} step={0.1}
                  value={ratePct === 0 ? "" : ratePct}
                  onChange={(e) => setRatePct(e.target.value === "" ? 0 : Math.min(30, Math.max(0, Number(e.target.value))))}
                  className="w-28 border-[--border] bg-[--secondary] text-foreground"
                  placeholder="7"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground"><span>1%</span><span>15% (type up to 30%)</span></div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {RATE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setRatePct(p.pct)}
                    title={p.desc}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                      ratePct === p.pct
                        ? "bg-amber-500 text-white"
                        : "bg-[--secondary] text-muted-foreground hover:bg-amber-100 hover:text-amber-700"
                    }`}
                  >
                    {p.label} {p.pct}%
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">
                {RATE_PRESETS.find((p) => p.pct === ratePct)?.desc ?? "Custom rate — adjust to your expected return"}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Account type</Label>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger className="border-[--border] bg-[--secondary] text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[--border] bg-card">
                  {ACCOUNT_TYPES.map((a) => (
                    <SelectItem key={a} value={a} className="text-foreground">
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Final value", value: formatCAD(finalValue), color: "text-violet-600" },
              { label: "You contribute", value: formatCAD(totalContributed), color: "text-sky-600" },
              { label: "Market growth", value: formatCAD(growth), color: "text-emerald-600" },
            ].map((s) => (
              <Card key={s.label} className="border-[--border] bg-card">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-sm sm:text-lg font-bold ${s.color} break-all`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-[--border] bg-card">
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={260}>
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

        </div>
      </div>
    </div>
  )
}
