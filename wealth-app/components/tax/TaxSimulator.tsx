"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { calculateTax, PROVINCES } from "@/lib/taxCalculator"
import { Info } from "lucide-react"

function fmt(n: number) {
  return `$${Math.round(n).toLocaleString("en-CA")}`
}
function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`
}

export function TaxSimulator() {
  const [income, setIncome] = useState(75000)
  const [province, setProvince] = useState("ON")
  const [rrsp, setRrsp] = useState(0)

  const withRRSP = calculateTax(income, province, rrsp)
  const withoutRRSP = calculateTax(income, province, 0)

  const chartData = [
    {
      name: "Without RRSP",
      Federal: Math.round(withoutRRSP.federalTax),
      Provincial: Math.round(withoutRRSP.provincialTax),
      "CPP + EI": Math.round(withoutRRSP.cppContribution + withoutRRSP.eiPremium),
    },
    {
      name: "With RRSP",
      Federal: Math.round(withRRSP.federalTax),
      Provincial: Math.round(withRRSP.provincialTax),
      "CPP + EI": Math.round(withRRSP.cppContribution + withRRSP.eiPremium),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tax Simulator</h2>
        <p className="text-muted-foreground">
          Estimate your Canadian taxes and see how RRSP contributions reduce what you owe
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 grid-cols-1">
        {/* Inputs */}
        <Card className="border-[--border] bg-card lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-foreground">Your info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground">Gross annual income (CAD)</Label>
              <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
                className="border-[--border] bg-[--secondary] text-foreground"
                placeholder="75000"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground">Province / Territory</Label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="border-[--border] bg-[--secondary] text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[--border] bg-card">
                  {PROVINCES.map((p) => (
                    <SelectItem key={p.value} value={p.value} className="text-foreground">
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground">
                RRSP contribution (optional)
              </Label>
              <Input
                type="number"
                value={rrsp}
                onChange={(e) => setRrsp(Math.max(0, Number(e.target.value)))}
                className="border-[--border] bg-[--secondary] text-foreground"
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Max: {fmt(income * 0.18)} (18% of income)
              </p>
            </div>

            {rrsp > 0 && withRRSP.rrspSavings > 0 && (
              <div className="rounded-lg border border-emerald-600/30 bg-emerald-500/10 p-3">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-emerald-600">
                      RRSP saves you {fmt(withRRSP.rrspSavings)}
                    </p>
                    <p className="text-xs text-emerald-600/70">
                      in income taxes this year
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4 lg:col-span-2">
          {/* Summary grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Gross income", value: fmt(income), color: "text-foreground" },
              { label: "Total tax", value: fmt(withRRSP.totalTax), color: "text-red-600" },
              { label: "Net income", value: fmt(withRRSP.netIncome), color: "text-emerald-600" },
              { label: "Effective rate", value: pct(withRRSP.effectiveRate), color: "text-amber-600" },
            ].map((s) => (
              <Card key={s.label} className="border-[--border] bg-card">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-sm sm:text-lg font-bold ${s.color} break-all`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Breakdown chart */}
          <Card className="border-[--border] bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">
                Tax breakdown{rrsp > 0 ? " — before vs after RRSP" : ""}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} width={40} />
                  <Tooltip
                    formatter={(v) => fmt(Number(v))}
                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--card-foreground)" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", color: "var(--muted-foreground)" }} />
                  <Bar dataKey="Federal" stackId="a" fill="#5b21b6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Provincial" stackId="a" fill="#1d4ed8" />
                  <Bar dataKey="CPP + EI" stackId="a" fill="#64748b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed breakdown table */}
          <Card className="border-[--border] bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Detailed breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Gross income", value: fmt(income) },
                  { label: "RRSP deduction", value: rrsp > 0 ? `-${fmt(rrsp)}` : "—", highlight: rrsp > 0 },
                  { label: "Taxable income", value: fmt(withRRSP.taxableIncome), bold: true },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between border-b border-[--border] pb-1">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className={r.highlight ? "text-emerald-600 font-medium" : r.bold ? "font-bold text-foreground" : "text-foreground"}>
                      {r.value}
                    </span>
                  </div>
                ))}
                <Separator className="my-1 bg-[--border]" />
                {[
                  { label: "Federal tax", value: fmt(withRRSP.federalTax) },
                  { label: "Provincial tax", value: fmt(withRRSP.provincialTax) },
                  { label: "CPP contribution", value: fmt(withRRSP.cppContribution) },
                  { label: "EI premium", value: fmt(withRRSP.eiPremium) },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between border-b border-[--border] pb-1">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="text-red-600">{r.value}</span>
                  </div>
                ))}
                <Separator className="my-1 bg-[--border]" />
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-foreground">Total tax</span>
                  <span className="font-bold text-red-600">{fmt(withRRSP.totalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Take-home pay</span>
                  <span className="font-bold text-emerald-600">{fmt(withRRSP.netIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marginal rate (fed + prov)</span>
                  <span className="text-amber-600">{pct(withRRSP.marginalRate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        * Based on 2025 Canadian federal and provincial tax brackets. Estimates only — does not include all credits, surtaxes, or individual circumstances. Not financial advice.
      </p>
    </div>
  )
}
