"use client"

import { useState, useRef } from "react"
import { useAppStore } from "@/store/appStore"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, Eye, EyeOff, AlertCircle, CheckCircle2, Shield } from "lucide-react"

const TERMS_SECTIONS = [
  {
    title: "1. Not Financial Advice",
    body: "WealthWise is an educational tool only. Nothing on this platform constitutes financial, investment, tax, or legal advice. Always consult a qualified professional before making financial decisions.",
  },
  {
    title: "2. AI Limitations",
    body: "This app uses Claude by Anthropic to analyze data. AI can and does make mistakes. Do not rely solely on AI-generated content for financial decisions.",
  },
  {
    title: "3. Tax Information",
    body: "Tax calculations are estimates based on 2025 Canadian federal and provincial brackets. Consult the CRA or a certified accountant for accurate information.",
  },
  {
    title: "4. Data Privacy",
    body: "Financial data you upload is processed in your browser and sent to Anthropic for analysis. We do not store your financial data permanently.",
  },
  {
    title: "5. No Guarantees",
    body: "We make no warranties regarding accuracy or completeness. We are not responsible for any financial losses arising from use of this tool.",
  },
  {
    title: "6. User Responsibility",
    body: "By using this tool you acknowledge you are responsible for all financial decisions you make and agree to use it for lawful, personal educational purposes only.",
  },
]

interface Props {
  onSuccess?: () => void
}

export function AuthPage({ onSuccess }: Props) {
  const { login, signup, acceptTerms, currentUser } = useAppStore()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [step, setStep] = useState<"auth" | "terms">("auth")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setScrolledToBottom(true)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    setTimeout(() => {
      if (mode === "login") {
        const result = login(username.trim(), password)
        if (result === "invalid") {
          setError("Incorrect username or password.")
          setLoading(false)
          return
        }
        // Admin already has termsAccepted — skip terms step
        const user = useAppStore.getState().currentUser
        if (user?.termsAccepted) onSuccess?.()
        else setStep("terms")
      } else {
        if (!username.trim() || !email.trim() || !password) {
          setError("Please fill in all fields.")
          setLoading(false)
          return
        }
        if (password.length < 4) {
          setError("Password must be at least 4 characters.")
          setLoading(false)
          return
        }
        const result = signup(username.trim(), email.trim(), password)
        if (result === "exists") {
          setError("Username already taken. Try another.")
          setLoading(false)
          return
        }
        setStep("terms")
      }
      setLoading(false)
    }, 300)
  }

  function handleAcceptTerms() {
    acceptTerms()
    onSuccess?.()
  }

  // ── Terms step ──────────────────────────────────────────────
  if (step === "terms") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-lg space-y-5">
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest shadow-lg">
                <Shield className="h-7 w-7 text-lime" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Terms of Use & Disclaimer</h2>
            <p className="text-sm text-muted-foreground">Please read and accept before continuing</p>
          </div>

          <Card className="border-[--border] bg-card shadow-sm">
            <CardContent className="p-0">
              {/* Scrollable terms */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="h-72 overflow-y-auto p-5 space-y-4 text-sm"
              >
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 font-medium text-sm">
                  WealthWise is NOT a licensed financial advisor. All content is for educational purposes only.
                </div>

                {TERMS_SECTIONS.map((s) => (
                  <div key={s.title}>
                    <p className="font-semibold text-foreground mb-1">{s.title}</p>
                    <p className="text-muted-foreground leading-relaxed">{s.body}</p>
                  </div>
                ))}

                <div className="pt-2 text-center text-xs text-muted-foreground">
                  Built at the Claude Builders Hackathon @ McGill — April 4, 2026
                </div>
              </div>

              {/* Scroll hint */}
              {!scrolledToBottom && (
                <div className="border-t border-[--border] px-5 py-2 text-center text-xs text-muted-foreground">
                  Scroll down to read all terms
                </div>
              )}

              {/* Accept button */}
              <div className="border-t border-[--border] p-4 space-y-3">
                <Button
                  onClick={handleAcceptTerms}
                  disabled={!scrolledToBottom}
                  className="w-full bg-forest text-primary-foreground hover:bg-forest-dark font-semibold disabled:opacity-40"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  I Accept the Terms of Use
                </Button>
                {!scrolledToBottom && (
                  <p className="text-center text-xs text-muted-foreground">Read all terms above to continue</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ── Auth step ────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest shadow-lg">
              <TrendingUp className="h-8 w-8 text-lime" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-forest">WealthWise</h1>
          <p className="text-muted-foreground">Smart money tools for everyday Canadians</p>
        </div>

        <Card className="border-[--border] bg-card shadow-sm">
          <CardContent className="p-6 space-y-5">
            {/* Toggle */}
            <div className="flex rounded-xl bg-[--secondary] p-1">
              <button
                onClick={() => { setMode("login"); setError(null) }}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  mode === "login" ? "bg-card text-forest shadow-sm" : "text-muted-foreground hover:text-forest"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => { setMode("signup"); setError(null) }}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  mode === "signup" ? "bg-card text-forest shadow-sm" : "text-muted-foreground hover:text-forest"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground">Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. johndoe"
                  className="border-[--border] bg-[--secondary] text-foreground"
                  autoComplete="username"
                />
              </div>

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="border-[--border] bg-[--secondary] text-foreground"
                    autoComplete="email"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-muted-foreground">Password</Label>
                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-[--border] bg-[--secondary] text-foreground pr-10"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full bg-forest text-primary-foreground hover:bg-forest-dark font-semibold"
              >
                {loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
              </Button>
            </form>

            {mode === "login" && (
              <p className="text-center text-xs text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button onClick={() => { setMode("signup"); setError(null) }} className="font-semibold text-forest hover:underline">
                  Sign up free
                </button>
              </p>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          First upload is free · No credit card required to start
        </p>
      </div>
    </div>
  )
}
