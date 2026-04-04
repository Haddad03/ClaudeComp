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
    <div className="rounded-lg border border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-900/40 p-5 transition-all duration-300 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 hover:from-slate-800/60">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-700/50">
            <TrendingDown className="h-4 w-4 text-slate-300" />
          </div>
          <p className="font-semibold text-white text-base">{suggestion.title}</p>
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

      <p className="text-sm text-slate-300 leading-relaxed">{suggestion.detail}</p>

      {suggestion.monthlySavings > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold">
              <span className="text-emerald-400">Save ~${suggestion.monthlySavings}</span>/month
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
            <span className={cn("font-semibold text-sm", REDIRECT_COLORS[suggestion.redirectTo])}>
              {suggestion.redirectTo}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
