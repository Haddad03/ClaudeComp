"use client"

import { useState } from "react"
import { useAppStore } from "@/store/appStore"
import { cn } from "@/lib/utils"
import {
  TrendingUp,
  ArrowRight,
  PiggyBank,
  Receipt,
  Calculator,
  LineChart,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const goals = [
  {
    id: "spending",
    icon: Receipt,
    title: "Fix my spending habits",
    desc: "Understand where my money goes and cut back",
    color: "violet",
  },
  {
    id: "saving",
    icon: PiggyBank,
    title: "Save more money",
    desc: "Build a savings plan and hit my goals faster",
    color: "cyan",
  },
  {
    id: "taxes",
    icon: Calculator,
    title: "Reduce my taxes",
    desc: "Optimise RRSP, TFSA and find tax savings",
    color: "emerald",
  },
  {
    id: "growth",
    icon: LineChart,
    title: "Grow my wealth",
    desc: "See how my money can compound over time",
    color: "blue",
  },
]

const features = [
  {
    emoji: "🤖",
    title: "AI Transaction Analysis",
    desc: "Upload your bank statement and Claude instantly categorizes every transaction",
  },
  {
    emoji: "🍁",
    title: "Canadian Tax Simulator",
    desc: "Calculate your federal + provincial taxes and find RRSP/TFSA opportunities",
  },
  {
    emoji: "📈",
    title: "Growth Projection",
    desc: "Visualize how small monthly savings snowball into real wealth over time",
  },
]

const colorMap: Record<string, string> = {
  violet: "border-violet-500/40 bg-violet-500/10 hover:border-violet-400/60 hover:bg-violet-500/20",
  cyan: "border-cyan-500/40 bg-cyan-500/10 hover:border-cyan-400/60 hover:bg-cyan-500/20",
  emerald: "border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-400/60 hover:bg-emerald-500/20",
  blue: "border-blue-500/40 bg-blue-500/10 hover:border-blue-400/60 hover:bg-blue-500/20",
}

const iconColorMap: Record<string, string> = {
  violet: "text-violet-400",
  cyan: "text-cyan-400",
  emerald: "text-emerald-400",
  blue: "text-blue-400",
}

export function LandingPage() {
  const { completeOnboarding } = useAppStore()
  const [step, setStep] = useState<"hero" | "goals">("hero")
  const [selected, setSelected] = useState<string | null>(null)

  function handleGoalSubmit() {
    if (!selected) return
    completeOnboarding(selected)
  }

  if (step === "goals") {
    return (
      <div className="-mx-4 -my-8 min-h-screen bg-[--background] flex flex-col items-center justify-center px-4 py-16">
        {/* Background glow */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/8 blur-3xl" />
        </div>

        <div className="relative w-full max-w-2xl">
          {/* Step indicator */}
          <div className="mb-8 flex items-center justify-center gap-2">
            <div className="h-2 w-8 rounded-full bg-violet-500/40" />
            <div className="h-2 w-8 rounded-full bg-violet-500" />
          </div>

          <div className="mb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
              Step 2 of 2
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              What&apos;s your main goal?
            </h2>
            <p className="mt-3 text-slate-400">
              We&apos;ll tailor your dashboard to focus on what matters most to you
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {goals.map(({ id, icon: Icon, title, desc, color }) => (
              <button
                key={id}
                onClick={() => setSelected(id)}
                className={cn(
                  "group relative flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200",
                  selected === id
                    ? colorMap[color] + " ring-1 ring-violet-400/30"
                    : "border-[--border] bg-[--card] hover:border-slate-600"
                )}
              >
                <div className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  selected === id ? `bg-${color}-500/20` : "bg-slate-800"
                )}>
                  <Icon className={cn("h-5 w-5", selected === id ? iconColorMap[color] : "text-slate-400 group-hover:" + iconColorMap[color])} />
                </div>
                <div className="flex-1">
                  <p className={cn("font-semibold", selected === id ? "text-white" : "text-slate-300")}>
                    {title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{desc}</p>
                </div>
                {selected === id && (
                  <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-violet-400" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Button
              onClick={handleGoalSubmit}
              disabled={!selected}
              className="gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 px-10 py-6 text-base font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-40"
            >
              <Sparkles className="h-4 w-4" />
              Launch my dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            <button
              onClick={() => setStep("hero")}
              className="text-sm text-slate-500 hover:text-slate-400 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="-mx-4 -my-8 min-h-screen bg-[--background] flex flex-col">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute right-1/4 top-2/3 h-[400px] w-[400px] rounded-full bg-cyan-600/8 blur-3xl" />
      </div>

      {/* Hero */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        {/* Logo mark */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-violet-700 shadow-xl shadow-violet-500/40">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            WealthWise
          </span>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-2 w-8 rounded-full bg-violet-500" />
          <div className="h-2 w-8 rounded-full bg-violet-500/30" />
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
          Get ready to take{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            control
          </span>{" "}
          of your finances
        </h1>

        <p className="mt-6 max-w-xl text-lg text-slate-400 leading-relaxed">
          WealthWise uses AI to analyse your spending, simulate your taxes, and
          show you exactly how to grow your money — built for Canadians who
          aren&apos;t millionaires yet.
        </p>

        <Button
          onClick={() => setStep("goals")}
          className="mt-10 gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 px-10 py-6 text-base font-semibold shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300"
        >
          Get started
          <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="mt-4 text-sm text-slate-600">
          No account required &nbsp;·&nbsp; Free to use &nbsp;·&nbsp; Your data stays on your device
        </p>

        {/* Feature cards */}
        <div className="mt-20 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[--border] bg-[--card] p-6 text-left hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300"
            >
              <div className="mb-3 text-3xl">{f.emoji}</div>
              <p className="font-semibold text-white">{f.title}</p>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex items-center gap-4 text-sm text-slate-600">
          <span>Already familiar?</span>
          <button
            onClick={() => completeOnboarding("general")}
            className="text-violet-400 hover:text-violet-300 underline underline-offset-4 transition-colors"
          >
            Skip intro and go to the app →
          </button>
        </div>
      </div>
    </div>
  )
}
