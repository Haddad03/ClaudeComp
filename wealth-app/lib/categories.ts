import type { TransactionCategory } from "./types"

export const CATEGORIES: TransactionCategory[] = [
  "Food",
  "Rent",
  "Subscriptions",
  "Transportation",
  "Entertainment",
  "Other",
]

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  Food: "#10b981",
  Rent: "#3b82f6",
  Subscriptions: "#a855f7",
  Transportation: "#f97316",
  Entertainment: "#ec4899",
  Other: "#64748b",
}

export const CATEGORY_BG: Record<TransactionCategory, string> = {
  Food: "bg-emerald-500/20 text-emerald-400",
  Rent: "bg-blue-500/20 text-blue-400",
  Subscriptions: "bg-purple-500/20 text-purple-400",
  Transportation: "bg-orange-500/20 text-orange-400",
  Entertainment: "bg-pink-500/20 text-pink-400",
  Other: "bg-slate-500/20 text-slate-400",
}

export const CATEGORY_EMOJIS: Record<TransactionCategory, string> = {
  Food: "🍔",
  Rent: "🏠",
  Subscriptions: "📱",
  Transportation: "🚗",
  Entertainment: "🎬",
  Other: "📦",
}
