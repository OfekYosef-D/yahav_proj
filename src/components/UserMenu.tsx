'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// For now, we'll use a mock session until next-auth is installed
// This component will work in both scenarios

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  // Mock session - replace with real session when next-auth is installed
  // To enable real auth, uncomment the next-auth imports after running:
  // npm install next-auth bcryptjs zod @types/bcryptjs
  const session: { data: { user?: { name?: string; email?: string; role?: string } } | null, status: 'authenticated' | 'unauthenticated' } = { 
    data: null, 
    status: 'unauthenticated' 
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Show nothing during SSR
  if (!mounted) {
    return null
  }

  // Guest view - show login/signup buttons
  if (session.status !== 'authenticated' || !session?.data?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link 
          href="/login"
          className="px-4 py-2 text-neutral-600 hover:text-primary-600 transition-colors font-medium text-sm"
        >
          התחברות
        </Link>
        <Link 
          href="/signup"
          className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          הרשמה
        </Link>
      </div>
    )
  }

  // Authenticated view
  const { name, email, role } = session.data?.user || {}
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2) || email?.[0]?.toUpperCase() || '?'

  const handleLogout = () => {
    // Mock logout - replace with signOut() from next-auth
    window.location.href = '/'
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100 transition-colors"
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
          role === 'LENDER' 
            ? 'bg-gradient-to-br from-secondary-400 to-secondary-600' 
            : 'bg-gradient-to-br from-primary-400 to-primary-600'
        }`}>
          {initials}
        </div>
        <svg 
          className={`w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-fadeIn">
          {/* User info */}
          <div className="px-4 py-3 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                role === 'LENDER' 
                  ? 'bg-gradient-to-br from-secondary-400 to-secondary-600' 
                  : 'bg-gradient-to-br from-primary-400 to-primary-600'
              }`}>
                {initials}
              </div>
              <div>
                <p className="font-semibold text-neutral-800">{name}</p>
                <p className="text-sm text-neutral-500">{email}</p>
              </div>
            </div>
            <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              role === 'LENDER' 
                ? 'bg-secondary-100 text-secondary-700' 
                : 'bg-primary-100 text-primary-700'
            }`}>
              {role === 'LENDER' ? '💰 משכיר' : '🔍 שוכר'}
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              הפרופיל שלי
            </Link>

            {role === 'LENDER' && (
              <>
                <Link
                  href="/my-listings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  הפריטים שלי
                </Link>
                <Link
                  href="/list-item"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  הוסף פריט חדש
                </Link>
              </>
            )}

            <Link
              href="/my-bookings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              ההזמנות שלי
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              הגדרות
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-neutral-100 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              התנתקות
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
