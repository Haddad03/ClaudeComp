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
        <h2 className="text-2xl font-bold text-white">Tax Simulator</h2>
        <p className="text-slate-400">
          Estimate your Canadian taxes and see how RRSP contributions reduce what you owe
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Inputs */}
        <Card className="border-[--border] bg-[--card] lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Your info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300">Gross annual income (CAD)</Label>
              <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
                className="border-[--border] bg-[--secondary] text-white"
                placeholder="75000"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">Province / Territory</Label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="border-[--border] bg-[--secondary] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[--border] bg-[--card]">
                  {PROVINCES.map((p) => (
                    <SelectItem key={p.value} value={p.value} className="text-white">
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">
                RRSP contribution (optional)
              </Label>
              <Input
                type="number"
                value={rrsp}
                onChange={(e) => setRrsp(Math.max(0, Number(e.target.value)))}
                className="border-[--border] bg-[--secondary] text-white"
                placeholder="0"
              />
              <p className="text-xs text-slate-500">
                Max: {fmt(income * 0.18)} (18% of income)
              </p>
            </div>

            {rrsp > 0 && withRRSP.rrspSavings > 0 && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-emerald-300">
                      RRSP saves you {fmt(withRRSP.rrspSavings)}
                    </p>
                    <p className="text-xs text-emerald-400/70">
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
              { label: "Gross income", value: fmt(income), color: "text-white" },
              { label: "Total tax", value: fmt(withRRSP.totalTax), color: "text-red-400" },
              { label: "Net income", value: fmt(withRRSP.netIncome), color: "text-emerald-400" },
              { label: "Effective rate", value: pct(withRRSP.effectiveRate), color: "text-amber-400" },
            ].map((s) => (
              <Card key={s.label} className="border-[--border] bg-[--card]">
                <CardContent className="p-3">
                  <p className="text-xs text-slate-400">{s.label}</p>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Breakdown chart */}
          <Card className="border-[--border] bg-[--card]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-white">
                Tax breakdown{rrsp > 0 ? " — before vs after RRSP" : ""}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => fmt(Number(v))}
                    contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3148", borderRadius: "8px", color: "#e2e8f0" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }} />
                  <Bar dataKey="Federal" stackId="a" fill="#7c3aed" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Provincial" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="CPP + EI" stackId="a" fill="#64748b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed breakdown table */}
          <Card className="border-[--border] bg-[--card]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-white">Detailed breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Gross income", value: fmt(income) },
                  { label: "RRSP deduction", value: rrsp > 0 ? `-${fmt(rrsp)}` : "—", highlight: rrsp > 0 },
                  { label: "Taxable income", value: fmt(withRRSP.taxableIncome), bold: true },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between border-b border-[--border] pb-1">
                    <span className="text-slate-400">{r.label}</span>
                    <span className={r.highlight ? "text-emerald-400 font-medium" : r.bold ? "font-bold text-white" : "text-white"}>
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
                    <span className="text-slate-400">{r.label}</span>
                    <span className="text-red-400">{r.value}</span>
                  </div>
                ))}
                <Separator className="my-1 bg-[--border]" />
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-white">Total tax</span>
                  <span className="font-bold text-red-400">{fmt(withRRSP.totalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-white">Take-home pay</span>
                  <span className="font-bold text-emerald-400">{fmt(withRRSP.netIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Marginal rate (fed + prov)</span>
                  <span className="text-amber-400">{pct(withRRSP.marginalRate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        * Based on 2025 Canadian federal and provincial tax brackets. Estimates only — does not include all credits, surtaxes, or individual circumstances. Not financial advice.
      </p>
    </div>
  )
}
