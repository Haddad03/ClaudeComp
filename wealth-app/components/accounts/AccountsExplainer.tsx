"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts"
import { generateProjectionData, formatCAD } from "@/lib/growthProjection"
import { Info, Settings, TrendingUp, CheckCircle2, ArrowDown } from "lucide-react"

const compoundData = generateProjectionData(500, 0.07, 20, 0)
const taxableData = generateProjectionData(500, 0.07 * 0.73, 20, 0)

const tooltipMap: Record<string, string> = {
  TFSA: "Tax-Free Savings Account",
  RRSP: "Registered Retirement Savings Plan",
  FHSA: "First Home Savings Account",
}

function AccountTooltip({ label }: { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted underline-offset-4 cursor-help font-semibold">{label}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">{tooltipMap[label] ?? label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

const sectionIcons: Record<string, React.ReactNode> = {
  "What is it?": <Info className="h-4 w-4" />,
  "How does it work?": <Settings className="h-4 w-4" />,
  "The snowball effect": <TrendingUp className="h-4 w-4" />,
  "First Home Buyer's Plan": <TrendingUp className="h-4 w-4" />,
  "What if I don't buy a home?": <Info className="h-4 w-4" />,
}

const accounts = [
  {
    id: "tfsa",
    label: "TFSA",
    emoji: "🧢",
    accentText: "text-cyan-700",
    accentBg: "bg-cyan-50",
    accentBorder: "border-cyan-200",
    accent: "#0891b2",
    title: "Tax-Free Savings Account",
    tagline: "Your best friend for everyday savings",
    limit: "$7,000 / year (2026)",
    bestFor: "Emergency fund, short-term goals, first investments",
    taxTreatment: "Contributions: after-tax. Growth & withdrawals: 100% tax-free.",
    sections: [
      { heading: "What is it?", body: "A TFSA lets any Canadian resident 18+ save and invest money without ever paying tax on the growth. If your $500 turns into $50,000, you keep every dollar." },
      { heading: "How does it work?", body: "You deposit money (up to the annual limit), invest it however you like (ETFs, GICs, stocks), watch it grow, and withdraw anytime — no tax, no penalties." },
      { heading: "The snowball effect", body: "Because you never lose a percentage to tax, every dollar of growth keeps compounding. Over 20 years this makes a massive difference vs a regular account." },
    ],
    rules: ["Available to all Canadian residents 18+", "Unused room carries forward forever", "Withdrawals re-add contribution room next January", "No impact on government benefits like GIS"],
    exampleResult: { account: "$260,000", taxable: "$210,000", diff: "$50,000" },
  },
  {
    id: "rrsp",
    label: "RRSP",
    emoji: "🏦",
    accentText: "text-violet-700",
    accentBg: "bg-violet-50",
    accentBorder: "border-violet-200",
    accent: "#7c3aed",
    title: "Registered Retirement Savings Plan",
    tagline: "Slash your taxes now, invest for later",
    limit: "18% of prior year income (max ~$31,560 in 2025)",
    bestFor: "High earners, retirement savings, tax refund maximization",
    taxTreatment: "Contributions: tax-deductible (immediate refund). Growth: tax-deferred. Withdrawals: taxed as income.",
    sections: [
      { heading: "What is it?", body: "An RRSP lets you deduct contributions from your income tax this year. If you earn $70,000 and put in $10,000, you're only taxed on $60,000 — you get a cheque back from the CRA." },
      { heading: "How does it work?", body: "You contribute (and get a tax refund), invest inside the account, and it grows tax-free until you retire. When you withdraw in retirement, you're usually in a lower tax bracket." },
      { heading: "First Home Buyer's Plan", body: "You can withdraw up to $35,000 from your RRSP tax-free to buy your first home (and repay over 15 years). This stacks with the FHSA." },
    ],
    rules: ["Deadline: 60 days into the new year for prior-year deduction", "Unused room carries forward indefinitely", "Must convert to RRIF at age 71", "RRSP refund can be re-invested in TFSA for double benefit"],
    exampleResult: { account: "$260,000", taxable: "$210,000", diff: "$50,000" },
  },
  {
    id: "fhsa",
    label: "FHSA",
    emoji: "🏠",
    accentText: "text-emerald-700",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    accent: "#059669",
    title: "First Home Savings Account",
    tagline: "The best of TFSA + RRSP for first-time buyers",
    limit: "$8,000 / year, $40,000 lifetime",
    bestFor: "First-time home buyers saving for a down payment",
    taxTreatment: "Contributions: tax-deductible (like RRSP). Growth & qualifying withdrawals: tax-free (like TFSA).",
    sections: [
      { heading: "What is it?", body: "The FHSA is a new (2023) account that combines the best of both worlds: you deduct contributions from your taxes AND withdraw completely tax-free when buying your first home." },
      { heading: "How does it work?", body: "Open the account, contribute up to $8,000/year, invest the money in ETFs or GICs, and when you buy your first home, withdraw it all — no tax on the way in OR on the way out." },
      { heading: "What if I don't buy a home?", body: "No problem. If you decide not to buy, you can transfer the balance to your RRSP without losing contribution room. There is no downside to opening one now." },
    ],
    rules: ["Must be a first-time home buyer (no home owned in current + prior 4 years)", "Account must be open for at least 1 calendar year before withdrawing", "Unused annual room ($8K) can carry forward one year only", "Can combine with RRSP Home Buyers' Plan for up to $75,000 total"],
    exampleResult: { account: "$260,000", taxable: "$210,000", diff: "$50,000" },
  },
]

export function AccountsExplainer() {
  return (
    <TooltipProvider delayDuration={200}>
      <section aria-label="Canadian Registered Accounts" className="space-y-8">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-forest">
            Understand <AccountTooltip label="TFSA" />, <AccountTooltip label="RRSP" />, and <AccountTooltip label="FHSA" /> — Without the Confusion
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Learn how to save, invest, and grow your money using Canada's tax-advantaged accounts.
          </p>
          <button
            onClick={() => document.getElementById("accounts-tabs")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            style={{ backgroundColor: "#2563EB" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
          >
            Calculate My Savings
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tfsa" id="accounts-tabs">
          <TabsList className="bg-secondary border border-border rounded-lg p-1 gap-1">
            {accounts.map((a) => (
              <TabsTrigger
                key={a.id}
                value={a.id}
                aria-label={`${a.label} - ${tooltipMap[a.label]}`}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-sm"
              >
                {a.emoji} {a.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {accounts.map((a) => (
            <TabsContent key={a.id} value={a.id} className="mt-6 space-y-5">
              {/* Account header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h2 className={`text-xl font-bold ${a.accentText}`}>{a.title}</h2>
                  <p className="text-muted-foreground">{a.tagline}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-border text-foreground text-xs">
                    Limit: {a.limit}
                  </Badge>
                  <Badge variant="outline" className="border-border text-foreground text-xs">
                    Best for: {a.bestFor}
                  </Badge>
                </div>
              </div>

              {/* Tax treatment callout */}
              <Alert className={`${a.accentBg} ${a.accentBorder}`}>
                <Info className={`h-4 w-4 ${a.accentText}`} />
                <AlertDescription className="text-foreground">
                  <strong>Tax treatment:</strong> {a.taxTreatment}
                </AlertDescription>
              </Alert>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Content sections */}
                <div className="space-y-3">
                  {a.sections.map((s) => (
                    <Card key={s.heading} className="border-border bg-card shadow-sm hover:shadow-md transition-shadow" style={{ borderRadius: 12 }}>
                      <CardHeader className="pb-1 pt-5 px-5">
                        <CardTitle className={`flex items-center gap-2 text-sm font-semibold ${a.accentText}`}>
                          {sectionIcons[s.heading] ?? <Info className="h-4 w-4" />}
                          {s.heading}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                        <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                      </CardContent>
                    </Card>
                  ))}

                  <Card className="border-border bg-card shadow-sm" style={{ borderRadius: 12 }}>
                    <CardHeader className="pb-1 pt-5 px-5">
                      <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <CheckCircle2 className="h-4 w-4" />
                        Key Rules
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <ul className="space-y-2">
                        {a.rules.map((r) => (
                          <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className={`mt-0.5 shrink-0 ${a.accentText}`}>✓</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Chart + Real Example */}
                <div className="space-y-4">
                  <Card className="border-border bg-card shadow-sm" style={{ borderRadius: 12 }}>
                    <CardHeader className="pb-2 pt-5 px-5">
                      <p className="text-lg font-semibold" style={{ color: "#059669" }}>
                        You earn ~$87,000 MORE using a {a.label}
                      </p>
                      <CardTitle className="text-sm text-foreground">
                        $500/month over 20 years: <AccountTooltip label={a.label} /> vs Taxable Account
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={compoundData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                          <defs>
                            <linearGradient id={`grad-${a.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={a.accent} stopOpacity={0.35} />
                              <stop offset="95%" stopColor={a.accent} stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id={`grad-taxable-${a.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="year" tickFormatter={(v) => `Yr ${v}`} tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
                          <YAxis tickFormatter={formatCAD} tick={{ fill: "#6B7280", fontSize: 12 }} width={60} axisLine={false} tickLine={false} />
                          <RechartsTooltip
                            formatter={(v) => [formatCAD(Number(v)), ""]}
                            contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", color: "#111827", fontSize: "13px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                          />
                          <Legend wrapperStyle={{ fontSize: "12px", color: "#6B7280" }} />
                          <Area type="monotone" dataKey="withSavings" data={compoundData} name={a.label} stroke={a.accent} fill={`url(#grad-${a.id})`} strokeWidth={2.5} dot={false} />
                          <Area type="monotone" dataKey="withSavings" data={taxableData} name="Taxable account" stroke="#9CA3AF" fill={`url(#grad-taxable-${a.id})`} strokeWidth={2} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Assumes 7% return in {a.label} vs ~5.1% after-tax drag in a taxable account. Illustrative only.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Real Example Box */}
                  <div
                    className="rounded-xl p-5 space-y-3"
                    style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 12 }}
                    role="region"
                    aria-label={`Real example for ${a.label}`}
                  >
                    <h3 className="text-base font-semibold text-emerald-800">Real Example</h3>
                    <p className="text-sm text-emerald-700">You invest $500 per month for 20 years.</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-2xl font-bold text-emerald-800">{a.exampleResult.account}</p>
                        <p className="text-xs text-emerald-600 font-medium">{a.label}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-500">{a.exampleResult.taxable}</p>
                        <p className="text-xs text-gray-500 font-medium">Taxable</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold" style={{ color: "#059669" }}>{a.exampleResult.diff}</p>
                        <p className="text-xs font-medium" style={{ color: "#059669" }}>More with {a.label}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </TooltipProvider>
  )
}
