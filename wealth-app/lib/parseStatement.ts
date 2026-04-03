"use client"

import Papa from "papaparse"
import type { RawTransaction } from "./types"

let txCounter = 0

function nextId() {
  return `tx-${++txCounter}-${Date.now()}`
}

// Detect which column is which regardless of bank CSV format
function detectColumns(headers: string[]): {
  date: string | null
  description: string | null
  amount: string | null
  debit: string | null
  credit: string | null
} {
  const h = headers.map((x) => x.toLowerCase().trim())

  const find = (candidates: string[]) =>
    headers[h.findIndex((col) => candidates.some((c) => col.includes(c)))] ??
    null

  return {
    date: find(["date", "transaction date", "trans date", "posted date"]),
    description: find(["description", "memo", "payee", "details", "transaction"]),
    amount: find(["amount", "amt"]),
    debit: find(["debit", "withdrawal", "charge"]),
    credit: find(["credit", "deposit"]),
  }
}

export function parseCSV(file: File): Promise<RawTransaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        try {
          const rows = results.data as Record<string, string>[]
          if (!rows.length) {
            resolve([])
            return
          }

          const cols = detectColumns(Object.keys(rows[0]))
          const transactions: RawTransaction[] = []

          for (const row of rows) {
            const rawAmount = cols.amount
              ? row[cols.amount]
              : cols.debit
              ? row[cols.debit!]
              : cols.credit
              ? row[cols.credit!]
              : null

            if (!rawAmount) continue

            const amount = parseFloat(
              rawAmount.replace(/[$,\s]/g, "").replace(/[()]/g, "-")
            )
            if (isNaN(amount)) continue

            transactions.push({
              id: nextId(),
              date: cols.date ? row[cols.date] : "",
              description: cols.description
                ? row[cols.description]
                : "Unknown",
              amount: Math.abs(amount),
            })
          }

          resolve(transactions)
        } catch (err) {
          reject(err)
        }
      },
      error: reject,
    })
  })
}

// Generate mock transactions for demo purposes
export function generateMockTransactions(): RawTransaction[] {
  const mockData = [
    { description: "METRO GROCERY STORE", amount: 87.43, date: "2024-03-01" },
    { description: "NETFLIX SUBSCRIPTION", amount: 17.99, date: "2024-03-02" },
    { description: "UBER TRIP", amount: 14.5, date: "2024-03-03" },
    { description: "LANDLORD RENT PAYMENT", amount: 1450.0, date: "2024-03-01" },
    { description: "STARBUCKS COFFEE", amount: 6.75, date: "2024-03-04" },
    { description: "SPOTIFY PREMIUM", amount: 10.99, date: "2024-03-05" },
    { description: "CINEPLEX MOVIES", amount: 28.5, date: "2024-03-06" },
    { description: "GAS STATION ESSO", amount: 65.2, date: "2024-03-07" },
    { description: "SOBEYS SUPERMARKET", amount: 124.67, date: "2024-03-08" },
    { description: "AMAZON PRIME", amount: 9.99, date: "2024-03-09" },
    { description: "TTC MONTHLY PASS", amount: 143.0, date: "2024-03-10" },
    { description: "SKIP THE DISHES", amount: 32.85, date: "2024-03-11" },
    { description: "ROGERS PHONE BILL", amount: 75.0, date: "2024-03-12" },
    { description: "MCDONALDS", amount: 11.45, date: "2024-03-13" },
    { description: "SPORT CHEK", amount: 89.99, date: "2024-03-14" },
    { description: "HYDRO ELECTRIC BILL", amount: 95.0, date: "2024-03-15" },
    { description: "YOUTUBE PREMIUM", amount: 13.99, date: "2024-03-16" },
    { description: "UBER EATS ORDER", amount: 44.2, date: "2024-03-17" },
    { description: "SHOPPERS DRUG MART", amount: 38.5, date: "2024-03-18" },
    { description: "STEAM GAME PURCHASE", amount: 29.99, date: "2024-03-19" },
  ]

  return mockData.map((t) => ({ ...t, id: nextId() }))
}
