import type { AssetCategory, NetWorthItem, NetWorthState } from "./types"

export const ASSET_CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "investment", label: "Investment" },
  { value: "property", label: "Property" },
  { value: "other", label: "Other" },
]

export function sumItems(items: NetWorthItem[]): number {
  return items.reduce((s, i) => s + Math.max(0, i.amount), 0)
}

export function netWorthTotals(nw: NetWorthState) {
  const totalAssets = sumItems(nw.assets)
  const totalLiabilities = sumItems(nw.liabilities)
  return { totalAssets, totalLiabilities, net: totalAssets - totalLiabilities }
}

// Sum of assets tagged as investments — what the Growth tool can start from.
export function investmentTotal(nw: NetWorthState): number {
  return sumItems(nw.assets.filter((a) => a.category === "investment"))
}

export function hasNetWorthData(nw: NetWorthState): boolean {
  return nw.assets.length > 0 || nw.liabilities.length > 0
}
