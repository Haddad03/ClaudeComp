import { anthropic } from "@/lib/claude"
import type { RawTransaction, CategorizedTransaction, TransactionCategory } from "@/lib/types"

const VALID_CATEGORIES: TransactionCategory[] = [
  "Groceries", "Restaurants & Dining", "Coffee & Cafes", "Fast Food", "Alcohol & Bars",
  "Rent & Mortgage", "Utilities", "Internet & Phone", "Insurance",
  "Gas & Fuel", "Public Transit", "Ride Share", "Travel & Flights", "Hotels & Accommodation",
  "Streaming & Media", "Software & Apps", "Gym & Fitness",
  "Clothing & Apparel", "Electronics", "Home & Garden", "Personal Care & Beauty",
  "Pharmacy & Medicine", "Doctor & Dental", "Education", "Pet Care", "Charity & Donations",
  "ATM & Banking", "Transfers", "Investments", "Other",
]

const VALID_SET = new Set(VALID_CATEGORIES.map((c) => c.toLowerCase()))
const CATEGORY_BY_LOWER = new Map(VALID_CATEGORIES.map((c) => [c.toLowerCase(), c]))

function resolveCategory(raw: string): TransactionCategory {
  const lower = raw?.trim().toLowerCase()
  if (VALID_SET.has(lower)) return CATEGORY_BY_LOWER.get(lower)!
  // Fuzzy fallback: find a valid category that contains the returned word
  for (const [key, cat] of CATEGORY_BY_LOWER) {
    if (key.includes(lower) || lower.includes(key.split(" ")[0])) return cat
  }
  return "Other"
}

const SYSTEM_PROMPT = `You are a transaction categorizer. Use ONLY these exact category names:
"Groceries", "Restaurants & Dining", "Coffee & Cafes", "Fast Food", "Alcohol & Bars",
"Rent & Mortgage", "Utilities", "Internet & Phone", "Insurance",
"Gas & Fuel", "Public Transit", "Ride Share", "Travel & Flights", "Hotels & Accommodation",
"Streaming & Media", "Software & Apps", "Gym & Fitness",
"Clothing & Apparel", "Electronics", "Home & Garden", "Personal Care & Beauty",
"Pharmacy & Medicine", "Doctor & Dental", "Education", "Pet Care", "Charity & Donations",
"ATM & Banking", "Transfers", "Investments", "Other".
Return ONLY a JSON array: [{"id":"...","category":"Groceries","confidence":0.95},...]`

export async function POST(request: Request) {
  try {
    const { transactions }: { transactions: RawTransaction[] } =
      await request.json()

    if (!transactions?.length) {
      return Response.json([], { status: 200 })
    }

    const batchSize = 20
    const allCategorized: CategorizedTransaction[] = []

    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize)

      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Categorize these transactions:\n${JSON.stringify(
              batch.map((t) => ({ id: t.id, description: t.description, amount: t.amount }))
            )}`,
          },
        ],
      })

      const text =
        message.content[0].type === "text" ? message.content[0].text : "[]"

      let parsed: { id: string; category: string; confidence: number }[] = []
      try {
        const clean = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim()
        console.log("RAW RESPONSE:", clean.slice(0, 500))
        parsed = JSON.parse(clean)
        console.log("PARSED SAMPLE:", parsed[0])
      } catch (e) {
        console.log("PARSE FAILED:", e, "RAW:", text.slice(0, 300))
        parsed = batch.map((t) => ({ id: t.id, category: "Other", confidence: 0.5 }))
      }

      const categoryMap = new Map(parsed.map((p) => [p.id, p]))

      for (const tx of batch) {
        const cat = categoryMap.get(tx.id)
        allCategorized.push({
          ...tx,
          category: cat?.category ? resolveCategory(cat.category) : "Other",
          confidence: cat?.confidence ?? 0.5,
        })
      }
    }

    return Response.json(allCategorized)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("Categorize error:", msg)
    return new Response("Categorization failed", { status: 500 })
  }
}
