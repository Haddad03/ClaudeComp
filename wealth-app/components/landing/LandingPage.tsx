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
import { AuthPage } from "@/components/auth/AuthPage"

const goals = [
  {
    id: "spending",
    icon: Receipt,
    title: "Fix my spending habits",
    desc: "Understand where my money goes and cut back",
  },
  {
    id: "saving",
    icon: PiggyBank,
    title: "Save more money",
    desc: "Build a savings plan and hit my goals faster",
  },
  {
    id: "taxes",
    icon: Calculator,
    title: "Reduce my taxes",
    desc: "Optimise RRSP, TFSA and find tax savings",
  },
  {
    id: "growth",
    icon: LineChart,
    title: "Grow my wealth",
    desc: "See how my money can compound over time",
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

export function LandingPage() {
  const { completeOnboarding, currentUser } = useAppStore()
  const [step, setStep] = useState<"hero" | "goals" | "auth">("hero")
  const [selected, setSelected] = useState<string | null>(null)

  function handleGoalSubmit() {
    if (!selected) return
    // If already logged in, skip auth step
    if (currentUser) {
      completeOnboarding(selected)
    } else {
      setStep("auth")
    }
  }

  // Auth step — shown after goal selection
  if (step === "auth") {
    return (
      <div className="-mx-4 -my-8 min-h-screen bg-[--background]">
        <div className="absolute top-6 left-6">
          <button
            onClick={() => setStep("goals")}
            className="text-sm text-muted-foreground hover:text-forest transition-colors"
          >
            ← Back
          </button>
        </div>
        <AuthPage onSuccess={() => completeOnboarding(selected!)} />
      </div>
    )
  }

  if (step === "goals") {
    return (
      <div className="-mx-4 -my-8 min-h-screen bg-[--background] flex flex-col items-center justify-center px-4 py-16">
        <div className="relative w-full max-w-2xl">
          {/* Step indicator */}
          <div className="mb-8 flex items-center justify-center gap-2">
            <div className="h-2 w-8 rounded-full bg-forest/30" />
            <div className="h-2 w-8 rounded-full bg-forest" />
            <div className="h-2 w-8 rounded-full bg-forest/30" />
          </div>

          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Step 2 of 3
            </p>
            <h2 className="mt-3 text-3xl font-bold text-forest">
              What&apos;s your main goal?
            </h2>
            <p className="mt-3 text-muted-foreground">
              We&apos;ll tailor your dashboard to focus on what matters most to you
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {goals.map(({ id, icon: Icon, title, desc }) => (
              <button
                key={id}
                onClick={() => setSelected(id)}
                className={cn(
                  "group relative flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200",
                  selected === id
                    ? "border-lime bg-lime/10 ring-1 ring-lime/50"
                    : "border-[--border] bg-card hover:border-forest/20 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  selected === id ? "bg-forest" : "bg-cream-dark"
                )}>
                  <Icon className={cn("h-5 w-5", selected === id ? "text-lime" : "text-muted-foreground")} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-forest">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
                {selected === id && (
                  <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-forest" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Button
              onClick={handleGoalSubmit}
              disabled={!selected}
              className="gap-2 bg-lime text-forest hover:bg-lime-dark px-10 py-6 text-base font-semibold shadow-sm disabled:opacity-40"
            >
              <Sparkles className="h-4 w-4" />
              Launch my dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            <button
              onClick={() => setStep("hero")}
              className="text-sm text-muted-foreground hover:text-forest transition-colors"
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
      {/* Hero */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        {/* Logo mark */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest shadow-md">
            <TrendingUp className="h-6 w-6 text-lime" />
          </div>
          <span className="text-2xl font-bold text-forest">
            WealthWise
          </span>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-2 w-8 rounded-full bg-forest" />
          <div className="h-2 w-8 rounded-full bg-forest/30" />
          <div className="h-2 w-8 rounded-full bg-forest/30" />
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-forest sm:text-6xl">
          Get ready to take{" "}
          <span className="bg-lime px-2 rounded-xl">
            control
          </span>{" "}
          of your finances
        </h1>

        <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
          WealthWise uses AI to analyse your spending, simulate your taxes, and
          show you exactly how to grow your money — built for Canadians who
          aren&apos;t millionaires yet.
        </p>

        <Button
          onClick={() => setStep("goals")}
          className="mt-10 gap-2 bg-lime text-forest hover:bg-lime-dark px-10 py-6 text-base font-semibold shadow-md transition-all duration-300"
        >
          Get started
          <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="mt-4 text-sm text-muted-foreground">
          First upload free &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Your data stays on your device
        </p>

        {/* Feature cards */}
        <div className="mt-20 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[--border] bg-card p-6 text-left hover:border-forest/20 hover:shadow-md transition-all duration-300"
            >
              <div className="mb-3 text-3xl">{f.emoji}</div>
              <p className="font-semibold text-forest">{f.title}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex items-center gap-4 text-sm text-muted-foreground">
          <span>Already have an account?</span>
          <button
            onClick={() => { setSelected("general"); setStep("auth") }}
            className="text-forest hover:text-forest-dark underline underline-offset-4 transition-colors font-medium"
          >
            Log in →
          </button>
        </div>
      </div>
    </div>
  )
}
