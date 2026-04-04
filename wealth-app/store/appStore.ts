"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  CategorizedTransaction,
  AISuggestion,
  TaxResult,
} from "@/lib/types"

interface AppStore {
  transactions: CategorizedTransaction[]
  suggestions: AISuggestion[]
  taxResult: TaxResult | null
  activeTab: string
  hasOnboarded: boolean
  userGoal: string | null
  theme: "light" | "dark"
  setTransactions: (t: CategorizedTransaction[]) => void
  setSuggestions: (s: AISuggestion[]) => void
  setTaxResult: (r: TaxResult) => void
  setActiveTab: (tab: string) => void
  clearTransactions: () => void
  completeOnboarding: (goal: string) => void
  resetOnboarding: () => void
  setTheme: (theme: "light" | "dark") => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      transactions: [],
      suggestions: [],
      taxResult: null,
      activeTab: "dashboard",
      hasOnboarded: false,
      userGoal: null,
      theme: "light",
      setTransactions: (transactions) => set({ transactions }),
      setSuggestions: (suggestions) => set({ suggestions }),
      setTaxResult: (taxResult) => set({ taxResult }),
      setActiveTab: (activeTab) => set({ activeTab }),
      clearTransactions: () =>
        set({ transactions: [], suggestions: [] }),
      completeOnboarding: (goal) =>
        set({ hasOnboarded: true, userGoal: goal, activeTab: "dashboard" }),
      resetOnboarding: () =>
        set({ hasOnboarded: false, userGoal: null }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "wealth-app-store",
      partialize: (state) => ({
        activeTab: state.activeTab,
        hasOnboarded: state.hasOnboarded,
        userGoal: state.userGoal,
        theme: state.theme,
      }),
    }
  )
)
