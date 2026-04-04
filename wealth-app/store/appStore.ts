"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  CategorizedTransaction,
  AISuggestion,
  TaxResult,
  MonthlySnapshot,
  AppUser,
} from "@/lib/types"

const ADMIN: AppUser = {
  id: "admin",
  username: "admin",
  email: "admin@wealthwise.app",
  password: "admin",
  isSubscribed: true,
  hasUsedFreeUpload: false,
  termsAccepted: true,
  createdAt: new Date().toISOString(),
}

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
  currentUser: AppUser | null
  registeredUsers: AppUser[]
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
  login: (username: string, password: string) => "ok" | "invalid"
  signup: (username: string, email: string, password: string) => "ok" | "exists"
  logout: () => void
  subscribe: () => void
  markFreeUploadUsed: () => void
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
      currentUser: null,
      registeredUsers: [],
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
      acceptTerms: () => set((s) => {
        if (!s.currentUser) return { termsAccepted: true }
        const updated = { ...s.currentUser, termsAccepted: true }
        return {
          termsAccepted: true,
          currentUser: updated,
          registeredUsers: s.registeredUsers.map((u) => u.id === updated.id ? updated : u),
        }
      }),
      setChatOpen: (chatOpen) => set({ chatOpen }),
      login: (username, password) => {
        if (username === ADMIN.username && password === ADMIN.password) {
          set({ currentUser: ADMIN, hasOnboarded: false })
          return "ok"
        }
        const user = (useAppStore.getState().registeredUsers).find(
          (u) => u.username === username && u.password === password
        )
        if (!user) return "invalid"
        set({ currentUser: user, hasOnboarded: false })
        return "ok"
      },
      signup: (username, email, password) => {
        const exists = (useAppStore.getState().registeredUsers).some(
          (u) => u.username === username
        )
        if (exists) return "exists"
        const user: AppUser = {
          id: `user-${Date.now()}`,
          username,
          email,
          password,
          isSubscribed: false,
          hasUsedFreeUpload: false,
          termsAccepted: false,
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ registeredUsers: [...s.registeredUsers, user], currentUser: user, hasOnboarded: false }))
        return "ok"
      },
      logout: () => set({
        currentUser: null,
        hasOnboarded: false,
        transactions: [],
        suggestions: [],
        taxResult: null,
        activeTab: "home",
      }),
      subscribe: () => set((s) => {
        if (!s.currentUser) return {}
        const updated = { ...s.currentUser, isSubscribed: true }
        return {
          currentUser: updated,
          registeredUsers: s.registeredUsers.map((u) => u.id === updated.id ? updated : u),
        }
      }),
      markFreeUploadUsed: () => set((s) => {
        if (!s.currentUser) return {}
        const updated = { ...s.currentUser, hasUsedFreeUpload: true }
        return {
          currentUser: updated,
          registeredUsers: s.registeredUsers.map((u) => u.id === updated.id ? updated : u),
        }
      }),
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
        currentUser: state.currentUser,
        registeredUsers: state.registeredUsers,
      }),
    }
  )
)
