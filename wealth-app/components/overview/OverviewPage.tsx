"use client"

import { useAppStore } from "@/store/appStore"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart"
import { AISuggestionsPanel } from "@/components/suggestions/AISuggestionsPanel"
import { netWorthTotals, investmentTotal } from "@/lib/netWorth"
import { generateProjectionData, formatCAD } from "@/lib/growthProjection"
import { formatMoney } from "@/lib/utils"
import {
  Upload,
  Calculator,
  BookOpen,
  Scale,
  LineChart,
  Receipt,
  ArrowRight,
  ArrowUpRight,
  PiggyBank,
  Shield,
  Sparkles,
  MessageCircle,
} from "lucide-react"

const EXCLUDED_FROM_SPENDING = new Set(["Card Payment", "Transfers", "Investments"])

const quickActions = [
  { id: "upload", icon: Upload, title: "Upload Statement", desc: "AI-powered transaction analysis" },
  { id: "tax", icon: Calculator, title: "Tax Simulator", desc: "Federal + provincial tax calculator" },
  { id: "accounts", icon: BookOpen, title: "Learn Accounts", desc: "RRSP, TFSA & investment basics" },
]

const tips = [
  { icon: PiggyBank, title: "Start with $50/month", desc: "Even small amounts grow significantly with compound interest over 20+ years." },
  { icon: Shield, title: "Max your TFSA first", desc: "Tax-free growth makes the TFSA the best starting point for most Canadians." },
  { icon: Sparkles, title: "Track every dollar", desc: "Upload your bank statement to discover spending patterns you didn't know about." },
]

export function OverviewPage() {
  const { setActiveTab, setChatOpen, userGoal, transactions, netWorth } = useAppStore()

  const goalLabel: Record<string, string> = {
    spending: "fixing your spending",
    saving: "growing your savings",
    taxes: "optimizing your taxes",
    growth: "building your wealth",
    general: "managing your finances",
  }

  // ── Live figures pulled from across the app ──
  const { net: netWorthValue, totalAssets } = netWorthTotals(netWorth)
  const hasNetWorth = netWorth.assets.length > 0 || netWorth.liabilities.length > 0

  const spending = transactions
    .filter((t) => t.type !== "credit" && !EXCLUDED_FROM_SPENDING.has(t.category))
    .reduce((s, t) => s + t.amount, 0)
  const hasSpending = transactions.length > 0

  const invested = investmentTotal(netWorth)
  const projection = generateProjectionData(300, 0.07, 20, invested)
  const projectedValue = projection[projection.length - 1]?.withSavings ?? 0

  return (
    <div className="space-y-10">
      {/* Welcome header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Welcome back
          </p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight text-forest">
            Your Financial <span className="rounded-xl bg-lime px-2">Overview</span>
          </h1>
          {userGoal && (
            <p className="mt-2 text-muted-foreground">
              Focused on {goalLabel[userGoal] ?? "your finances"} — let&apos;s make progress today.
            </p>
          )}
        </div>
      </div>

      {/* ── Financial snapshot: one place that pulls from every tool ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SnapshotCard
          icon={Scale}
          label="Net worth"
          onClick={() => setActiveTab("networth")}
          empty={!hasNetWorth}
          emptyLabel="Add your assets & debts"
          value={netWorthValue}
          valueClass={netWorthValue >= 0 ? "text-emerald-700" : "text-red-700"}
          sub={hasNetWorth ? `${formatMoney(totalAssets, 0)} in assets` : "Track what you own vs owe"}
        />
        <SnapshotCard
          icon={Receipt}
          label="Spending"
          onClick={() => setActiveTab(hasSpending ? "home" : "upload")}
          empty={!hasSpending}
          emptyLabel="Upload a statement"
          value={spending}
          valueClass="text-forest"
          sub={hasSpending ? `across ${transactions.length} transactions` : "See where your money goes"}
        />
        <SnapshotCard
          icon={LineChart}
          label="Projected in 20 yrs"
          onClick={() => setActiveTab("growth")}
          empty={false}
          value={projectedValue}
          valueClass="text-violet-700"
          sub={
            invested > 0
              ? `From ${formatMoney(invested, 0)} invested + $300/mo`
              : "If you invest $300/mo at 7%"
          }
        />
      </div>

      {/* ── Spending deep-dive (was the Dashboard) — only once there's data ── */}
      {hasSpending && (
        <div>
          <h2 className="mb-4 text-lg font-bold text-forest">This month&apos;s spending</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <CategoryPieChart />
            <AISuggestionsPanel />
          </div>
        </div>
      )}

      {/* AI assistant promo */}
      <button
        onClick={() => setChatOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-forest/20 bg-forest/5 px-4 py-4 text-left transition-colors hover:bg-forest/10 sm:px-6"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest text-lime shadow-sm sm:h-12 sm:w-12">
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-forest sm:text-base">Have a money question?</p>
          <p className="text-xs text-muted-foreground sm:text-sm">Ask our AI — TFSA, RRSP, budgeting, taxes and more.</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-forest" />
      </button>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-forest">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map(({ id, icon: Icon, title, desc }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 text-left transition-all duration-200 hover:border-forest/30 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-forest shadow-sm">
                <Icon className="h-6 w-6 text-lime" />
              </div>
              <p className="text-base font-bold text-forest">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              <ArrowRight className="absolute right-5 top-6 h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-forest">Financial tips</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {tips.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-border bg-card transition-all duration-300 hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10">
                  <Icon className="h-5 w-5 text-forest" />
                </div>
                <p className="font-semibold text-forest">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function SnapshotCard({
  icon: Icon,
  label,
  value,
  valueClass,
  sub,
  onClick,
  empty,
  emptyLabel,
}: {
  icon: React.ElementType
  label: string
  value: number
  valueClass: string
  sub: string
  onClick: () => void
  empty: boolean
  emptyLabel?: string
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col rounded-2xl border border-border bg-card p-6 text-left transition-all duration-200 hover:border-forest/30 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Icon className="h-4 w-4" />
          {label}
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      {empty ? (
        <>
          <p className="mt-3 text-2xl font-bold text-muted-foreground/70">—</p>
          <p className="mt-1 text-sm font-medium text-forest">{emptyLabel} →</p>
        </>
      ) : (
        <>
          <p className={`mt-3 break-all text-3xl font-bold ${valueClass}`}>{formatMoney(value, 0)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        </>
      )}
    </button>
  )
}
