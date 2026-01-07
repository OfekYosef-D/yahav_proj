'use client'

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'

// ============================================
// Types
// ============================================

interface User {
  id: string
  name: string
  email: string
  role: 'RENTER' | 'LENDER' | 'ADMIN'
  location?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ============================================
// Cookie helpers for dev mode
// ============================================

const DEV_AUTH_COOKIE = 'dev-auth'

function setDevAuthCookie(user: User) {
  if (typeof document !== 'undefined') {
    document.cookie = `${DEV_AUTH_COOKIE}=${JSON.stringify(user)}; path=/; max-age=86400`
  }
}

function getDevAuthCookie(): User | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const authCookie = cookies.find(c => c.trim().startsWith(`${DEV_AUTH_COOKIE}=`))
  
  if (authCookie) {
    try {
      const value = authCookie.split('=')[1]
      return JSON.parse(decodeURIComponent(value))
    } catch {
      return null
    }
  }
  return null
}

function removeDevAuthCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = `${DEV_AUTH_COOKIE}=; path=/; max-age=0`
  }
}

// ============================================
// Provider
// ============================================

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from cookie on mount (for dev mode persistence)
  useEffect(() => {
    const savedUser = getDevAuthCookie()
    if (savedUser) {
      setUser(savedUser)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((userData: User) => {
    setUser(userData)
    setDevAuthCookie(userData)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    removeDevAuthCookie()
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...updates }
      setDevAuthCookie(updated)
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
