"use client"

import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/appStore"
import {
  TrendingUp,
  Upload,
  Calculator,
  BookOpen,
  LineChart,
  Shield,
} from "lucide-react"

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: TrendingUp },
  { id: "upload", label: "Upload Statement", icon: Upload },
  { id: "growth", label: "Growth Projection", icon: LineChart },
  { id: "accounts", label: "Learn Accounts", icon: BookOpen },
  { id: "tax", label: "Tax Simulator", icon: Calculator },
  { id: "terms", label: "Terms & Disclaimer", icon: Shield },
]

export function Navbar() {
  const { activeTab, setActiveTab, hasOnboarded } = useAppStore()

  if (!hasOnboarded) return null

  return (
    <nav className="sticky top-0 z-50 border-b border-[--border] bg-gradient-to-r from-[--background] via-[--background] to-violet-600/10 bg-[--background]/80 backdrop-blur-md shadow-lg shadow-violet-500/5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 shadow-lg shadow-violet-500/30">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">WealthWise</span>
              <p className="text-xs text-slate-500">Financial Dashboard</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="hidden sm:flex gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                  activeTab === id
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-lg shadow-violet-500/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-300"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Mobile menu toggle — just show icon for mobile */}
          <div className="sm:hidden flex items-center gap-2">
            {tabs.filter(t => activeTab === t.id).map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-violet-400" />
                <span className="text-sm text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
