import { cn } from "@/lib/utils"
import type { AISuggestion } from "@/lib/types"
import { TrendingDown, PiggyBank, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
}

const REDIRECT_COLORS: Record<string, string> = {
  TFSA: "text-cyan-400",
  RRSP: "text-violet-400",
  FHSA: "text-emerald-400",
  Savings: "text-blue-400",
}

export function SuggestionCard({ suggestion }: { suggestion: AISuggestion }) {
  return (
    <div className="rounded-lg border border-[--border] bg-[--secondary] p-4 transition-colors hover:border-violet-500/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p className="font-medium text-white">{suggestion.title}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 text-xs",
            PRIORITY_STYLES[suggestion.priority]
          )}
        >
          {suggestion.priority}
        </Badge>
      </div>

      <p className="mt-2 text-sm text-slate-400">{suggestion.detail}</p>

      {suggestion.monthlySavings > 0 && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <PiggyBank className="h-4 w-4 text-emerald-400" />
          <span className="text-emerald-400 font-medium">
            Save ~${suggestion.monthlySavings}/month
          </span>
          <ArrowRight className="h-3 w-3 text-slate-500" />
          <span className={cn("font-medium", REDIRECT_COLORS[suggestion.redirectTo])}>
            → {suggestion.redirectTo}
          </span>
        </div>
      )}
    </div>
  )
}
