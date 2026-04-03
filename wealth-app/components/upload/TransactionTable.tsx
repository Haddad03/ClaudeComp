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
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full bg-slate-800" />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[--border]">
      <Table>
        <TableHeader>
          <TableRow className="border-[--border] hover:bg-transparent">
            <TableHead className="text-slate-400">Date</TableHead>
            <TableHead className="text-slate-400">Description</TableHead>
            <TableHead className="text-right text-slate-400">Amount</TableHead>
            <TableHead className="text-slate-400">Category</TableHead>
            <TableHead className="text-right text-slate-400">Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow
              key={tx.id}
              className="border-[--border] hover:bg-white/5"
            >
              <TableCell className="text-slate-400 text-sm">{tx.date || "—"}</TableCell>
              <TableCell className="max-w-[200px] truncate text-white text-sm">
                {tx.description}
              </TableCell>
              <TableCell className="text-right font-mono text-white text-sm">
                ${tx.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <CategoryBadge category={tx.category} />
              </TableCell>
              <TableCell className="text-right text-xs text-slate-500">
                {Math.round(tx.confidence * 100)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
