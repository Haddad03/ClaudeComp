"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryBadge } from "./CategoryBadge"
import type { CategorizedTransaction } from "@/lib/types"

interface Props {
  transactions: CategorizedTransaction[]
  loading?: boolean
}

export function TransactionTable({ transactions, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-cream-dark rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[--border] bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-[--border] hover:bg-transparent bg-cream-dark">
            <TableHead className="text-forest font-semibold">Date</TableHead>
            <TableHead className="text-forest font-semibold">Description</TableHead>
            <TableHead className="text-right text-forest font-semibold">Amount</TableHead>
            <TableHead className="text-forest font-semibold">Category</TableHead>
            <TableHead className="text-right text-forest font-semibold">Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow
              key={tx.id}
              className="border-[--border] hover:bg-cream-dark transition-colors duration-200"
            >
              <TableCell className="text-muted-foreground text-sm font-medium">{tx.date || "—"}</TableCell>
              <TableCell className="max-w-[200px] truncate text-forest text-sm">{tx.description}</TableCell>
              <TableCell className="text-right font-mono text-emerald-600 text-sm font-semibold">
                ${tx.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <CategoryBadge category={tx.category} />
              </TableCell>
              <TableCell className="text-right text-xs">
                <span className={`font-semibold ${
                  Math.round(tx.confidence * 100) >= 90 ? "text-emerald-600" :
                  Math.round(tx.confidence * 100) >= 70 ? "text-amber-600" :
                  "text-muted-foreground"
                }`}>
                  {Math.round(tx.confidence * 100)}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
