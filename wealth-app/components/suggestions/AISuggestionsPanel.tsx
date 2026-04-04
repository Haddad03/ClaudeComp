"use client"

import { useState } from "react"
import { useAppStore } from "@/store/appStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, AlertCircle } from "lucide-react"
import { SuggestionCard } from "./SuggestionCard"
import type { AISuggestion } from "@/lib/types"

export function AISuggestionsPanel() {
  const { transactions, suggestions, setSuggestions } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function analyse() {
    setLoading(true)
    setError(null)

    const totals: Record<string, number> = {}
    let totalSpend = 0
    for (const tx of transactions) {
      totals[tx.category] = (totals[tx.category] ?? 0) + tx.amount
      totalSpend += tx.amount
    }

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryTotals: totals, totalSpend }),
      })

      if (!res.ok) throw new Error(await res.text())

      const data: AISuggestion[] = await res.json()
      setSuggestions(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-[--border] bg-gradient-to-br from-slate-900/60 to-slate-950/40 hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg text-white font-bold">
            <div className="p-2 rounded-lg bg-violet-600/20">
              <Sparkles className="h-5 w-5 text-violet-400" />
            </div>
            AI Spending Suggestions
          </CardTitle>
          {transactions.length > 0 && (
            <Button
              size="sm"
              onClick={analyse}
              disabled={loading}
              className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-xs font-semibold shadow-lg shadow-violet-500/20"
            >
              {loading ? "Analysing…" : "Analyse"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {loading &&
          [1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
              <Skeleton className="h-5 w-40 bg-slate-700" />
              <Skeleton className="h-3 w-full bg-slate-700" />
              <Skeleton className="h-3 w-3/4 bg-slate-700" />
            </div>
          ))}

        {!loading && suggestions.length === 0 && !error && (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-400">
              💡 Click &ldquo;Analyse&rdquo; to get personalized savings recommendations
            </p>
          </div>
        )}

        {!loading &&
          suggestions.map((s, i) => <SuggestionCard key={i} suggestion={s} />)}
      </CardContent>
    </Card>
  )
}
