import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { mockUsers, type MockUser } from './mock-data'

// Extended types for NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: 'RENTER' | 'LENDER' | 'ADMIN'
      image?: string
      location?: string
    }
  }
  
  interface User {
    id: string
    name: string
    email: string
    role: 'RENTER' | 'LENDER' | 'ADMIN'
    location?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'RENTER' | 'LENDER' | 'ADMIN'
    location?: string
  }
}

// Mock user database with passwords (in production, use Prisma)
interface MockAuthUser extends MockUser {
  password: string
}

export const mockAuthUsers: MockAuthUser[] = [
  {
    id: 'user1',
    name: 'דוד כהן',
    email: 'david@example.com',
    password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/oPg5/R5M2UCMW', // 123456
    role: 'OWNER' as const,
    location: 'תל אביב',
    subscribedLocations: ['תל אביב', 'רמת גן', 'גבעתיים'],
  },
  {
    id: 'user2',
    name: 'שרה לוי',
    email: 'sarah@example.com',
    password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/oPg5/R5M2UCMW',
    role: 'OWNER' as const,
    location: 'רמת גן',
    subscribedLocations: ['רמת גן', 'תל אביב'],
  },
  {
    id: 'user7',
    name: 'עמית ברק',
    email: 'amit@example.com',
    password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/oPg5/R5M2UCMW',
    role: 'RENTER' as const,
    location: 'תל אביב',
    subscribedLocations: [],
  },
  {
    id: 'admin1',
    name: 'מנהל מערכת',
    email: 'admin@example.com',
    password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/oPg5/R5M2UCMW',
    role: 'BOTH' as const,
    location: 'תל אביב',
    subscribedLocations: [],
  },
]

// Map OWNER/BOTH to LENDER for the new role system
function mapRole(role: string): 'RENTER' | 'LENDER' | 'ADMIN' {
  if (role === 'OWNER' || role === 'BOTH') return 'LENDER'
  if (role === 'RENTER') return 'RENTER'
  return 'RENTER'
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'אימייל', type: 'email' },
        password: { label: 'סיסמה', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('נא להזין אימייל וסיסמה')
        }

        // Find user in mock database
        const user = mockAuthUsers.find(u => u.email === credentials.email)
        
        if (!user) {
          throw new Error('משתמש לא נמצא')
        }

        // Verify password
        const isValid = await compare(credentials.password, user.password)
        
        if (!isValid) {
          throw new Error('סיסמה שגויה')
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: mapRole(user.role),
          location: user.location,
        }
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.location = user.location
      }
      return token
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.location = token.location
      }
      return session
    },
  },
  
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
    newUser: '/signup',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production',
}

// Helper function to check if user has required role
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}

// Helper function to check if route is protected
export function isProtectedRoute(pathname: string): boolean {
  const protectedPatterns = [
    /^\/listing\/[^/]+$/,     // /listing/[id]
    /^\/listings\/[^/]+$/,    // /listings/[id]
    /^\/book/,                // /book/*
    /^\/profile/,             // /profile/*
    /^\/requests\/new/,       // /requests/new
    /^\/requests\/[^/]+$/,    // /requests/[id]
    /^\/list-item/,           // /list-item
    /^\/dashboard/,           // /dashboard/*
    /^\/settings/,            // /settings/*
  ]
  
  return protectedPatterns.some(pattern => pattern.test(pathname))
}

// Helper function to check if route is public
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/',
    '/about',
    '/login',
    '/signup',
    '/forgot-password',
    '/requests', // Feed is public, but details are protected
  ]
  
  return publicRoutes.includes(pathname) || 
         pathname.startsWith('/api/auth') ||
         pathname.startsWith('/_next')
}

