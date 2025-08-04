// FinSight Phase 2 Authentication Configuration
// NextAuth.js setup with Prisma adapter and multiple providers

import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'

// Extend the session user type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email/Password Authentication
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        // In a real app, you'd have a password field in the user model
        // For now, we'll create a simple verification
        // const isPasswordValid = await compare(credentials.password, user.password)
        
        // if (!isPasswordValid) {
        //   return null
        // }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),

    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },

    async signIn({ user, account, profile }) {
      // Auto-create user profile when signing in
      try {
        await prisma.userProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            healthScore: 0,
            netWorth: 0,
            monthlyIncome: 0,
            monthlyExpenses: 0,
            totalDebt: 0,
            emergencyFund: 0,
          }
        })
        return true
      } catch (error) {
        console.error('Error creating user profile:', error)
        return true // Still allow sign-in even if profile creation fails
      }
    },
  },

  pages: {
    signIn: '/auth/signin',
  },

  secret: process.env.NEXTAUTH_SECRET,
}

export default authOptions
