"use client"

import { useState, useRef } from "react"
import { useAppStore } from "@/store/appStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TransactionTable } from "./TransactionTable"
import { parseCSV, generateMockTransactions } from "@/lib/parseStatement"
import type { CategorizedTransaction, RawTransaction } from "@/lib/types"
import { Upload, FileText, Sparkles, Trash2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function UploadSection() {
  const { transactions, setTransactions, clearTransactions, setActiveTab } =
    useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function processTransactions(raw: RawTransaction[]) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions: raw }),
      })
      if (!res.ok) throw new Error(await res.text())
      const categorized: CategorizedTransaction[] = await res.json()
      setTransactions(categorized)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Categorization failed")
    } finally {
      setLoading(false)
    }
  }

  async function handleFile(file: File) {
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file. PDF support coming soon.")
      return
    }
    try {
      const raw = await parseCSV(file)
      if (!raw.length) {
        setError("No transactions found. Check your CSV format.")
        return
      }
      await processTransactions(raw)
    } catch {
      setError("Failed to parse the file. Make sure it's a valid CSV.")
    }
  }

  async function loadDemo() {
    const raw = generateMockTransactions()
    await processTransactions(raw)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Upload Statement</h2>
        <p className="text-slate-400">
          Upload a bank or credit card statement (CSV) to get started
        </p>
      </div>

      {error && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      {/* Drop zone */}
      {transactions.length === 0 && (
        <Card
          className={cn(
            "cursor-pointer border-2 border-dashed bg-[--card] transition-colors",
            dragging
              ? "border-violet-500 bg-violet-500/5"
              : "border-[--border] hover:border-violet-500/50"
          )}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            const file = e.dataTransfer.files[0]
            if (file) handleFile(file)
          }}
        >
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20">
              <Upload className="h-8 w-8 text-violet-400" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-white">
                Drop your CSV here, or click to browse
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Supports TD, RBC, BMO, Scotiabank, CIBC exports
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Demo button */}
      {transactions.length === 0 && (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[--border]" />
          <span className="text-sm text-slate-500">or</span>
          <div className="h-px flex-1 bg-[--border]" />
        </div>
      )}

      {transactions.length === 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={loadDemo}
            disabled={loading}
            className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
            {loading ? "Loading…" : "Try with demo data"}
          </Button>
          <p className="mt-2 text-xs text-slate-500">
            20 realistic Canadian transactions, no upload needed
          </p>
        </div>
      )}

      {/* Results */}
      {(transactions.length > 0 || loading) && (
        <Card className="border-[--border] bg-[--card]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <FileText className="h-4 w-4 text-violet-400" />
                {loading
                  ? "Categorising with Claude AI…"
                  : `${transactions.length} Transactions`}
              </CardTitle>
              <div className="flex gap-2">
                {transactions.length > 0 && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("dashboard")}
                      className="bg-violet-600 hover:bg-violet-700 text-xs"
                    >
                      View Dashboard
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={clearTransactions}
                      className="gap-1 border-slate-700 text-slate-400 hover:bg-slate-800 text-xs"
                    >
                      <Trash2 className="h-3 w-3" />
                      Clear
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TransactionTable transactions={transactions} loading={loading} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
