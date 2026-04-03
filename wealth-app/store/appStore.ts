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
  setTransactions: (t: CategorizedTransaction[]) => void
  setSuggestions: (s: AISuggestion[]) => void
  setTaxResult: (r: TaxResult) => void
  setActiveTab: (tab: string) => void
  clearTransactions: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      transactions: [],
      suggestions: [],
      taxResult: null,
      activeTab: "dashboard",
      setTransactions: (transactions) => set({ transactions }),
      setSuggestions: (suggestions) => set({ suggestions }),
      setTaxResult: (taxResult) => set({ taxResult }),
      setActiveTab: (activeTab) => set({ activeTab }),
      clearTransactions: () =>
        set({ transactions: [], suggestions: [] }),
    }),
    {
      name: "wealth-app-store",
      // Never persist sensitive financial data to localStorage
      partialize: (state) => ({ activeTab: state.activeTab }),
    }
  )
)
