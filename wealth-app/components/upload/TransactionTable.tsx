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
          <Skeleton key={i} className="h-12 w-full bg-slate-700/50 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[--border] bg-gradient-to-b from-slate-950/50 to-slate-950/20">
      <Table>
        <TableHeader>
          <TableRow className="border-[--border] hover:bg-transparent bg-slate-900/50">
            <TableHead className="text-violet-400 font-semibold">Date</TableHead>
            <TableHead className="text-violet-400 font-semibold">Description</TableHead>
            <TableHead className="text-right text-violet-400 font-semibold">Amount</TableHead>
            <TableHead className="text-violet-400 font-semibold">Category</TableHead>
            <TableHead className="text-right text-violet-400 font-semibold">Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx, idx) => (
            <TableRow
              key={tx.id}
              className="border-[--border] hover:bg-white/5 transition-colors duration-200 even:bg-white/2"
            >
              <TableCell className="text-slate-400 text-sm font-medium">{tx.date || "—"}</TableCell>
              <TableCell className="max-w-[200px] truncate text-white text-sm">{tx.description}</TableCell>
              <TableCell className="text-right font-mono text-emerald-400 text-sm font-semibold">
                ${tx.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <CategoryBadge category={tx.category} />
              </TableCell>
              <TableCell className="text-right text-xs">
                <span className={`font-semibold ${
                  Math.round(tx.confidence * 100) >= 90 ? "text-emerald-400" :
                  Math.round(tx.confidence * 100) >= 70 ? "text-yellow-400" :
                  "text-slate-400"
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
