// FinSight Phase 2 AI Insights API
// Generate AI-powered financial insights and recommendations

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'
import { FinancialCalculations, DateUtilities } from '@/lib/financial-utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// GET /api/insights - Get user's AI insights
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const unreadOnly = searchParams.get('unread') === 'true'

    const whereClause: any = {
      userId: session.user.id,
    }

    if (type) {
      whereClause.type = type
    }

    if (unreadOnly) {
      whereClause.isRead = false
    }

    const insights = await prisma.aIInsight.findMany({
      where: whereClause,
      orderBy: [
        { priority: 'desc' },
        { generatedAt: 'desc' }
      ],
      take: 50
    })

    return NextResponse.json({ insights })

  } catch (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/insights - Generate new AI insights
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Gather user's financial data for analysis
    const [user, profile, accounts, recentTransactions, goals, debts] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true }
      }),
      prisma.userProfile.findUnique({
        where: { userId: session.user.id }
      }),
      prisma.bankAccount.findMany({
        where: { userId: session.user.id, isActive: true },
        select: {
          id: true,
          name: true,
          type: true,
          balance: true,
        }
      }),
      prisma.transaction.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: DateUtilities.getLastNMonthsRange(3).start
          }
        },
        select: {
          amount: true,
          category: true,
          date: true,
          description: true,
        },
        take: 200
      }),
      prisma.goal.findMany({
        where: { userId: session.user.id },
        select: {
          name: true,
          category: true,
          targetAmount: true,
          currentAmount: true,
          progress: true,
        }
      }),
      prisma.debt.findMany({
        where: { userId: session.user.id, isActive: true },
        select: {
          name: true,
          type: true,
          balance: true,
          interestRate: true,
        }
      })
    ])

    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Calculate financial metrics
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0)
    const monthlySpending = recentTransactions
      .filter(t => Number(t.amount) < 0 && t.date >= DateUtilities.getCurrentMonthStart())
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)

    const healthScore = FinancialCalculations.calculateHealthScore({
      netWorth: Number(profile.netWorth),
      monthlyIncome: Number(profile.monthlyIncome),
      monthlyExpenses: Number(profile.monthlyExpenses),
      totalDebt: Number(profile.totalDebt),
      emergencyFund: Number(profile.emergencyFund),
    })

    // Prepare data for AI analysis
    const financialData = {
      profile: {
        monthlyIncome: Number(profile.monthlyIncome),
        monthlyExpenses: Number(profile.monthlyExpenses),
        netWorth: Number(profile.netWorth),
        totalDebt: Number(profile.totalDebt),
        emergencyFund: Number(profile.emergencyFund),
        healthScore,
        riskTolerance: profile.riskTolerance,
      },
      accounts: {
        total: accounts.length,
        totalBalance,
        byType: accounts.reduce((acc, account) => {
          acc[account.type] = (acc[account.type] || 0) + Number(account.balance)
          return acc
        }, {} as Record<string, number>)
      },
      spending: {
        currentMonth: monthlySpending,
        topCategories: recentTransactions
          .filter(t => Number(t.amount) < 0)
          .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(Number(t.amount))
            return acc
          }, {} as Record<string, number>)
      },
      goals: {
        total: goals.length,
        totalTarget: goals.reduce((sum, g) => sum + Number(g.targetAmount), 0),
        totalCurrent: goals.reduce((sum, g) => sum + Number(g.currentAmount), 0),
        averageProgress: goals.length > 0 
          ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length 
          : 0
      },
      debts: {
        total: debts.length,
        totalBalance: debts.reduce((sum, d) => sum + Number(d.balance), 0),
        averageRate: debts.length > 0
          ? debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length
          : 0
      }
    }

    // Generate AI insights using OpenAI
    const insightPrompts = [
      {
        type: 'SPENDING_PATTERN',
        prompt: `Analyze this user's spending patterns and provide actionable insights:
        Monthly Income: $${financialData.profile.monthlyIncome}
        Monthly Expenses: $${financialData.profile.monthlyExpenses}
        Current Month Spending: $${financialData.spending.currentMonth}
        Top Spending Categories: ${JSON.stringify(financialData.spending.topCategories)}
        
        Provide 2-3 specific, actionable recommendations to optimize their spending.`
      },
      {
        type: 'SAVING_OPPORTUNITY',
        prompt: `Identify saving opportunities for this user:
        Net Worth: $${financialData.profile.netWorth}
        Emergency Fund: $${financialData.profile.emergencyFund}
        Monthly Income: $${financialData.profile.monthlyIncome}
        Monthly Expenses: $${financialData.profile.monthlyExpenses}
        Health Score: ${financialData.profile.healthScore}/100
        
        Provide specific recommendations to increase their savings rate.`
      },
      {
        type: 'GOAL_PROGRESS',
        prompt: `Analyze this user's financial goals progress:
        Total Goals: ${financialData.goals.total}
        Average Progress: ${financialData.goals.averageProgress.toFixed(1)}%
        Total Target: $${financialData.goals.totalTarget}
        Total Current: $${financialData.goals.totalCurrent}
        Monthly Income: $${financialData.profile.monthlyIncome}
        
        Provide motivation and specific steps to accelerate goal achievement.`
      }
    ]

    if (financialData.debts.total > 0) {
      insightPrompts.push({
        type: 'DEBT_OPTIMIZATION',
        prompt: `Help optimize this user's debt strategy:
        Total Debt: $${financialData.debts.totalBalance}
        Average Interest Rate: ${financialData.debts.averageRate.toFixed(2)}%
        Monthly Income: $${financialData.profile.monthlyIncome}
        Monthly Expenses: $${financialData.profile.monthlyExpenses}
        
        Recommend the best debt payoff strategy and timeline.`
      })
    }

    // Generate insights with OpenAI
    const generatedInsights = await Promise.all(
      insightPrompts.map(async ({ type, prompt }) => {
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are a professional financial advisor providing personalized, actionable advice. Keep responses concise, specific, and encouraging. Focus on practical steps the user can take immediately.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 300,
            temperature: 0.7,
          })

          const content = completion.choices[0]?.message?.content || 'Unable to generate insight'
          
          return {
            type: type as any,
            title: getInsightTitle(type),
            content,
            confidence: 0.85,
            category: getCategoryFromType(type),
            priority: getPriorityFromType(type),
            dataPoints: {
              healthScore: financialData.profile.healthScore,
              monthlyIncome: financialData.profile.monthlyIncome,
              monthlyExpenses: financialData.profile.monthlyExpenses,
            }
          }
        } catch (error) {
          console.error(`Error generating ${type} insight:`, error)
          return null
        }
      })
    )

    // Filter out failed insights and save to database
    const validInsights = generatedInsights.filter(insight => insight !== null)
    
    const savedInsights = await Promise.all(
      validInsights.map(insight =>
        prisma.aIInsight.create({
          data: {
            userId: session.user.id,
            ...insight,
            isActionable: true,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          }
        })
      )
    )

    return NextResponse.json({
      message: 'AI insights generated successfully',
      insights: savedInsights,
    })

  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions
function getInsightTitle(type: string): string {
  const titles = {
    'SPENDING_PATTERN': 'Spending Analysis & Optimization',
    'SAVING_OPPORTUNITY': 'Savings Acceleration Opportunities',
    'GOAL_PROGRESS': 'Goal Achievement Strategy',
    'DEBT_OPTIMIZATION': 'Debt Payoff Optimization',
    'INVESTMENT_ADVICE': 'Investment Recommendations',
    'TAX_TIP': 'Tax Optimization Tips',
  }
  return titles[type as keyof typeof titles] || 'Financial Insight'
}

function getCategoryFromType(type: string): string {
  const categories = {
    'SPENDING_PATTERN': 'Spending',
    'SAVING_OPPORTUNITY': 'Savings',
    'GOAL_PROGRESS': 'Goals',
    'DEBT_OPTIMIZATION': 'Debt Management',
    'INVESTMENT_ADVICE': 'Investments',
    'TAX_TIP': 'Tax Planning',
  }
  return categories[type as keyof typeof categories] || 'General'
}

function getPriorityFromType(type: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
  const priorities = {
    'DEBT_OPTIMIZATION': 'HIGH',
    'SPENDING_PATTERN': 'MEDIUM',
    'SAVING_OPPORTUNITY': 'MEDIUM',
    'GOAL_PROGRESS': 'MEDIUM',
    'INVESTMENT_ADVICE': 'LOW',
    'TAX_TIP': 'LOW',
  }
  return priorities[type as keyof typeof priorities] as any || 'MEDIUM'
}
