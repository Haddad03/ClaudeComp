"use client"

import { useState, useRef } from "react"
import { useAppStore } from "@/store/appStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TransactionTable } from "./TransactionTable"
import { parseCSV, generateMockTransactions, categorizeOffline } from "@/lib/parseStatement"
import type { CategorizedTransaction, RawTransaction } from "@/lib/types"
import { Upload, FileText, Sparkles, Trash2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { SubscriptionModal } from "@/components/auth/SubscriptionModal"

export function UploadSection() {
  const { transactions, setTransactions, clearTransactions, setActiveTab, currentUser, markFreeUploadUsed } =
    useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const canUpload = currentUser?.isSubscribed || !currentUser?.hasUsedFreeUpload

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
      markFreeUploadUsed()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Categorization failed")
    } finally {
      setLoading(false)
    }
  }

  async function handleFile(file: File) {
    if (!canUpload) { setShowPaywall(true); return }
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

  function loadDemo() {
    if (!canUpload) { setShowPaywall(true); return }
    const raw = generateMockTransactions()
    const categorized = categorizeOffline(raw)
    setTransactions(categorized)
    markFreeUploadUsed()
  }

  return (
    <>
    {showPaywall && <SubscriptionModal onClose={() => setShowPaywall(false)} />}
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-forest">
          Upload Statement
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload a CSV or PDF statement to analyze your spending and get AI insights
        </p>
      </div>

      {!canUpload && (
        <Alert className="border-amber-500/30 bg-amber-500/10">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700 font-medium">
            You&apos;ve used your free upload.{" "}
            <button onClick={() => setShowPaywall(true)} className="underline font-semibold hover:text-amber-900">
              Subscribe to upload more →
            </button>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      {/* Drop zone */}
      {transactions.length === 0 && (
        <Card
          className={cn(
            "cursor-pointer border-2 border-dashed transition-all duration-300",
            dragging
              ? "border-lime bg-lime/10 shadow-md"
              : "border-[--border] bg-card hover:border-forest/30 hover:shadow-sm"
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
              dragging ? "bg-forest/80 scale-110" : "bg-forest"
            )}>
              <Upload className={cn(
                "h-10 w-10 transition-all duration-300",
                dragging ? "text-lime scale-110" : "text-lime"
              )} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-forest text-lg">
                {dragging ? "Drop your file here..." : "Drag & drop your statement here"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                or click to browse (CSV or PDF)
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
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
          <div className="h-px flex-1 bg-[--border]" />
          <span className="text-sm font-medium text-muted-foreground">or try demo</span>
          <div className="h-px flex-1 bg-[--border]" />
        </div>
      )}

      {transactions.length === 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={loadDemo}
            className="gap-2 border-0 bg-lime hover:bg-lime-dark text-forest font-semibold px-6 py-3 shadow-sm transition-all duration-200"
          >
            <Sparkles className="h-4 w-4" />
            Try with demo data
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            ✨ 20 realistic Canadian transactions — instant, no API needed
          </p>
        </div>
      )}

      {/* Results */}
      {(transactions.length > 0 || loading) && (
        <Card className="border-[--border] bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base text-forest">
                <FileText className="h-4 w-4 text-forest" />
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
                      className="bg-lime text-forest hover:bg-lime-dark text-xs font-semibold"
                    >
                      View Dashboard
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={clearTransactions}
                      className="gap-1 border-[--border] text-muted-foreground hover:bg-cream-dark text-xs"
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
    </>
  )
}
