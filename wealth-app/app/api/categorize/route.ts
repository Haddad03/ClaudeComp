import { anthropic } from "@/lib/claude"
import type { RawTransaction, CategorizedTransaction } from "@/lib/types"

const SYSTEM_PROMPT = `You are a financial transaction categorizer for a Canadian budgeting app.
Categorize each transaction into EXACTLY one of these categories:
- Food (groceries, restaurants, coffee shops, food delivery like DoorDash/UberEats/SkipTheDishes)
- Rent (rent payments, utilities, electricity, internet, phone bills)
- Subscriptions (Netflix, Spotify, Amazon Prime, software, gym memberships, streaming services)
- Transportation (gas stations, Uber/Lyft/taxi, public transit, parking, car insurance)
- Entertainment (movies, concerts, bars, games, sports, hobbies)
- Other (everything else: clothing, medical, ATM, transfers, unknown)

Return ONLY a valid JSON array. No explanation. No markdown fences. No extra text.
Format: [{"id":"...","category":"Food","confidence":0.95},...]`

export async function POST(request: Request) {
  try {
    const { transactions }: { transactions: RawTransaction[] } =
      await request.json()

    if (!transactions?.length) {
      return Response.json([], { status: 200 })
    }

    // Process in batches of 50
    const batchSize = 50
    const allCategorized: CategorizedTransaction[] = []

    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize)

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Categorize these transactions:\n${JSON.stringify(
              batch.map((t) => ({
                id: t.id,
                description: t.description,
                amount: t.amount,
              }))
            )}`,
          },
        ],
      })

      const text =
        message.content[0].type === "text" ? message.content[0].text : "[]"

      let parsed: { id: string; category: string; confidence: number }[] = []
      try {
        // Strip any accidental markdown
        const clean = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim()
        parsed = JSON.parse(clean)
      } catch {
        // Fallback: mark all as Other with low confidence
        parsed = batch.map((t) => ({
          id: t.id,
          category: "Other",
          confidence: 0.5,
        }))
      }

      const categoryMap = new Map(parsed.map((p) => [p.id, p]))

      for (const tx of batch) {
        const cat = categoryMap.get(tx.id)
        allCategorized.push({
          ...tx,
          category: (cat?.category as CategorizedTransaction["category"]) ?? "Other",
          confidence: cat?.confidence ?? 0.5,
        })
      }
    }

    return Response.json(allCategorized)
  } catch (err) {
    console.error("Categorize error:", err)
    return new Response("Categorization failed", { status: 500 })
  }
}
