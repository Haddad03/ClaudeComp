"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  CategorizedTransaction,
  AISuggestion,
  TaxResult,
  MonthlySnapshot,
} from "@/lib/types"

interface AppStore {
  transactions: CategorizedTransaction[]
  suggestions: AISuggestion[]
  taxResult: TaxResult | null
  activeTab: string
  hasOnboarded: boolean
  userGoal: string | null
  termsAccepted: boolean
  chatOpen: boolean
  snapshots: MonthlySnapshot[]
  setTransactions: (t: CategorizedTransaction[]) => void
  setSuggestions: (s: AISuggestion[]) => void
  setTaxResult: (r: TaxResult) => void
  setActiveTab: (tab: string) => void
  clearTransactions: () => void
  completeOnboarding: (goal: string) => void
  resetOnboarding: () => void
  acceptTerms: () => void
  setChatOpen: (open: boolean) => void
  saveSnapshot: (label: string) => void
  deleteSnapshot: (id: string) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      transactions: [],
      suggestions: [],
      taxResult: null,
      activeTab: "home",
      hasOnboarded: false,
      userGoal: null,
      termsAccepted: false,
      chatOpen: false,
      snapshots: [],
      setTransactions: (transactions) => set({ transactions }),
      setSuggestions: (suggestions) => set({ suggestions }),
      setTaxResult: (taxResult) => set({ taxResult }),
      setActiveTab: (activeTab) => set({ activeTab }),
      clearTransactions: () =>
        set({ transactions: [], suggestions: [] }),
      completeOnboarding: (goal) =>
        set({ hasOnboarded: true, userGoal: goal, activeTab: "home" }),
      resetOnboarding: () =>
        set({ hasOnboarded: false, userGoal: null }),
      acceptTerms: () => set({ termsAccepted: true }),
      setChatOpen: (chatOpen) => set({ chatOpen }),
      saveSnapshot: (label) =>
        set((state) => {
          const categoryTotals: Record<string, number> = {}
          for (const tx of state.transactions) {
            categoryTotals[tx.category] = (categoryTotals[tx.category] ?? 0) + tx.amount
          }
          const totalSpending = Object.values(categoryTotals).reduce((a, b) => a + b, 0)
          const now = new Date()
          const snapshot: MonthlySnapshot = {
            id: `snap-${Date.now()}`,
            label,
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            savedAt: now.toISOString(),
            transactions: state.transactions,
            totalSpending,
            categoryTotals,
          }
          return { snapshots: [...state.snapshots, snapshot] }
        }),
      deleteSnapshot: (id) =>
        set((state) => ({ snapshots: state.snapshots.filter((s) => s.id !== id) })),
    }),
    {
      name: "wealth-app-store",
      partialize: (state) => ({
        activeTab: state.activeTab,
        hasOnboarded: state.hasOnboarded,
        userGoal: state.userGoal,
        termsAccepted: state.termsAccepted,
        snapshots: state.snapshots,
      }),
    }
  )
)
