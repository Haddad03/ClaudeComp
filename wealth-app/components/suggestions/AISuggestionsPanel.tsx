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
    <Card className="border-[--border] bg-card hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg text-forest font-bold">
            <div className="p-2 rounded-xl bg-forest">
              <Sparkles className="h-5 w-5 text-lime" />
            </div>
            AI Spending Suggestions
          </CardTitle>
          {transactions.length > 0 && (
            <Button
              size="sm"
              onClick={analyse}
              disabled={loading}
              className="bg-lime text-forest hover:bg-lime-dark text-xs font-semibold shadow-sm"
            >
              {loading ? "Analysing…" : "Analyse"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">{error}</AlertDescription>
          </Alert>
        )}

        {loading &&
          [1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 rounded-xl border border-[--border] bg-cream-dark p-4">
              <Skeleton className="h-5 w-40 bg-[--border]" />
              <Skeleton className="h-3 w-full bg-[--border]" />
              <Skeleton className="h-3 w-3/4 bg-[--border]" />
            </div>
          ))}

        {!loading && suggestions.length === 0 && !error && (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
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
