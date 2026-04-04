import { cn } from "@/lib/utils"
import type { AISuggestion } from "@/lib/types"
import { TrendingDown, PiggyBank, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-red-500/15 text-red-600 border-red-500/30",
  medium: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  low: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
}

const REDIRECT_COLORS: Record<string, string> = {
  TFSA: "text-forest font-bold",
  RRSP: "text-forest font-bold",
  FHSA: "text-forest font-bold",
  Savings: "text-forest font-bold",
}

export function SuggestionCard({ suggestion }: { suggestion: AISuggestion }) {
  return (
    <div className="rounded-2xl border border-[--border] bg-card p-5 transition-all duration-300 hover:border-forest/20 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cream-dark">
            <TrendingDown className="h-4 w-4 text-forest" />
          </div>
          <p className="font-semibold text-forest text-base">{suggestion.title}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 text-xs font-semibold border",
            PRIORITY_STYLES[suggestion.priority]
          )}
        >
          {suggestion.priority}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{suggestion.detail}</p>

      {suggestion.monthlySavings > 0 && (
        <div className="mt-4 pt-4 border-t border-[--border] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold">
              <span className="text-emerald-600">Save ~${suggestion.monthlySavings}</span>/month
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={cn("text-sm", REDIRECT_COLORS[suggestion.redirectTo] ?? "text-forest font-bold")}>
              {suggestion.redirectTo}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
