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
    if (file.name.endsWith(".pdf")) {
      setLoading(true)
      setError(null)
      try {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("/api/parse-pdf", { method: "POST", body: formData })
        if (!res.ok) throw new Error(await res.text())
        const raw: RawTransaction[] = await res.json()
        if (!raw.length) {
          setError("No transactions found in the PDF.")
          return
        }
        await processTransactions(raw)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to parse PDF.")
      } finally {
        setLoading(false)
      }
      return
    }

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV or PDF file.")
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
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Upload Statement
        </h1>
        <p className="text-lg text-slate-400">
          Upload a CSV or PDF statement to analyze your spending and get AI insights
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
            "cursor-pointer border-2 border-dashed bg-gradient-to-br transition-all duration-300",
            dragging
              ? "border-violet-500 from-violet-600/20 to-violet-600/5 shadow-lg shadow-violet-500/20"
              : "border-[--border] from-slate-600/5 to-slate-500/5 hover:border-violet-500/50 hover:shadow-md hover:shadow-violet-500/10"
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
          <CardContent className="flex flex-col items-center gap-4 py-20">
            <div className={cn(
              "flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300",
              dragging ? "bg-violet-600/30 scale-110" : "bg-violet-600/20"
            )}>
              <Upload className={cn(
                "h-10 w-10 transition-all duration-300",
                dragging ? "text-violet-300 scale-110" : "text-violet-400"
              )} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-white text-lg">
                {dragging ? "Drop your file here..." : "Drag & drop your statement here"}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                or click to browse (CSV or PDF)
              </p>
              <p className="mt-3 text-xs text-slate-500">
                💡 Supports TD, RBC, BMO, Scotiabank, CIBC and others
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.pdf"
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
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-[--border] to-transparent" />
          <span className="text-sm font-medium text-slate-500">or try demo</span>
          <div className="h-px flex-1 bg-gradient-to-l from-[--border] to-transparent" />
        </div>
      )}

      {transactions.length === 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={loadDemo}
            disabled={loading}
            className="gap-2 border-0 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white font-semibold px-6 py-3 shadow-lg shadow-violet-500/30 hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-200"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Loading…" : "Try with demo data"}
          </Button>
          <p className="mt-3 text-sm text-slate-400">
            ✨ 20 realistic Canadian transactions, no upload needed
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
