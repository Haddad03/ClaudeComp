import { anthropic } from "@/lib/claude"

const SYSTEM_PROMPT = `You are a friendly financial coach helping young Canadians manage their money.
Analyse the spending summary and return 3-5 specific, actionable suggestions.
Tone: encouraging, non-judgmental, simple language (no jargon).
Always reference TFSA, RRSP, or FHSA when suggesting where to redirect savings.

Return ONLY a valid JSON array. No markdown, no explanation.
Format:
[
  {
    "title": "Short title",
    "detail": "2-3 sentence explanation with specific amounts",
    "monthlySavings": 45,
    "redirectTo": "TFSA",
    "priority": "high"
  }
]
priority must be "high", "medium", or "low".
redirectTo must be "TFSA", "RRSP", "FHSA", or "Savings".`

export async function POST(request: Request) {
  try {
    const {
      categoryTotals,
      totalSpend,
    }: { categoryTotals: Record<string, number>; totalSpend: number } =
      await request.json()

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Monthly spending breakdown (CAD):
${Object.entries(categoryTotals)
  .map(([cat, amt]) => `- ${cat}: $${amt.toFixed(2)}`)
  .join("\n")}

Total spend: $${totalSpend.toFixed(2)}

Give me 3-5 specific suggestions to improve my finances.`,
        },
      ],
    })

    const text =
      message.content[0].type === "text" ? message.content[0].text : "[]"
    const clean = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim()

    const suggestions = JSON.parse(clean)
    return Response.json(suggestions)
  } catch (err) {
    console.error("Suggestions error:", err)
    return new Response("Analysis failed", { status: 500 })
  }
}
