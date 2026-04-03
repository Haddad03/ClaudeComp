import { anthropic } from "@/lib/claude"
import type { RawTransaction } from "@/lib/types"

let txCounter = 0
function nextId() {
  return `tx-${++txCounter}-${Date.now()}`
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return new Response("No file provided", { status: 400 })

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: base64 },
            },
            {
              type: "text",
              text: `Extract all transactions from this bank statement. Return ONLY a JSON array:
[{"date":"YYYY-MM-DD","description":"...","amount":0.00},...]
Use positive numbers for all amounts. No markdown, no explanation.`,
            },
          ],
        },
      ],
    })

    const text = message.content[0].type === "text" ? message.content[0].text : "[]"
    const clean = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim()

    const raw = JSON.parse(clean) as { date: string; description: string; amount: number }[]
    const transactions: RawTransaction[] = raw.map((t) => ({
      id: nextId(),
      date: t.date ?? "",
      description: t.description ?? "Unknown",
      amount: Math.abs(Number(t.amount) || 0),
    }))

    return Response.json(transactions)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("PDF parse error:", msg)
    return new Response(msg, { status: 500 })
  }
}
