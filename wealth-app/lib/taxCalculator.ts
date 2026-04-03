import type { TaxResult } from "./types"

interface TaxBracket {
  min: number
  max: number
  rate: number
}

// 2025 Federal brackets
const FEDERAL_BRACKETS: TaxBracket[] = [
  { min: 0, max: 57375, rate: 0.15 },
  { min: 57375, max: 114750, rate: 0.205 },
  { min: 114750, max: 158519, rate: 0.26 },
  { min: 158519, max: 220000, rate: 0.29 },
  { min: 220000, max: Infinity, rate: 0.33 },
]

const FEDERAL_BPA = 15705

// Provincial brackets (2025)
const PROVINCIAL_BRACKETS: Record<string, TaxBracket[]> = {
  ON: [
    { min: 0, max: 51446, rate: 0.0505 },
    { min: 51446, max: 102894, rate: 0.0915 },
    { min: 102894, max: 150000, rate: 0.1116 },
    { min: 150000, max: 220000, rate: 0.1216 },
    { min: 220000, max: Infinity, rate: 0.1316 },
  ],
  BC: [
    { min: 0, max: 45654, rate: 0.0506 },
    { min: 45654, max: 91310, rate: 0.077 },
    { min: 91310, max: 104835, rate: 0.105 },
    { min: 104835, max: 127299, rate: 0.1229 },
    { min: 127299, max: 172602, rate: 0.147 },
    { min: 172602, max: 240716, rate: 0.168 },
    { min: 240716, max: Infinity, rate: 0.205 },
  ],
  QC: [
    { min: 0, max: 51780, rate: 0.14 },
    { min: 51780, max: 103545, rate: 0.19 },
    { min: 103545, max: 126000, rate: 0.24 },
    { min: 126000, max: Infinity, rate: 0.2575 },
  ],
  AB: [
    { min: 0, max: 148269, rate: 0.1 },
    { min: 148269, max: 177922, rate: 0.12 },
    { min: 177922, max: 237230, rate: 0.13 },
    { min: 237230, max: 355845, rate: 0.14 },
    { min: 355845, max: Infinity, rate: 0.15 },
  ],
  MB: [
    { min: 0, max: 36842, rate: 0.108 },
    { min: 36842, max: 79625, rate: 0.1275 },
    { min: 79625, max: Infinity, rate: 0.174 },
  ],
  SK: [
    { min: 0, max: 49720, rate: 0.105 },
    { min: 49720, max: 142058, rate: 0.125 },
    { min: 142058, max: Infinity, rate: 0.145 },
  ],
  // Simplified flat-ish for remaining provinces
  NS: [
    { min: 0, max: 29590, rate: 0.0879 },
    { min: 29590, max: 59180, rate: 0.1495 },
    { min: 59180, max: 93000, rate: 0.1667 },
    { min: 93000, max: 150000, rate: 0.175 },
    { min: 150000, max: Infinity, rate: 0.21 },
  ],
  NB: [
    { min: 0, max: 49958, rate: 0.094 },
    { min: 49958, max: 99916, rate: 0.14 },
    { min: 99916, max: 185064, rate: 0.16 },
    { min: 185064, max: Infinity, rate: 0.195 },
  ],
  NL: [
    { min: 0, max: 43198, rate: 0.087 },
    { min: 43198, max: 86395, rate: 0.145 },
    { min: 86395, max: 154244, rate: 0.158 },
    { min: 154244, max: 215943, rate: 0.178 },
    { min: 215943, max: Infinity, rate: 0.198 },
  ],
  PE: [
    { min: 0, max: 32656, rate: 0.096 },
    { min: 32656, max: 64313, rate: 0.1337 },
    { min: 64313, max: 105000, rate: 0.167 },
    { min: 105000, max: 140000, rate: 0.18 },
    { min: 140000, max: Infinity, rate: 0.1875 },
  ],
  NT: [{ min: 0, max: Infinity, rate: 0.059 }],
  NU: [{ min: 0, max: Infinity, rate: 0.04 }],
  YT: [
    { min: 0, max: 57375, rate: 0.064 },
    { min: 57375, max: 114750, rate: 0.09 },
    { min: 114750, max: 500000, rate: 0.109 },
    { min: 500000, max: Infinity, rate: 0.15 },
  ],
}

const PROVINCIAL_BPA: Record<string, number> = {
  ON: 11865, BC: 11981, QC: 17183, AB: 21003,
  MB: 15780, SK: 17661, NS: 8481, NB: 12458,
  NL: 10818, PE: 12000, NT: 16593, NU: 17925, YT: 15705,
}

function applyBrackets(income: number, brackets: TaxBracket[]): number {
  if (income <= 0) return 0
  return brackets.reduce((tax, bracket) => {
    const taxable = Math.min(income, bracket.max) - bracket.min
    return taxable > 0 ? tax + taxable * bracket.rate : tax
  }, 0)
}

function getMarginalRate(taxableIncome: number, province: string): number {
  const brackets = PROVINCIAL_BRACKETS[province] ?? PROVINCIAL_BRACKETS.ON
  const fedBracket = FEDERAL_BRACKETS.find(
    (b) => taxableIncome >= b.min && taxableIncome < b.max
  )
  const provBracket = brackets.find(
    (b) => taxableIncome >= b.min && taxableIncome < b.max
  )
  return (fedBracket?.rate ?? 0) + (provBracket?.rate ?? 0)
}

export function calculateTax(
  income: number,
  province: string,
  rrspContribution: number = 0
): TaxResult {
  const provBPA = PROVINCIAL_BPA[province] ?? 15705
  const federalTaxableIncome = Math.max(
    0,
    income - rrspContribution - FEDERAL_BPA
  )
  const provincialTaxableIncome = Math.max(
    0,
    income - rrspContribution - provBPA
  )

  const federalTax = applyBrackets(
    federalTaxableIncome,
    FEDERAL_BRACKETS
  )
  const provincialTax = applyBrackets(
    provincialTaxableIncome,
    PROVINCIAL_BRACKETS[province] ?? PROVINCIAL_BRACKETS.ON
  )

  // CPP: 5.95% on earnings between $3,500 and $68,500
  const cppContribution =
    Math.min(Math.max(income - 3500, 0), 65000) * 0.0595

  // EI: 1.66% on earnings up to $63,200
  const eiPremium = Math.min(income, 63200) * 0.0166

  const totalTax = federalTax + provincialTax + cppContribution + eiPremium
  const netIncome = income - totalTax
  const effectiveRate = income > 0 ? totalTax / income : 0

  // RRSP tax savings = tax without RRSP minus tax with RRSP
  const taxWithoutRRSP =
    applyBrackets(Math.max(0, income - FEDERAL_BPA), FEDERAL_BRACKETS) +
    applyBrackets(
      Math.max(0, income - provBPA),
      PROVINCIAL_BRACKETS[province] ?? PROVINCIAL_BRACKETS.ON
    )
  const rrspSavings = Math.max(0, taxWithoutRRSP - (federalTax + provincialTax))

  return {
    grossIncome: income,
    taxableIncome: income - rrspContribution,
    federalTax,
    provincialTax,
    cppContribution,
    eiPremium,
    totalTax,
    netIncome,
    effectiveRate,
    marginalRate: getMarginalRate(federalTaxableIncome, province),
    rrspSavings,
  }
}

export const PROVINCES: { value: string; label: string }[] = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland & Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
]
