// FinSight Phase 2 User Management API
// CRUD operations for user accounts and profiles

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// User profile update schema
const updateProfileSchema = z.object({
  name: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  occupation: z.string().optional(),
  annualIncome: z.number().positive().optional(),
  riskTolerance: z.enum(['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE']).optional(),
  monthlyIncome: z.number().optional(),
  monthlyExpenses: z.number().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
  notificationsEnabled: z.boolean().optional(),
})

// GET /api/users - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        bankAccounts: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            type: true,
            balance: true,
            lastSynced: true,
          }
        },
        goals: {
          where: { isCompleted: false },
          select: {
            id: true,
            name: true,
            targetAmount: true,
            currentAmount: true,
            progress: true,
            category: true,
          }
        },
        _count: {
          select: {
            transactions: true,
            debts: true,
            investments: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        profile: user.profile,
        bankAccounts: user.bankAccounts,
        goals: user.goals,
        stats: user._count,
      }
    })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/users - Update user profile
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
    const validatedData = updateProfileSchema.parse(body)

    // Update user basic info if provided
    const userUpdateData: any = {}
    if (validatedData.name) {
      userUpdateData.name = validatedData.name
    }

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: userUpdateData,
      })
    }

    // Update profile data
    const profileUpdateData: any = {}
    if (validatedData.dateOfBirth) {
      profileUpdateData.dateOfBirth = new Date(validatedData.dateOfBirth)
    }
    if (validatedData.occupation) {
      profileUpdateData.occupation = validatedData.occupation
    }
    if (validatedData.annualIncome) {
      profileUpdateData.annualIncome = validatedData.annualIncome
    }
    if (validatedData.riskTolerance) {
      profileUpdateData.riskTolerance = validatedData.riskTolerance
    }
    if (validatedData.monthlyIncome !== undefined) {
      profileUpdateData.monthlyIncome = validatedData.monthlyIncome
    }
    if (validatedData.monthlyExpenses !== undefined) {
      profileUpdateData.monthlyExpenses = validatedData.monthlyExpenses
    }
    if (validatedData.currency) {
      profileUpdateData.currency = validatedData.currency
    }
    if (validatedData.timezone) {
      profileUpdateData.timezone = validatedData.timezone
    }
    if (validatedData.notificationsEnabled !== undefined) {
      profileUpdateData.notificationsEnabled = validatedData.notificationsEnabled
    }

    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: profileUpdateData,
      create: {
        userId: session.user.id,
        ...profileUpdateData,
      },
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: updatedProfile,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/users - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete user and all related data (cascading deletes handled by Prisma schema)
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    return NextResponse.json({
      message: 'Account deleted successfully',
    })

  } catch (error) {
    console.error('Error deleting user account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
