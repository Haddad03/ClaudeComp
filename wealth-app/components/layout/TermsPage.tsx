import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle } from "lucide-react"

const sections = [
  {
    title: "1. Not Financial Advice",
    content:
      "WealthWise is an educational tool only. Nothing on this platform constitutes financial, investment, tax, or legal advice. All information, projections, calculations, and AI-generated suggestions are provided for informational and illustrative purposes only. Always consult a qualified financial advisor, tax professional, or lawyer before making financial decisions.",
  },
  {
    title: "2. AI Limitations",
    content:
      "This application uses artificial intelligence (Claude by Anthropic) to analyze data and generate suggestions. AI can and does make mistakes. The categorization of transactions, spending suggestions, and other AI-generated content may be inaccurate, incomplete, or inappropriate for your specific situation. Do not rely solely on AI-generated content for financial decisions.",
  },
  {
    title: "3. Tax Information",
    content:
      "Tax calculations are based on publicly available 2025 Canadian federal and provincial tax brackets. These are estimates only and do not account for all deductions, credits, surtaxes, income types, or individual circumstances. Tax laws change frequently. Consult the Canada Revenue Agency (CRA) or a certified accountant for accurate tax information.",
  },
  {
    title: "4. Investment Projections",
    content:
      "Growth projections use compound interest formulas for illustrative purposes only. Past investment performance does not guarantee future results. Actual returns will vary based on market conditions, fees, investment choices, and other factors. Projected returns may be significantly higher or lower than actual results.",
  },
  {
    title: "5. Data Privacy",
    content:
      "Any financial data you upload or enter is processed in your browser and sent to our AI provider (Anthropic) for analysis. We do not store your financial data permanently. Do not upload documents containing sensitive personal information beyond what is necessary for the tool to function. Review Anthropic's privacy policy for information on how your data is processed.",
  },
  {
    title: "6. No Guarantees",
    content:
      "We make no warranties, express or implied, regarding the accuracy, completeness, reliability, or suitability of this tool for any purpose. The information provided may contain errors. We are not responsible for any financial losses, damages, or consequences arising from the use of this tool.",
  },
  {
    title: "7. User Responsibility",
    content:
      "By using this tool, you acknowledge that you are responsible for all financial decisions you make. You agree to use this tool only for lawful, personal educational purposes. You agree not to upload data belonging to others without their consent.",
  },
  {
    title: "8. Registered Accounts Information",
    content:
      "Information about TFSA, RRSP, and FHSA is based on publicly available CRA guidelines as of 2025/2026. Contribution limits, rules, and eligibility criteria may change. Verify current limits and rules with the CRA at canada.ca before making contributions.",
  },
]

export function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms of Use & Disclaimer</h1>
        <p className="text-lg font-medium text-muted-foreground mt-2">
          Please read this carefully before using WealthWise
        </p>
      </div>

      <Alert className="border-amber-500/40 bg-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-base font-semibold text-amber-800">
          <strong>Important:</strong> WealthWise is NOT a licensed financial advisor. All content is for educational purposes only. AI can make mistakes. Always consult a professional before making financial decisions.
        </AlertDescription>
      </Alert>

      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-emerald-700">
            <Shield className="h-4 w-4" />
            Our Commitment
          </CardTitle>
        </CardHeader>
        <CardContent className="text-base text-foreground leading-relaxed">
          WealthWise was built to help everyday Canadians — especially young people who don't have $1 million — understand their finances better. We believe financial literacy should be accessible to everyone. We are students building a free educational tool at a hackathon, not a regulated financial services company.
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sections.map((s) => (
          <Card key={s.title} className="border-[--border] bg-card">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xl font-semibold text-foreground">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-base text-muted-foreground leading-relaxed">{s.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-xl border border-[--border] bg-[--secondary] p-4 text-center text-sm text-muted-foreground">
        <p>Built with ❤️ at the Claude Builders Hackathon @ McGill — April 4, 2026</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Powered by Claude AI (Anthropic) · Not affiliated with the CRA or any financial institution
        </p>
      </div>
    </div>
  )
}
