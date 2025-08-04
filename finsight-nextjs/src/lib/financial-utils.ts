// FinSight Phase 2 Financial Utilities
// Helper functions for financial calculations and data processing

import { Decimal } from '@prisma/client/runtime/library'

// Financial calculation utilities
export class FinancialCalculations {
  
  // Calculate net worth from assets and debts
  static calculateNetWorth(assets: number, debts: number): number {
    return assets - debts
  }

  // Calculate FIRE number (25x annual expenses)
  static calculateFireNumber(annualExpenses: number, withdrawalRate: number = 0.04): number {
    return annualExpenses / withdrawalRate
  }

  // Calculate emergency fund target (3-6 months of expenses)
  static calculateEmergencyFundTarget(monthlyExpenses: number, months: number = 6): number {
    return monthlyExpenses * months
  }

  // Calculate debt-to-income ratio
  static calculateDebtToIncomeRatio(totalDebt: number, monthlyIncome: number): number {
    if (monthlyIncome === 0) return 0
    return (totalDebt / (monthlyIncome * 12)) * 100
  }

  // Calculate savings rate
  static calculateSavingsRate(monthlyIncome: number, monthlyExpenses: number): number {
    if (monthlyIncome === 0) return 0
    return ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
  }

  // Calculate years to FIRE
  static calculateYearsToFire(
    currentSavings: number,
    fireNumber: number,
    monthlySavings: number,
    expectedReturn: number = 0.07
  ): number {
    if (monthlySavings <= 0) return Infinity
    if (currentSavings >= fireNumber) return 0

    const monthlyReturn = expectedReturn / 12
    const remainingAmount = fireNumber - currentSavings
    
    // Using future value of annuity formula
    if (monthlyReturn === 0) {
      return remainingAmount / (monthlySavings * 12)
    }

    const months = Math.log(
      (remainingAmount * monthlyReturn) / monthlySavings + 1
    ) / Math.log(1 + monthlyReturn)

    return months / 12
  }

  // Calculate financial health score (0-100)
  static calculateHealthScore(profile: {
    netWorth: number
    monthlyIncome: number
    monthlyExpenses: number
    totalDebt: number
    emergencyFund: number
  }): number {
    let score = 0

    // Net worth component (25 points)
    if (profile.netWorth > 0) {
      score += Math.min(25, (profile.netWorth / (profile.monthlyIncome * 12)) * 5)
    }

    // Emergency fund component (25 points)
    const emergencyFundMonths = profile.emergencyFund / profile.monthlyExpenses
    score += Math.min(25, emergencyFundMonths * 4.17) // 6 months = 25 points

    // Debt-to-income component (25 points)
    const dtiRatio = this.calculateDebtToIncomeRatio(profile.totalDebt, profile.monthlyIncome)
    score += Math.max(0, 25 - (dtiRatio / 2)) // 0% DTI = 25 points, 50% DTI = 0 points

    // Savings rate component (25 points)
    const savingsRate = this.calculateSavingsRate(profile.monthlyIncome, profile.monthlyExpenses)
    score += Math.min(25, savingsRate) // 25% savings rate = 25 points

    return Math.round(Math.max(0, Math.min(100, score)))
  }

  // Format currency for display
  static formatCurrency(amount: number | Decimal, currency: string = 'USD'): string {
    const numericAmount = typeof amount === 'number' ? amount : Number(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(numericAmount)
  }

  // Format percentage for display
  static formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`
  }

  // Calculate monthly payment for loan
  static calculateLoanPayment(
    principal: number,
    annualRate: number,
    termInYears: number
  ): number {
    const monthlyRate = annualRate / 12
    const numberOfPayments = termInYears * 12
    
    if (monthlyRate === 0) {
      return principal / numberOfPayments
    }

    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  }

  // Calculate debt avalanche order (highest interest first)
  static calculateDebtAvalanche(debts: Array<{
    id: string
    balance: number
    interestRate: number
    minimumPayment: number
  }>): Array<{
    id: string
    balance: number
    interestRate: number
    minimumPayment: number
    priority: number
  }> {
    return debts
      .map(debt => ({ ...debt, priority: 0 }))
      .sort((a, b) => b.interestRate - a.interestRate)
      .map((debt, index) => ({ ...debt, priority: index + 1 }))
  }

  // Calculate debt snowball order (smallest balance first)
  static calculateDebtSnowball(debts: Array<{
    id: string
    balance: number
    interestRate: number
    minimumPayment: number
  }>): Array<{
    id: string
    balance: number
    interestRate: number
    minimumPayment: number
    priority: number
  }> {
    return debts
      .map(debt => ({ ...debt, priority: 0 }))
      .sort((a, b) => a.balance - b.balance)
      .map((debt, index) => ({ ...debt, priority: index + 1 }))
  }
}

// Date utilities for financial periods
export class DateUtilities {
  
  // Get start of current month
  static getCurrentMonthStart(): Date {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  }

  // Get end of current month
  static getCurrentMonthEnd(): Date {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
  }

  // Get start of current year
  static getCurrentYearStart(): Date {
    const now = new Date()
    return new Date(now.getFullYear(), 0, 1)
  }

  // Get date range for last N months
  static getLastNMonthsRange(months: number): { start: Date; end: Date } {
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - months)
    return { start, end }
  }

  // Format date for API responses
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }
}

// Transaction categorization utilities
export class TransactionCategories {
  
  static readonly CATEGORIES = {
    INCOME: 'Income',
    TRANSFER: 'Transfer',
    FOOD_AND_DRINK: 'Food & Drink',
    SHOPS: 'Shops',
    TRANSPORTATION: 'Transportation',
    RECREATION: 'Recreation',
    SERVICE: 'Service',
    HEALTHCARE: 'Healthcare',
    DEPOSIT: 'Deposit',
    PAYMENT: 'Payment',
    CASH_ADVANCE: 'Cash Advance',
    BANK_FEES: 'Bank Fees',
    ENTERTAINMENT: 'Entertainment',
    EDUCATION: 'Education',
    PROFESSIONAL_SERVICES: 'Professional Services',
    TRAVEL: 'Travel',
    RENT_AND_UTILITIES: 'Rent & Utilities',
    HOME_IMPROVEMENT: 'Home Improvement',
    PERSONAL_CARE: 'Personal Care',
    GENERAL_MERCHANDISE: 'General Merchandise',
    GOVERNMENT_AND_NON_PROFIT: 'Government & Non-Profit',
    OTHER: 'Other',
  }

  // Get category suggestions based on merchant name or description
  static suggestCategory(merchantName: string, description: string): string {
    const text = `${merchantName} ${description}`.toLowerCase()

    // Food & Drink
    if (text.match(/restaurant|cafe|coffee|food|grocery|supermarket|mcdonalds|starbucks|uber eats|doordash/)) {
      return this.CATEGORIES.FOOD_AND_DRINK
    }

    // Transportation
    if (text.match(/gas|fuel|uber|lyft|taxi|parking|metro|bus|train|car wash|auto/)) {
      return this.CATEGORIES.TRANSPORTATION
    }

    // Entertainment
    if (text.match(/movie|cinema|netflix|spotify|entertainment|concert|theater|gaming/)) {
      return this.CATEGORIES.ENTERTAINMENT
    }

    // Shopping
    if (text.match(/amazon|target|walmart|mall|shop|store|retail|clothing|electronics/)) {
      return this.CATEGORIES.SHOPS
    }

    // Utilities
    if (text.match(/electric|gas company|water|sewer|internet|phone|cable|rent|mortgage/)) {
      return this.CATEGORIES.RENT_AND_UTILITIES
    }

    // Healthcare
    if (text.match(/hospital|clinic|doctor|pharmacy|medical|dental|health|cvs pharmacy|walgreens/)) {
      return this.CATEGORIES.HEALTHCARE
    }

    // Transfer
    if (text.match(/transfer|atm|withdrawal|deposit|bank|venmo|paypal|zelle/)) {
      return this.CATEGORIES.TRANSFER
    }

    return this.CATEGORIES.OTHER
  }
}
