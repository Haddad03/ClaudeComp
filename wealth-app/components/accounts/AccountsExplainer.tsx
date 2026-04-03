"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { generateProjectionData, formatCAD } from "@/lib/growthProjection"
import { Info } from "lucide-react"

const compoundData = generateProjectionData(500, 0.07, 20, 0)
const taxableData = generateProjectionData(500, 0.07 * 0.73, 20, 0) // ~27% tax drag

const accounts = [
  {
    id: "tfsa",
    label: "TFSA",
    emoji: "🧢",
    color: "text-cyan-400",
    accent: "#22d3ee",
    title: "Tax-Free Savings Account",
    tagline: "Your best friend for everyday savings",
    limit: "$7,000 / year (2026)",
    bestFor: "Emergency fund, short-term goals, first investments",
    taxTreatment: "Contributions: after-tax. Growth & withdrawals: 100% tax-free.",
    sections: [
      {
        heading: "What is it?",
        body: "A TFSA lets any Canadian resident 18+ save and invest money without ever paying tax on the growth. If your $500 turns into $50,000, you keep every dollar.",
      },
      {
        heading: "How does it work?",
        body: "You deposit money (up to the annual limit), invest it however you like (ETFs, GICs, stocks), watch it grow, and withdraw anytime — no tax, no penalties.",
      },
      {
        heading: "The snowball effect",
        body: "Because you never lose a percentage to tax, every dollar of growth keeps compounding. Over 20 years this makes a massive difference vs a regular account.",
      },
    ],
    rules: ["Available to all Canadian residents 18+", "Unused room carries forward forever", "Withdrawals re-add contribution room next January", "No impact on government benefits like GIS"],
  },
  {
    id: "rrsp",
    label: "RRSP",
    emoji: "🏦",
    color: "text-violet-400",
    accent: "#7c3aed",
    title: "Registered Retirement Savings Plan",
    tagline: "Slash your taxes now, invest for later",
    limit: "18% of prior year income (max ~$31,560 in 2025)",
    bestFor: "High earners, retirement savings, tax refund maximization",
    taxTreatment: "Contributions: tax-deductible (immediate refund). Growth: tax-deferred. Withdrawals: taxed as income.",
    sections: [
      {
        heading: "What is it?",
        body: "An RRSP lets you deduct contributions from your income tax this year. If you earn $70,000 and put in $10,000, you're only taxed on $60,000 — you get a cheque back from the CRA.",
      },
      {
        heading: "How does it work?",
        body: "You contribute (and get a tax refund), invest inside the account, and it grows tax-free until you retire. When you withdraw in retirement, you're usually in a lower tax bracket.",
      },
      {
        heading: "First Home Buyer's Plan",
        body: "You can withdraw up to $35,000 from your RRSP tax-free to buy your first home (and repay over 15 years). This stacks with the FHSA.",
      },
    ],
    rules: ["Deadline: 60 days into the new year for prior-year deduction", "Unused room carries forward indefinitely", "Must convert to RRIF at age 71", "RRSP refund can be re-invested in TFSA for double benefit"],
  },
  {
    id: "fhsa",
    label: "FHSA",
    emoji: "🏠",
    color: "text-emerald-400",
    accent: "#10b981",
    title: "First Home Savings Account",
    tagline: "The best of TFSA + RRSP for first-time buyers",
    limit: "$8,000 / year, $40,000 lifetime",
    bestFor: "First-time home buyers saving for a down payment",
    taxTreatment: "Contributions: tax-deductible (like RRSP). Growth & qualifying withdrawals: tax-free (like TFSA).",
    sections: [
      {
        heading: "What is it?",
        body: "The FHSA is a new (2023) account that combines the best of both worlds: you deduct contributions from your taxes AND withdraw completely tax-free when buying your first home.",
      },
      {
        heading: "How does it work?",
        body: "Open the account, contribute up to $8,000/year, invest the money in ETFs or GICs, and when you buy your first home, withdraw it all — no tax on the way in OR on the way out.",
      },
      {
        heading: "What if I don't buy a home?",
        body: "No problem. If you decide not to buy, you can transfer the balance to your RRSP without losing contribution room. There is no downside to opening one now.",
      },
    ],
    rules: ["Must be a first-time home buyer (no home owned in current + prior 4 years)", "Account must be open for at least 1 calendar year before withdrawing", "Unused annual room ($8K) can carry forward one year only", "Can combine with RRSP Home Buyers' Plan for up to $75,000 total"],
  },
]

export function AccountsExplainer() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Canadian Registered Accounts</h2>
        <p className="text-slate-400">
          Understand TFSA, RRSP, and FHSA in plain English — and how to use them to grow your money
        </p>
      </div>

      <Tabs defaultValue="tfsa">
        <TabsList className="bg-[--secondary] border border-[--border]">
          {accounts.map((a) => (
            <TabsTrigger key={a.id} value={a.id} className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              {a.emoji} {a.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((a) => (
          <TabsContent key={a.id} value={a.id} className="mt-6 space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className={`text-xl font-bold ${a.color}`}>{a.title}</h3>
                <p className="text-slate-400">{a.tagline}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  Limit: {a.limit}
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  Best for: {a.bestFor}
                </Badge>
              </div>
            </div>

            {/* Tax treatment callout */}
            <Alert className="border-violet-500/30 bg-violet-500/10">
              <Info className="h-4 w-4 text-violet-400" />
              <AlertDescription className="text-violet-200">
                <strong>Tax treatment:</strong> {a.taxTreatment}
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Left: content sections */}
              <div className="space-y-3">
                {a.sections.map((s) => (
                  <Card key={s.heading} className="border-[--border] bg-[--card]">
                    <CardHeader className="pb-1 pt-4 px-4">
                      <CardTitle className={`text-sm font-semibold ${a.color}`}>{s.heading}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <p className="text-sm text-slate-300">{s.body}</p>
                    </CardContent>
                  </Card>
                ))}

                <Card className="border-[--border] bg-[--card]">
                  <CardHeader className="pb-1 pt-4 px-4">
                    <CardTitle className="text-sm font-semibold text-slate-400">Key Rules</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <ul className="space-y-1">
                      {a.rules.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className={`mt-0.5 shrink-0 ${a.color}`}>✓</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Right: compound growth mini chart */}
              <Card className="border-[--border] bg-[--card]">
                <CardHeader className="pb-1 pt-4 px-4">
                  <CardTitle className="text-sm text-white">
                    $500/month over 20 years: {a.label} vs Taxable Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={compoundData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id={`grad-${a.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={a.accent} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={a.accent} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="grad-taxable" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#475569" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#475569" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" tickFormatter={(v) => `Yr ${v}`} tick={{ fill: "#64748b", fontSize: 10 }} />
                      <YAxis tickFormatter={formatCAD} tick={{ fill: "#64748b", fontSize: 10 }} width={55} />
                      <Tooltip
                        formatter={(v) => [formatCAD(Number(v)), ""]}
                        contentStyle={{ backgroundColor: "#1a1d27", border: "1px solid #2d3148", borderRadius: "8px", color: "#e2e8f0", fontSize: "12px" }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
                      <Area type="monotone" dataKey="withSavings" data={compoundData} name={a.label} stroke={a.accent} fill={`url(#grad-${a.id})`} strokeWidth={2} dot={false} />
                      <Area type="monotone" dataKey="withSavings" data={taxableData} name="Taxable account" stroke="#475569" fill="url(#grad-taxable)" strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="mt-2 text-xs text-slate-500">
                    Assumes 7% return in {a.label} vs ~5.1% after-tax drag in a taxable account. Illustrative only.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
