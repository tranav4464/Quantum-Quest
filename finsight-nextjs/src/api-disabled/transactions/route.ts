// FinSight Phase 2 Transactions API
// Financial transaction management with AI categorization

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Transaction query parameters schema
const transactionQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('50'),
  category: z.string().optional(),
  accountId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
})

// GET /api/transactions - Get user's transactions with filtering
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
    const queryParams = Object.fromEntries(searchParams.entries())
    const {
      page,
      limit,
      category,
      accountId,
      startDate,
      endDate,
      search,
    } = transactionQuerySchema.parse(queryParams)

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const whereClause: any = {
      userId: session.user.id,
    }

    if (category) {
      whereClause.category = category
    }

    if (accountId) {
      whereClause.bankAccountId = accountId
    }

    if (startDate || endDate) {
      whereClause.date = {}
      if (startDate) {
        whereClause.date.gte = new Date(startDate)
      }
      if (endDate) {
        whereClause.date.lte = new Date(endDate)
      }
    }

    if (search) {
      whereClause.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { merchantName: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get transactions with pagination
    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        include: {
          bankAccount: {
            select: {
              id: true,
              name: true,
              type: true,
            }
          }
        },
        orderBy: { date: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.transaction.count({ where: whereClause })
    ])

    // Calculate summary statistics
    const summary = await prisma.transaction.aggregate({
      where: {
        userId: session.user.id,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Current month
        }
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      }
    })

    // Get spending by category for current month
    const categorySpending = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId: session.user.id,
        amount: { lt: 0 }, // Only expenses (negative amounts)
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        }
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'asc' // Most negative first (biggest expenses)
        }
      }
    })

    return NextResponse.json({
      transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum),
      },
      summary: {
        currentMonthSpending: Math.abs(Number(summary._sum.amount || 0)),
        currentMonthTransactions: summary._count.id,
        categoryBreakdown: categorySpending.map(cat => ({
          category: cat.category,
          amount: Math.abs(Number(cat._sum.amount || 0)),
        })),
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/transactions - Create manual transaction or sync from Plaid
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      bankAccountId,
      amount,
      description,
      merchantName,
      date,
      category,
      subcategory,
      tags = [],
      plaidTransactionId
    } = body

    // Validate required fields
    if (!amount || !description || !date || !category) {
      return NextResponse.json(
        { error: 'Amount, description, date, and category are required' },
        { status: 400 }
      )
    }

    // Verify bank account belongs to user if provided
    if (bankAccountId) {
      const account = await prisma.bankAccount.findFirst({
        where: {
          id: bankAccountId,
          userId: session.user.id,
        }
      })

      if (!account) {
        return NextResponse.json(
          { error: 'Bank account not found or does not belong to user' },
          { status: 404 }
        )
      }
    }

    // Check for duplicate Plaid transaction
    if (plaidTransactionId) {
      const existingTransaction = await prisma.transaction.findUnique({
        where: { plaidTransactionId }
      })

      if (existingTransaction) {
        return NextResponse.json(
          { error: 'Transaction already exists' },
          { status: 409 }
        )
      }
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        bankAccountId,
        plaidTransactionId,
        amount: Number(amount),
        description,
        merchantName,
        date: new Date(date),
        category,
        subcategory,
        tags,
      },
      include: {
        bankAccount: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Transaction created successfully',
      transaction: newTransaction,
    })

  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
