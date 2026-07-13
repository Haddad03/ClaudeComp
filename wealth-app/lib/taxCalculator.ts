import type { TaxResult, IncomeSource, IncomeSourceType } from "./types"

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

function getMarginalRate(
  federalTaxable: number,
  provincialTaxable: number,
  province: string
): number {
  const brackets = PROVINCIAL_BRACKETS[province] ?? PROVINCIAL_BRACKETS.ON
  const fedBracket = FEDERAL_BRACKETS.find(
    (b) => federalTaxable >= b.min && federalTaxable < b.max
  )
  const provBracket = brackets.find(
    (b) => provincialTaxable >= b.min && provincialTaxable < b.max
  )
  return (fedBracket?.rate ?? 0) + (provBracket?.rate ?? 0)
}

// 2025 contribution limits
export const FHSA_ANNUAL_LIMIT = 8000
export const TFSA_ANNUAL_LIMIT = 7000
export const RRSP_ANNUAL_MAX = 32490
export const RRSP_EARNED_INCOME_RATE = 0.18

// The year the app's tax data reflects — TFSA room accrues through here.
export const CURRENT_TAX_YEAR = 2026

// TFSA annual dollar limit by year since the program began in 2009.
const TFSA_ANNUAL_LIMITS: Record<number, number> = {
  2009: 5000, 2010: 5000, 2011: 5000, 2012: 5000,
  2013: 5500, 2014: 5500,
  2015: 10000,
  2016: 5500, 2017: 5500, 2018: 5500,
  2019: 6000, 2020: 6000, 2021: 6000, 2022: 6000,
  2023: 6500,
  2024: 7000, 2025: 7000, 2026: 7000,
}

// Estimated cumulative TFSA room: you accrue each year's limit from the year
// you turned 18 (or 2009, whichever is later) through the current year.
// Approximate — based on age alone, assumes Canadian residency throughout and
// no prior contributions or withdrawals.
export function tfsaRoomForAge(age: number, currentYear = CURRENT_TAX_YEAR): number {
  if (age < 18) return 0
  const turned18Year = currentYear - (age - 18)
  const startYear = Math.max(2009, turned18Year)
  let room = 0
  for (let y = startYear; y <= currentYear; y++) {
    room += TFSA_ANNUAL_LIMITS[y] ?? TFSA_ANNUAL_LIMIT
  }
  return room
}

// CPP: 5.95% employee (11.9% self-employed) on pensionable earnings
// between the $3,500 exemption and the $68,500 ceiling
const CPP_EXEMPTION = 3500
const CPP_PENSIONABLE_CAP = 65000
const CPP_EMPLOYEE_RATE = 0.0595
const CPP_SELF_EMPLOYED_RATE = 0.119

// EI: 1.66% on insurable employment earnings up to $63,200
const EI_MAX_INSURABLE = 63200
const EI_RATE = 0.0166

// Quebec residents get a 16.5% abatement of basic federal tax
const QC_FEDERAL_ABATEMENT = 0.165

export const INCOME_SOURCE_TYPES: {
  value: IncomeSourceType
  label: string
  hint: string
}[] = [
  { value: "employment", label: "Employment (T4)", hint: "Salary or wages — CPP and EI apply" },
  { value: "selfEmployment", label: "Self-employment", hint: "Freelance or business — you pay both CPP halves, no EI" },
  { value: "capitalGains", label: "Capital gains", hint: "Only 50% is taxable" },
  { value: "other", label: "Other income", hint: "Interest, rental, etc. — fully taxable, no CPP/EI" },
]

function sumByType(sources: IncomeSource[], type: IncomeSourceType): number {
  return sources
    .filter((s) => s.type === type)
    .reduce((sum, s) => sum + Math.max(0, s.amount), 0)
}

function incomeTax(
  taxBase: number,
  deductions: number,
  province: string
): { federalTax: number; provincialTax: number; federalTaxable: number; provincialTaxable: number } {
  const provBPA = PROVINCIAL_BPA[province] ?? 15705
  const federalTaxable = Math.max(0, taxBase - deductions - FEDERAL_BPA)
  const provincialTaxable = Math.max(0, taxBase - deductions - provBPA)

  let federalTax = applyBrackets(federalTaxable, FEDERAL_BRACKETS)
  if (province === "QC") federalTax *= 1 - QC_FEDERAL_ABATEMENT

  const provincialTax = applyBrackets(
    provincialTaxable,
    PROVINCIAL_BRACKETS[province] ?? PROVINCIAL_BRACKETS.ON
  )
  return { federalTax, provincialTax, federalTaxable, provincialTaxable }
}

export function calculateTaxFromSources(
  sources: IncomeSource[],
  province: string,
  deductions: { rrsp: number; fhsa: number } = { rrsp: 0, fhsa: 0 }
): TaxResult {
  const employment = sumByType(sources, "employment")
  const selfEmployment = sumByType(sources, "selfEmployment")
  const capitalGains = sumByType(sources, "capitalGains")
  const other = sumByType(sources, "other")

  const grossIncome = employment + selfEmployment + capitalGains + other
  // Only 50% of capital gains are taxable
  const taxBase = employment + selfEmployment + other + capitalGains * 0.5

  const rrsp = Math.max(0, deductions.rrsp)
  const fhsa = Math.min(Math.max(0, deductions.fhsa), FHSA_ANNUAL_LIMIT)
  const totalDeductions = rrsp + fhsa

  const withDeductions = incomeTax(taxBase, totalDeductions, province)
  const withoutDeductions = incomeTax(taxBase, 0, province)

  // CPP: employment pensionable earnings use up the exemption and cap first,
  // self-employment fills the remaining room at the doubled rate
  const empPensionable = Math.min(
    Math.max(employment - CPP_EXEMPTION, 0),
    CPP_PENSIONABLE_CAP
  )
  const exemptionLeft = Math.max(CPP_EXEMPTION - employment, 0)
  const sePensionable = Math.min(
    Math.max(selfEmployment - exemptionLeft, 0),
    Math.max(CPP_PENSIONABLE_CAP - empPensionable, 0)
  )
  const cppContribution =
    empPensionable * CPP_EMPLOYEE_RATE + sePensionable * CPP_SELF_EMPLOYED_RATE

  const eiPremium = Math.min(employment, EI_MAX_INSURABLE) * EI_RATE

  const totalTax =
    withDeductions.federalTax +
    withDeductions.provincialTax +
    cppContribution +
    eiPremium
  const netIncome = grossIncome - totalTax
  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0

  const deductionSavings = Math.max(
    0,
    withoutDeductions.federalTax +
      withoutDeductions.provincialTax -
      (withDeductions.federalTax + withDeductions.provincialTax)
  )

  return {
    grossIncome,
    taxableIncome: Math.max(0, taxBase - totalDeductions),
    federalTax: withDeductions.federalTax,
    provincialTax: withDeductions.provincialTax,
    cppContribution,
    eiPremium,
    totalTax,
    netIncome,
    effectiveRate,
    marginalRate: getMarginalRate(
      withDeductions.federalTaxable,
      withDeductions.provincialTaxable,
      province
    ),
    deductionSavings,
  }
}

export function calculateTax(
  income: number,
  province: string,
  rrspContribution: number = 0
): TaxResult {
  return calculateTaxFromSources(
    [{ id: "income", type: "employment", amount: income }],
    province,
    { rrsp: rrspContribution, fhsa: 0 }
  )
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
