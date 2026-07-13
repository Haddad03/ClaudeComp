"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
import {
  calculateTaxFromSources,
  PROVINCES,
  INCOME_SOURCE_TYPES,
  FHSA_ANNUAL_LIMIT,
  TFSA_ANNUAL_LIMIT,
  RRSP_ANNUAL_MAX,
  RRSP_EARNED_INCOME_RATE,
} from "@/lib/taxCalculator"
import type { IncomeSource, IncomeSourceType } from "@/lib/types"
import { Info, Plus, Trash2 } from "lucide-react"

function fmt(n: number) {
  return `$${Math.round(n).toLocaleString("en-CA")}`
}
function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`
}

type EntryMode = "dollar" | "percent"

function ModeToggle({
  mode,
  onChange,
}: {
  mode: EntryMode
  onChange: (m: EntryMode) => void
}) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-[--border]">
      {(["dollar", "percent"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          title={m === "dollar" ? "Enter a dollar amount" : "Enter a % of earned income"}
          className={`px-2.5 py-0.5 text-xs font-semibold transition-colors ${
            mode === m
              ? "bg-forest text-lime"
              : "bg-[--secondary] text-muted-foreground hover:text-forest"
          }`}
        >
          {m === "dollar" ? "$" : "%"}
        </button>
      ))}
    </div>
  )
}

export function TaxSimulator() {
  const [sources, setSources] = useState<IncomeSource[]>([
    { id: "src-1", type: "employment", amount: 75000 },
  ])
  const [province, setProvince] = useState("ON")
  const [rrsp, setRrsp] = useState(0)
  const [rrspMode, setRrspMode] = useState<EntryMode>("dollar")
  const [fhsa, setFhsa] = useState(0)
  const [fhsaMode, setFhsaMode] = useState<EntryMode>("dollar")
  const [tfsa, setTfsa] = useState(0)

  const earnedIncome = sources
    .filter((s) => s.type === "employment" || s.type === "selfEmployment")
    .reduce((sum, s) => sum + Math.max(0, s.amount), 0)
  const rrspRoom = Math.min(earnedIncome * RRSP_EARNED_INCOME_RATE, RRSP_ANNUAL_MAX)

  // In percent mode the number entered is a % of earned income
  const rrspDollars = Math.round(rrspMode === "percent" ? (earnedIncome * rrsp) / 100 : rrsp)
  const fhsaDollars = Math.round(fhsaMode === "percent" ? (earnedIncome * fhsa) / 100 : fhsa)
  const fhsaApplied = Math.min(fhsaDollars, FHSA_ANNUAL_LIMIT)

  const withAccounts = calculateTaxFromSources(sources, province, { rrsp: rrspDollars, fhsa: fhsaApplied })
  const withoutAccounts = calculateTaxFromSources(sources, province)

  const hasDeductions = rrspDollars + fhsaApplied > 0
  const totalIncome = withAccounts.grossIncome

  function updateSource(id: string, patch: Partial<IncomeSource>) {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  function addSource() {
    setSources((prev) => [
      ...prev,
      { id: `src-${Date.now()}`, type: "other", amount: 0 },
    ])
  }

  function removeSource(id: string) {
    setSources((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev))
  }

  const chartData = [
    {
      name: hasDeductions ? "Without accounts" : "Your taxes",
      Federal: Math.round(withoutAccounts.federalTax),
      Provincial: Math.round(withoutAccounts.provincialTax),
      "CPP + EI": Math.round(withoutAccounts.cppContribution + withoutAccounts.eiPremium),
    },
    ...(hasDeductions
      ? [
          {
            name: "With RRSP + FHSA",
            Federal: Math.round(withAccounts.federalTax),
            Provincial: Math.round(withAccounts.provincialTax),
            "CPP + EI": Math.round(withAccounts.cppContribution + withAccounts.eiPremium),
          },
        ]
      : []),
  ]

  const numberInput = (
    value: number,
    onChange: (n: number) => void,
    placeholder = "0"
  ) => (
    <Input
      type="number"
      min={0}
      value={value === 0 ? "" : value}
      onChange={(e) =>
        onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))
      }
      className="border-[--border] bg-[--secondary] text-foreground"
      placeholder={placeholder}
    />
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tax Simulator</h2>
        <p className="text-muted-foreground">
          Estimate your Canadian taxes across all your income, and see how registered accounts reduce what you owe
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 grid-cols-1">
        {/* Inputs */}
        <div className="space-y-4 lg:col-span-1">
          <Card className="border-[--border] bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Income sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sources.map((source) => {
                const typeInfo = INCOME_SOURCE_TYPES.find((t) => t.value === source.type)
                return (
                  <div key={source.id} className="space-y-1.5 rounded-xl border border-[--border] bg-[--secondary]/40 p-3">
                    <div className="flex items-center gap-2">
                      <Select
                        value={source.type}
                        onValueChange={(v) => updateSource(source.id, { type: v as IncomeSourceType })}
                      >
                        <SelectTrigger className="flex-1 border-[--border] bg-[--secondary] text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-[--border] bg-card">
                          {INCOME_SOURCE_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value} className="text-foreground">
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {sources.length > 1 && (
                        <button
                          onClick={() => removeSource(source.id)}
                          title="Remove income source"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[--border] text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {numberInput(source.amount, (n) => updateSource(source.id, { amount: n }))}
                    {typeInfo && (
                      <p className="text-xs text-muted-foreground">{typeInfo.hint}</p>
                    )}
                  </div>
                )
              })}

              <Button
                variant="outline"
                onClick={addSource}
                className="w-full gap-2 border-dashed border-[--border] text-muted-foreground hover:text-forest hover:bg-cream-dark"
              >
                <Plus className="h-4 w-4" />
                Add income source
              </Button>

              <div className="flex justify-between border-t border-[--border] pt-2 text-sm">
                <span className="text-muted-foreground">Total income</span>
                <span className="font-bold text-foreground">{fmt(totalIncome)}</span>
              </div>

              <div className="space-y-1.5 pt-1">
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
            </CardContent>
          </Card>

          <Card className="border-[--border] bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground">Registered accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground">RRSP contribution</Label>
                  <ModeToggle mode={rrspMode} onChange={(m) => { setRrspMode(m); setRrsp(0) }} />
                </div>
                {numberInput(rrsp, setRrsp)}
                <p className="text-xs text-muted-foreground">
                  {rrspMode === "percent" && rrsp > 0 && (
                    <span className="font-medium text-forest">= {fmt(rrspDollars)} · </span>
                  )}
                  Your room this year: ~{fmt(rrspRoom)} (18% of earned income)
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground">FHSA contribution</Label>
                  <ModeToggle mode={fhsaMode} onChange={(m) => { setFhsaMode(m); setFhsa(0) }} />
                </div>
                {numberInput(fhsa, setFhsa)}
                <p className="text-xs text-muted-foreground">
                  {fhsaMode === "percent" && fhsa > 0 && (
                    <span className="font-medium text-forest">= {fmt(fhsaDollars)} · </span>
                  )}
                  First Home Savings Account — annual limit {fmt(FHSA_ANNUAL_LIMIT)}
                  {fhsaDollars > FHSA_ANNUAL_LIMIT && (
                    <span className="text-amber-600"> · capped at {fmt(FHSA_ANNUAL_LIMIT)}</span>
                  )}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-muted-foreground">TFSA contribution</Label>
                {numberInput(tfsa, setTfsa)}
                <p className="text-xs text-muted-foreground">
                  Annual limit {fmt(TFSA_ANNUAL_LIMIT)}{" — "}TFSA contributions don&apos;t reduce
                  your taxes today, but all growth and withdrawals are tax-free.
                </p>
              </div>

              {hasDeductions && withAccounts.deductionSavings > 0 && (
                <div className="rounded-lg border border-emerald-600/30 bg-emerald-500/10 p-3">
                  <div className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-emerald-600">
                        RRSP + FHSA save you {fmt(withAccounts.deductionSavings)}
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
        </div>

        {/* Results */}
        <div className="space-y-4 lg:col-span-2">
          {/* Summary grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Gross income", value: fmt(totalIncome), color: "text-foreground" },
              { label: "Total tax", value: fmt(withAccounts.totalTax), color: "text-red-600" },
              { label: "Net income", value: fmt(withAccounts.netIncome), color: "text-emerald-600" },
              { label: "Effective rate", value: pct(withAccounts.effectiveRate), color: "text-amber-600" },
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
                Tax breakdown{hasDeductions ? " — before vs after RRSP + FHSA" : ""}
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
                  <Bar dataKey="Federal" stackId="a" fill="#2f9e63" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Provincial" stackId="a" fill="#4d8fe8" />
                  <Bar dataKey="CPP + EI" stackId="a" fill="#8a8f87" radius={[4, 4, 0, 0]} />
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
                  { label: "Gross income", value: fmt(totalIncome) },
                  { label: "RRSP deduction", value: rrspDollars > 0 ? `-${fmt(rrspDollars)}` : "—", highlight: rrspDollars > 0 },
                  { label: "FHSA deduction", value: fhsaApplied > 0 ? `-${fmt(fhsaApplied)}` : "—", highlight: fhsaApplied > 0 },
                  { label: "Taxable income", value: fmt(withAccounts.taxableIncome), bold: true },
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
                  { label: "Federal tax", value: fmt(withAccounts.federalTax) },
                  { label: "Provincial tax", value: fmt(withAccounts.provincialTax) },
                  { label: "CPP contribution", value: fmt(withAccounts.cppContribution) },
                  { label: "EI premium", value: fmt(withAccounts.eiPremium) },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between border-b border-[--border] pb-1">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="text-red-600">{r.value}</span>
                  </div>
                ))}
                <Separator className="my-1 bg-[--border]" />
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-foreground">Total tax</span>
                  <span className="font-bold text-red-600">{fmt(withAccounts.totalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Take-home pay</span>
                  <span className="font-bold text-emerald-600">{fmt(withAccounts.netIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marginal rate (fed + prov)</span>
                  <span className="text-amber-600">{pct(withAccounts.marginalRate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        * Based on 2025 Canadian federal and provincial tax brackets. Capital gains use the 50% inclusion rate; self-employment income pays both CPP halves; Quebec includes the 16.5% federal abatement. Estimates only — dividends, credits, and surtaxes are not modelled. Not financial advice.
      </p>
    </div>
  )
}
