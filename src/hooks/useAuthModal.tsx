'use client'

import { useState, useCallback, createContext, useContext, ReactNode, useEffect } from 'react'
import AuthModal from '@/components/AuthModal'
import { useAuth } from '@/lib/auth-context'

// ============================================
// Types
// ============================================

export type AuthAction = 'view_listing' | 'book' | 'post_request' | 'respond' | 'list_item' | 'general'
export type UserRole = 'RENTER' | 'LENDER' | 'ADMIN'

interface PendingCallback {
  action: AuthAction
  callback: () => void
}

interface AuthModalContextType {
  // Modal controls
  showAuthModal: (action?: AuthAction, customTitle?: string, customMessage?: string) => void
  hideAuthModal: () => void
  isModalOpen: boolean
  
  // Auth state (from auth-context)
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    id: string
    name: string
    email: string
    role: UserRole
    location?: string
  } | null
  
  // Auth actions
  requireAuth: (action: AuthAction, callback: () => void) => void
  devLogin: (role: UserRole) => void
  logout: () => void
  
  // Environment
  isDevMode: boolean
}

const AuthModalContext = createContext<AuthModalContextType | null>(null)

// ============================================
// Check if we're in development mode
// ============================================

const IS_DEV_MODE = process.env.NODE_ENV === 'development'

// ============================================
// Provider
// ============================================

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [action, setAction] = useState<AuthAction>('general')
  const [customTitle, setCustomTitle] = useState<string | undefined>()
  const [customMessage, setCustomMessage] = useState<string | undefined>()
  const [pendingCallback, setPendingCallback] = useState<PendingCallback | null>(null)
  
  // ✅ Hook called unconditionally at top level (Rules of Hooks compliant)
  const { user, isAuthenticated, login, logout: authLogout } = useAuth()

  // Handle mounting for hydration safety
  useEffect(() => {
    setMounted(true)
  }, [])

  // Execute pending callback after successful login
  useEffect(() => {
    if (isAuthenticated && pendingCallback) {
      // User just logged in, execute the pending callback
      pendingCallback.callback()
      setPendingCallback(null)
      setIsModalOpen(false)
    }
  }, [isAuthenticated, pendingCallback])

  // ============================================
  // Modal Controls
  // ============================================

  const showAuthModal = useCallback((
    modalAction: AuthAction = 'general',
    title?: string,
    message?: string
  ) => {
    setAction(modalAction)
    setCustomTitle(title)
    setCustomMessage(message)
    setIsModalOpen(true)
  }, [])

  const hideAuthModal = useCallback(() => {
    setIsModalOpen(false)
    setPendingCallback(null)
  }, [])

  // ============================================
  // Auth Actions
  // ============================================

  /**
   * Require authentication before executing a callback.
   * If user is authenticated, callback runs immediately.
   * Otherwise, shows auth modal and stores callback for after login.
   */
  const requireAuth = useCallback((authAction: AuthAction, callback: () => void) => {
    if (isAuthenticated) {
      callback()
    } else {
      setPendingCallback({ action: authAction, callback })
      showAuthModal(authAction)
    }
  }, [isAuthenticated, showAuthModal])

  /**
   * Development mode login - allows quick testing without real auth.
   * ⚠️ DISABLED in production!
   */
  const devLogin = useCallback((role: UserRole) => {
    if (!IS_DEV_MODE) {
      console.warn('Dev login is disabled in production')
      return
    }
    
    const mockUsers: Record<UserRole, { id: string; name: string; email: string; role: UserRole }> = {
      RENTER: { id: 'dev-renter-1', name: 'משתמש בדיקות (שוכר)', email: 'renter@dev.local', role: 'RENTER' },
      LENDER: { id: 'dev-lender-1', name: 'משתמש בדיקות (משכיר)', email: 'lender@dev.local', role: 'LENDER' },
      ADMIN: { id: 'dev-admin-1', name: 'מנהל בדיקות', email: 'admin@dev.local', role: 'ADMIN' },
    }
    
    login(mockUsers[role])
    setIsModalOpen(false)
  }, [login])

  const logout = useCallback(() => {
    authLogout()
  }, [authLogout])

  // ============================================
  // Context Value
  // ============================================

  const value: AuthModalContextType = {
    showAuthModal,
    hideAuthModal,
    isModalOpen,
    isAuthenticated: mounted ? isAuthenticated : false,
    isLoading: !mounted,
    user: mounted ? (user as AuthModalContextType['user']) : null,
    requireAuth,
    devLogin,
    logout,
    isDevMode: IS_DEV_MODE,
  }

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={hideAuthModal}
        action={action}
        title={customTitle}
        message={customMessage}
        onDevLogin={devLogin}
        isDevMode={IS_DEV_MODE}
      />
    </AuthModalContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider')
  }
  return context
}

export default useAuthModal
