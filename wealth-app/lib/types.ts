// Transaction types
export interface RawTransaction {
  id: string
  date: string
  description: string
  amount: number
}

export type TransactionCategory =
  | "Groceries"
  | "Restaurants & Dining"
  | "Coffee & Cafes"
  | "Fast Food"
  | "Alcohol & Bars"
  | "Rent & Mortgage"
  | "Utilities"
  | "Internet & Phone"
  | "Insurance"
  | "Gas & Fuel"
  | "Public Transit"
  | "Ride Share"
  | "Travel & Flights"
  | "Hotels & Accommodation"
  | "Streaming & Media"
  | "Software & Apps"
  | "Gym & Fitness"
  | "Clothing & Apparel"
  | "Electronics"
  | "Home & Garden"
  | "Personal Care & Beauty"
  | "Pharmacy & Medicine"
  | "Doctor & Dental"
  | "Education"
  | "Pet Care"
  | "Charity & Donations"
  | "ATM & Banking"
  | "Transfers"
  | "Investments"
  | "Other"

export interface CategorizedTransaction extends RawTransaction {
  category: TransactionCategory
  confidence: number
}

// AI Suggestions
export type SuggestionPriority = "high" | "medium" | "low"

export interface AISuggestion {
  title: string
  detail: string
  monthlySavings: number
  redirectTo: "TFSA" | "RRSP" | "FHSA" | "Savings"
  priority: SuggestionPriority
}

// Tax types
export interface TaxResult {
  grossIncome: number
  taxableIncome: number
  federalTax: number
  provincialTax: number
  cppContribution: number
  eiPremium: number
  totalTax: number
  netIncome: number
  effectiveRate: number
  marginalRate: number
  rrspSavings: number
}

// Growth projection
export interface ProjectionDataPoint {
  year: number
  withSavings: number
  contributionsOnly: number
  withoutSavings: number
}

// Category summary
export interface CategorySummary {
  category: TransactionCategory
  total: number
  count: number
  percentage: number
}
