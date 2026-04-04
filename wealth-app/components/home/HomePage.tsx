"use client"

import { useAppStore } from "@/store/appStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Upload,
  LineChart,
  Calculator,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Sparkles,
  PiggyBank,
  Shield,
  MessageCircle,
} from "lucide-react"

const quickActions = [
  {
    id: "upload",
    icon: Upload,
    title: "Upload Statement",
    desc: "AI-powered transaction analysis",
    color: "bg-forest",
    iconColor: "text-lime",
  },
  {
    id: "growth",
    icon: LineChart,
    title: "Growth Projection",
    desc: "See your money compound over time",
    color: "bg-lime",
    iconColor: "text-forest",
  },
  {
    id: "tax",
    icon: Calculator,
    title: "Tax Simulator",
    desc: "Federal + provincial tax calculator",
    color: "bg-forest",
    iconColor: "text-lime",
  },
  {
    id: "accounts",
    icon: BookOpen,
    title: "Learn Accounts",
    desc: "RRSP, TFSA & investment basics",
    color: "bg-lime",
    iconColor: "text-forest",
  },
]

const tips = [
  {
    icon: PiggyBank,
    title: "Start with $50/month",
    desc: "Even small amounts grow significantly with compound interest over 20+ years.",
  },
  {
    icon: Shield,
    title: "Max your TFSA first",
    desc: "Tax-free growth makes TFSA the best starting point for most Canadians.",
  },
  {
    icon: Sparkles,
    title: "Track every dollar",
    desc: "Upload your bank statement to discover spending patterns you didn't know about.",
  },
]

export function HomePage() {
  const { setActiveTab, userGoal, transactions, setChatOpen } = useAppStore()

  const goalLabel: Record<string, string> = {
    spending: "fixing your spending",
    saving: "growing your savings",
    taxes: "optimizing your taxes",
    growth: "building your wealth",
    general: "managing your finances",
  }

  return (
    <div className="space-y-10">
      {/* Welcome header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Welcome back
          </p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight text-forest">
            Your Financial{" "}
            <span className="bg-lime px-2 rounded-xl">Hub</span>
          </h1>
          {userGoal && (
            <p className="mt-2 text-muted-foreground">
              Focused on {goalLabel[userGoal] ?? "your finances"} — let's make progress today.
            </p>
          )}
        </div>
        {transactions.length > 0 && (
          <Button
            onClick={() => setActiveTab("dashboard")}
            className="gap-2 bg-forest text-primary-foreground hover:bg-forest-dark font-semibold shadow-sm"
          >
            <TrendingUp className="h-4 w-4" />
            View Dashboard
          </Button>
        )}
      </div>

      {/* Quick actions grid */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-forest">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(({ id, icon: Icon, title, desc, color, iconColor }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 text-left transition-all duration-200 hover:shadow-lg hover:border-forest/30"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color} shadow-sm`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
              <p className="text-base font-bold text-forest">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              <ArrowRight className="absolute right-5 top-6 h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Stats summary if user has transactions */}
      {transactions.length > 0 && (
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transactions Analyzed</p>
                <p className="mt-1 text-3xl font-bold text-forest">{transactions.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spending</p>
                <p className="mt-1 text-3xl font-bold text-forest">
                  ${transactions.reduce((s, t) => s + t.amount, 0).toFixed(2)}
                </p>
              </div>
              <Button
                onClick={() => setActiveTab("dashboard")}
                className="gap-2 bg-lime text-forest hover:bg-lime-dark font-semibold"
              >
                Full Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Assistant promo */}
      <button
        onClick={() => setChatOpen(true)}
        className="flex w-full items-center gap-4 rounded-2xl border border-forest/20 bg-forest/5 px-6 py-4 text-left transition-colors hover:bg-forest/10"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest text-lime shadow-sm">
          <MessageCircle className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-forest">Have a money question?</p>
          <p className="text-sm text-muted-foreground">Ask our AI assistant — TFSA, RRSP, budgeting, taxes, and more. Simple answers, instantly.</p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 text-sm font-semibold text-forest">
          <span>Chat now</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </button>

      {/* Tips section */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-forest">Financial Tips</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {tips.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-border bg-card hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10">
                  <Icon className="h-5 w-5 text-forest" />
                </div>
                <p className="font-semibold text-forest">{title}</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
