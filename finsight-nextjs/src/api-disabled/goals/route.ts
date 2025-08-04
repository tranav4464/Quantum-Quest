// FinSight Phase 2 Goals Management API
// CRUD operations for financial goals and FIRE planning

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Goal creation/update schema
const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  description: z.string().optional(),
  targetAmount: z.number().positive('Target amount must be positive'),
  currentAmount: z.number().default(0),
  targetDate: z.string().datetime().optional(),
  category: z.enum([
    'EMERGENCY_FUND', 'FIRE', 'RETIREMENT', 'HOUSE_DOWN_PAYMENT', 
    'VACATION', 'DEBT_PAYOFF', 'EDUCATION', 'CAR', 'WEDDING', 'OTHER'
  ]),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  fireNumber: z.number().optional(),
  withdrawalRate: z.number().min(0).max(1).optional(),
})

// GET /api/goals - Get user's financial goals
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
    const category = searchParams.get('category')
    const completed = searchParams.get('completed')

    const whereClause: any = {
      userId: session.user.id,
    }

    if (category) {
      whereClause.category = category
    }

    if (completed !== null) {
      whereClause.isCompleted = completed === 'true'
    }

    const goals = await prisma.goal.findMany({
      where: whereClause,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Calculate overall progress statistics
    const stats = {
      totalGoals: goals.length,
      completedGoals: goals.filter(g => g.isCompleted).length,
      totalTargetAmount: goals.reduce((sum, g) => sum + Number(g.targetAmount), 0),
      totalCurrentAmount: goals.reduce((sum, g) => sum + Number(g.currentAmount), 0),
      averageProgress: goals.length > 0 
        ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length 
        : 0,
      emergencyFundGoals: goals.filter(g => g.category === 'EMERGENCY_FUND').length,
      fireGoals: goals.filter(g => g.category === 'FIRE').length,
      retirementGoals: goals.filter(g => g.category === 'RETIREMENT').length,
    }

    return NextResponse.json({
      goals,
      stats,
    })

  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/goals - Create new financial goal
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
    const validatedData = goalSchema.parse(body)

    // Calculate initial progress
    const progress = validatedData.targetAmount > 0 
      ? (validatedData.currentAmount / validatedData.targetAmount) * 100 
      : 0

    const newGoal = await prisma.goal.create({
      data: {
        userId: session.user.id,
        ...validatedData,
        progress: Math.min(progress, 100),
        isCompleted: progress >= 100,
        completedAt: progress >= 100 ? new Date() : null,
        targetDate: validatedData.targetDate ? new Date(validatedData.targetDate) : null,
      }
    })

    return NextResponse.json({
      message: 'Goal created successfully',
      goal: newGoal,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/goals - Update goal progress (bulk update for transactions)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { goalId, currentAmount } = body

    if (!goalId || typeof currentAmount !== 'number') {
      return NextResponse.json(
        { error: 'Goal ID and current amount are required' },
        { status: 400 }
      )
    }

    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      }
    })

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    // Calculate new progress
    const progress = Number(goal.targetAmount) > 0 
      ? (currentAmount / Number(goal.targetAmount)) * 100 
      : 0

    const isCompleted = progress >= 100
    const completedAt = isCompleted && !goal.isCompleted ? new Date() : goal.completedAt

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        currentAmount,
        progress: Math.min(progress, 100),
        isCompleted,
        completedAt,
      }
    })

    return NextResponse.json({
      message: 'Goal updated successfully',
      goal: updatedGoal,
    })

  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
