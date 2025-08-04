// FinSight Phase 2 Financial Accounts API
// Bank account management with Plaid integration

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Account creation schema
const createAccountSchema = z.object({
  plaidAccountId: z.string(),
  plaidAccessToken: z.string(),
  plaidItemId: z.string(),
  name: z.string(),
  officialName: z.string().optional(),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'LOAN', 'MORTGAGE', 'OTHER']),
  subtype: z.string().optional(),
  balance: z.number(),
  availableBalance: z.number().optional(),
  creditLimit: z.number().optional(),
})

// GET /api/accounts - Get user's bank accounts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const accounts = await prisma.bankAccount.findMany({
      where: { 
        userId: session.user.id,
        isActive: true 
      },
      include: {
        transactions: {
          take: 5,
          orderBy: { date: 'desc' },
          select: {
            id: true,
            amount: true,
            description: true,
            merchantName: true,
            date: true,
            category: true,
            isPending: true,
          }
        },
        _count: {
          select: {
            transactions: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate total balances by account type
    const summary = {
      totalBalance: accounts.reduce((sum, acc) => sum + Number(acc.balance), 0),
      checkingBalance: accounts
        .filter(acc => acc.type === 'CHECKING')
        .reduce((sum, acc) => sum + Number(acc.balance), 0),
      savingsBalance: accounts
        .filter(acc => acc.type === 'SAVINGS')
        .reduce((sum, acc) => sum + Number(acc.balance), 0),
      creditCardBalance: accounts
        .filter(acc => acc.type === 'CREDIT_CARD')
        .reduce((sum, acc) => sum + Number(acc.balance), 0),
      investmentBalance: accounts
        .filter(acc => acc.type === 'INVESTMENT')
        .reduce((sum, acc) => sum + Number(acc.balance), 0),
    }

    return NextResponse.json({
      accounts,
      summary,
    })

  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/accounts - Add new bank account (from Plaid)
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
    const validatedData = createAccountSchema.parse(body)

    // Check if account already exists
    const existingAccount = await prisma.bankAccount.findUnique({
      where: { plaidAccountId: validatedData.plaidAccountId }
    })

    if (existingAccount) {
      return NextResponse.json(
        { error: 'Account already connected' },
        { status: 409 }
      )
    }

    const newAccount = await prisma.bankAccount.create({
      data: {
        userId: session.user.id,
        ...validatedData,
      }
    })

    return NextResponse.json({
      message: 'Account connected successfully',
      account: newAccount,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
