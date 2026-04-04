"use client"

import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/appStore"
import {
  Home,
  TrendingUp,
  Upload,
  Calculator,
  BookOpen,
  LineChart,
  Shield,
  History,
  LogOut,
  Crown,
  MoreHorizontal,
} from "lucide-react"
import { useState } from "react"

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "dashboard", label: "Dashboard", icon: TrendingUp },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "growth", label: "Growth", icon: LineChart },
  { id: "accounts", label: "Accounts", icon: BookOpen },
  { id: "tax", label: "Tax Sim", icon: Calculator },
  { id: "history", label: "History", icon: History },
  { id: "terms", label: "Terms", icon: Shield },
]

// First 4 tabs shown in mobile bottom bar; rest in "More" sheet
const MOBILE_PRIMARY = ["home", "dashboard", "upload", "growth"]

export function Navbar() {
  const { activeTab, setActiveTab, hasOnboarded, currentUser, logout } = useAppStore()
  const [moreOpen, setMoreOpen] = useState(false)

  if (!hasOnboarded) return null

  const primaryTabs = tabs.filter((t) => MOBILE_PRIMARY.includes(t.id))
  const moreTabs = tabs.filter((t) => !MOBILE_PRIMARY.includes(t.id))

  return (
    <>
      {/* ── Desktop top navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-[--border] bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest shadow-sm">
                <TrendingUp className="h-5 w-5 text-lime" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-forest">WealthWise</span>
                <p className="text-xs text-muted-foreground">Financial Dashboard</p>
              </div>
              <span className="sm:hidden text-lg font-bold text-forest">WealthWise</span>
            </div>

            {/* Desktop tabs */}
            <div className="hidden sm:flex gap-1 flex-wrap">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                    activeTab === id
                      ? "bg-lime text-forest shadow-sm"
                      : "text-muted-foreground hover:bg-cream-dark hover:text-forest"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Desktop user badge */}
              {currentUser && (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-xl bg-[--secondary] px-3 py-1.5">
                    {(currentUser.isSubscribed || currentUser.id === "admin") && (
                      <Crown className="h-3.5 w-3.5 text-amber-500" />
                    )}
                    <span className="text-sm font-medium text-foreground">{currentUser.username}</span>
                    {!currentUser.isSubscribed && currentUser.id !== "admin" && (
                      <span className="text-xs text-muted-foreground">· Free</span>
                    )}
                  </div>
                  <button
                    onClick={logout}
                    title="Log out"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[--border] bg-card text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Mobile: user initial + logout */}
              {currentUser && (
                <div className="sm:hidden flex items-center gap-2">
                  {(currentUser.isSubscribed || currentUser.id === "admin") && (
                    <Crown className="h-4 w-4 text-amber-500" />
                  )}
                  <button
                    onClick={logout}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[--border] bg-card text-muted-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom tab bar ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[--border] bg-card pb-safe">
        <div className="flex items-stretch">
          {primaryTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setMoreOpen(false) }}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                activeTab === id
                  ? "text-forest"
                  : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", activeTab === id && "stroke-[2.5]")} />
              {label}
            </button>
          ))}

          {/* More button */}
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
              moreTabs.some((t) => t.id === activeTab) ? "text-forest" : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            More
          </button>
        </div>
      </div>

      {/* ── Mobile "More" sheet ── */}
      {moreOpen && (
        <div className="sm:hidden fixed inset-0 z-40" onClick={() => setMoreOpen(false)}>
          <div
            className="absolute bottom-16 left-0 right-0 border-t border-[--border] bg-card px-4 py-3 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 gap-2">
              {moreTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { setActiveTab(id); setMoreOpen(false) }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    activeTab === id
                      ? "bg-lime text-forest"
                      : "bg-[--secondary] text-muted-foreground hover:text-forest"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile bottom padding spacer ── */}
      <div className="sm:hidden h-16" aria-hidden />
    </>
  )
}
