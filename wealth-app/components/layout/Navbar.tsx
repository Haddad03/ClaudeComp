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
} from "lucide-react"

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

export function Navbar() {
  const { activeTab, setActiveTab, hasOnboarded, currentUser, logout } = useAppStore()

  if (!hasOnboarded) return null

  return (
    <nav className="sticky top-0 z-50 border-b border-[--border] bg-card shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest shadow-sm">
              <TrendingUp className="h-5 w-5 text-lime" />
            </div>
            <div>
              <span className="text-xl font-bold text-forest">WealthWise</span>
              <p className="text-xs text-muted-foreground">Financial Dashboard</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="hidden sm:flex gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
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

          <div className="flex items-center gap-2">
            {/* Mobile: active tab label */}
            <div className="sm:hidden flex items-center gap-2">
              {tabs.filter(t => activeTab === t.id).map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-forest" />
                  <span className="text-sm font-medium text-forest">{label}</span>
                </div>
              ))}
            </div>

            {/* User badge */}
            {currentUser && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-[--secondary] px-3 py-1.5">
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
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[--border] bg-card text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
