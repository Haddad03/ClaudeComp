"use client"

import { useAppStore } from "@/store/appStore"
import { Button } from "@/components/ui/button"
import { CheckCircle2, X, Zap, Upload, History, Sparkles, MessageCircle } from "lucide-react"

const PERKS = [
  { icon: Upload, text: "Unlimited statement uploads" },
  { icon: Sparkles, text: "AI spending suggestions & insights" },
  { icon: History, text: "Monthly history & year-over-year comparison" },
  { icon: MessageCircle, text: "Unlimited AI financial assistant chats" },
]

interface Props {
  onClose: () => void
}

export function SubscriptionModal({ onClose }: Props) {
  const { subscribe } = useAppStore()

  function handleSubscribe() {
    subscribe()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-[--border] bg-card shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-[--secondary] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime shadow-sm">
                <Zap className="h-7 w-7 text-forest" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Unlock WealthWise Pro</h2>
            <p className="text-muted-foreground text-sm">You&apos;ve used your free upload. Subscribe to keep going.</p>
          </div>

          {/* Perks */}
          <div className="rounded-xl bg-[--secondary] p-4 space-y-2.5">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest/10">
                  <Icon className="h-4 w-4 text-forest" />
                </div>
                <span className="text-sm text-foreground">{text}</span>
                <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500 shrink-0" />
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="rounded-xl border-2 border-forest bg-forest/5 p-4 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-forest">$4.99<span className="text-base font-normal text-muted-foreground"> / month</span></p>
            <p className="text-xs text-muted-foreground mt-1">Cancel anytime · 7-day free trial</p>
          </div>

          {/* CTA */}
          <Button
            onClick={handleSubscribe}
            className="w-full bg-forest text-primary-foreground hover:bg-forest-dark font-semibold text-base py-5"
          >
            Start Free Trial
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Demo mode — no real payment required
          </p>
        </div>
      </div>
    </div>
  )
}
