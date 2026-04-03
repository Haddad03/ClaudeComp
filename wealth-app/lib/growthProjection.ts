import type { ProjectionDataPoint } from "./types"

export function generateProjectionData(
  monthlyContribution: number,
  annualReturnRate: number,
  years: number,
  currentSavings: number = 0
): ProjectionDataPoint[] {
  const monthlyRate = annualReturnRate / 12
  const data: ProjectionDataPoint[] = []

  for (let year = 0; year <= years; year++) {
    const n = year * 12

    // FV of existing savings compounding
    const lumpSumGrowth = currentSavings * Math.pow(1 + monthlyRate, n)

    // FV of regular monthly contributions (annuity formula)
    const annuityValue =
      monthlyRate > 0
        ? monthlyContribution *
          ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate)
        : monthlyContribution * n

    data.push({
      year,
      withSavings: Math.round(lumpSumGrowth + annuityValue),
      withoutSavings: Math.round(currentSavings),
      contributionsOnly: Math.round(currentSavings + monthlyContribution * n),
    })
  }

  return data
}

export const SUGGESTED_RETURN_RATES: Record<string, number> = {
  "TFSA – High-Interest Savings": 0.045,
  "TFSA / RRSP – Balanced ETF (7%)": 0.07,
  "RRSP – Conservative Fund (5%)": 0.05,
  "FHSA – Moderate Portfolio (6%)": 0.06,
  "GIC – Locked-in (4%)": 0.04,
}

export function formatCAD(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}
