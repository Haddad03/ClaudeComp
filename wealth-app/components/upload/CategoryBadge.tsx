import { cn } from "@/lib/utils"
import { CATEGORY_BG, CATEGORY_EMOJIS } from "@/lib/categories"
import type { TransactionCategory } from "@/lib/types"

export function CategoryBadge({ category }: { category: TransactionCategory }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        CATEGORY_BG[category]
      )}
    >
      {CATEGORY_EMOJIS[category]} {category}
    </span>
  )
}
