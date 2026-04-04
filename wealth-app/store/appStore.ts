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
  termsAccepted: boolean
  chatOpen: boolean
  setTransactions: (t: CategorizedTransaction[]) => void
  setSuggestions: (s: AISuggestion[]) => void
  setTaxResult: (r: TaxResult) => void
  setActiveTab: (tab: string) => void
  clearTransactions: () => void
  completeOnboarding: (goal: string) => void
  resetOnboarding: () => void
  setTheme: (theme: "light" | "dark") => void
  acceptTerms: () => void
  setChatOpen: (open: boolean) => void
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
      theme: "light",
      termsAccepted: false,
      chatOpen: false,
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
      setTheme: (theme) => set({ theme }),
      acceptTerms: () => set({ termsAccepted: true }),
      setChatOpen: (chatOpen) => set({ chatOpen }),
    }),
    {
      name: "wealth-app-store",
      partialize: (state) => ({
        activeTab: state.activeTab,
        hasOnboarded: state.hasOnboarded,
        userGoal: state.userGoal,
        theme: state.theme,
        termsAccepted: state.termsAccepted,
      }),
    }
  )
)
