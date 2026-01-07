'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ============================================
// Types
// ============================================

type AuthAction = 'view_listing' | 'book' | 'post_request' | 'respond' | 'list_item' | 'general'
type UserRole = 'RENTER' | 'LENDER' | 'ADMIN'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  action?: AuthAction
  title?: string
  message?: string
  onDevLogin?: (role: UserRole) => void
  isDevMode?: boolean
}

// ============================================
// Action Messages Configuration
// ============================================

const actionMessages: Record<AuthAction, { title: string; message: string; icon: React.ReactNode; suggestedRole: UserRole }> = {
  view_listing: {
    title: 'התחבר כדי לראות פרטים',
    message: 'הירשם או התחבר כדי לצפות בפרטי הפריט וליצור קשר עם המשכיר',
    suggestedRole: 'RENTER',
    icon: (
      <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  book: {
    title: 'התחבר כדי להזמין',
    message: 'עליך להתחבר לחשבון שלך כדי לבצע הזמנה',
    suggestedRole: 'RENTER',
    icon: (
      <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  post_request: {
    title: 'רוצה לפרסם בקשה?',
    message: 'הירשם בחינם ופרסם את הבקשה שלך לקהילה',
    suggestedRole: 'RENTER',
    icon: (
      <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  respond: {
    title: 'התחבר כדי להגיב',
    message: 'עליך להתחבר כמשכיר כדי להגיב לבקשות',
    suggestedRole: 'LENDER',
    icon: (
      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  list_item: {
    title: 'התחבר כדי להשכיר',
    message: 'עליך להתחבר כמשכיר כדי להוסיף פריטים להשכרה',
    suggestedRole: 'LENDER',
    icon: (
      <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  general: {
    title: 'התחבר לפריט לטיסה',
    message: 'התחבר או הירשם כדי להמשיך',
    suggestedRole: 'RENTER',
    icon: (
      <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
}

// ============================================
// Component
// ============================================

export default function AuthModal({ 
  isOpen, 
  onClose, 
  action = 'general',
  title: customTitle,
  message: customMessage,
  onDevLogin,
  isDevMode = false,
}: AuthModalProps) {
  const pathname = usePathname()
  const callbackUrl = encodeURIComponent(pathname)
  const actionConfig = actionMessages[action]
  
  // Renter vs Lender toggle state
  const [selectedRole, setSelectedRole] = useState<'RENTER' | 'LENDER'>(actionConfig.suggestedRole === 'ADMIN' ? 'RENTER' : actionConfig.suggestedRole)

  // Update selected role when action changes
  useEffect(() => {
    const suggested = actionConfig.suggestedRole
    if (suggested !== 'ADMIN') {
      setSelectedRole(suggested)
    }
  }, [action, actionConfig.suggestedRole])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const displayTitle = customTitle || actionConfig.title
  const displayMessage = customMessage || actionConfig.message

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-neutral-100 transition-colors z-10"
        >
          <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-orange-50/50 opacity-70" />
        
        {/* Content */}
        <div className="relative px-8 py-10 text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-5 border border-neutral-100">
            {actionConfig.icon}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            {displayTitle}
          </h2>

          {/* Message */}
          <p className="text-neutral-500 mb-6 leading-relaxed text-sm">
            {displayMessage}
          </p>

          {/* Role Toggle */}
          <div className="mb-6">
            <p className="text-xs text-neutral-400 mb-3">אני רוצה:</p>
            <div className="flex bg-neutral-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setSelectedRole('RENTER')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  selectedRole === 'RENTER'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                🔍 לשכור פריטים
              </button>
              <button
                onClick={() => setSelectedRole('LENDER')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  selectedRole === 'LENDER'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                💰 להשכיר פריטים
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href={`/signup?callbackUrl=${callbackUrl}&role=${selectedRole}`}
              onClick={onClose}
              className="w-full py-3.5 px-6 bg-gradient-to-l from-primary-600 to-primary-700 text-white rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              הרשמה חינם
            </Link>

            <Link
              href={`/login?callbackUrl=${callbackUrl}`}
              onClick={onClose}
              className="w-full py-3.5 px-6 bg-white border-2 border-neutral-200 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 hover:border-neutral-300 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              יש לי חשבון
            </Link>
          </div>

          {/* Dev Mode Quick Login */}
          {isDevMode && onDevLogin && (
            <div className="mt-6 pt-5 border-t border-dashed border-amber-300 bg-amber-50/50 -mx-8 px-8 pb-2">
              <div className="flex items-center justify-center gap-2 mb-3">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-xs font-semibold text-amber-700">מצב פיתוח בלבד</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onDevLogin('RENTER')}
                  className="flex-1 py-2 px-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  כניסה כשוכר
                </button>
                <button
                  onClick={() => onDevLogin('LENDER')}
                  className="flex-1 py-2 px-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  כניסה כמשכיר
                </button>
              </div>
              <p className="text-[10px] text-amber-600 mt-2">
                ⚠️ לא יעבוד בפרודקשן
              </p>
            </div>
          )}

          {/* Benefits */}
          {!isDevMode && (
            <div className="mt-6 pt-5 border-t border-neutral-100">
              <p className="text-xs text-neutral-400 mb-3">ההרשמה מאפשרת לך:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
                  💬 צ&apos;אט עם משכירים
                </span>
                <span className="px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
                  📋 פרסום בקשות
                </span>
                <span className="px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
                  ⭐ שמירת מועדפים
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
