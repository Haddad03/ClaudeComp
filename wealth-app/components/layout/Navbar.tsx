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
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <nav className="sticky top-0 z-50 border-b border-[--border] bg-[--background]/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-2 py-4">
          {/* Logo */}
          <div className="mr-6 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">WealthWise</span>
          </div>

          {/* Tabs — horizontal scroll on mobile */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  activeTab === id
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
