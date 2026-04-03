import Anthropic from "@anthropic-ai/sdk"

// Server-side only — never import this in client components
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})
