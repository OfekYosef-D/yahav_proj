'use client'

import Link from 'next/link'
import { useState } from 'react'
import RequestModal from './RequestModal'
import { useAuthModal } from '@/hooks/useAuthModal'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  
  // Use auth context
  const { isAuthenticated, user, showAuthModal, logout, isDevMode, devLogin } = useAuthModal()

  const handleLoginClick = () => {
    showAuthModal('general')
  }

  const handleListItemClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      showAuthModal('list_item')
    }
  }

  return (
    <>
      <header className="bg-primary-600 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* לוגו - בצד ימין (RTL) */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-black/10">
                <svg 
                  className="w-5 h-5 text-primary-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-tight">פריט לטיסה</span>
                <span className="text-[10px] text-white/70 font-medium tracking-wide">PREMIUM RENTALS</span>
              </div>
            </Link>

            {/* ניווט דסקטופ - באמצע */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link 
                href="/" 
                className="px-4 py-2 text-white hover:text-orange-300 hover:bg-white/10 rounded-lg transition-all font-medium text-sm"
              >
                דף הבית
              </Link>
              <Link 
                href="/listings" 
                className="px-4 py-2 text-white hover:text-orange-300 hover:bg-white/10 rounded-lg transition-all font-medium text-sm"
              >
                כל הפריטים
              </Link>
              <Link 
                href="/requests" 
                className="px-4 py-2 text-white hover:text-orange-300 hover:bg-white/10 rounded-lg transition-all font-medium text-sm relative"
              >
                הזדמנויות
                {/* ✅ Fixed notification dot positioning */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-sm" />
              </Link>
              <Link 
                href="/how-it-works" 
                className="px-4 py-2 text-white hover:text-orange-300 hover:bg-white/10 rounded-lg transition-all font-medium text-sm"
              >
                איך זה עובד?
              </Link>
            </nav>

            {/* כפתורי פעולה - בצד שמאל (RTL) */}
            <div className="hidden md:flex items-center gap-3">
              {/* ✨ Magic Action Button - Post a Request */}
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="relative group"
              >
                <div className="relative flex items-center gap-2 bg-gradient-to-l from-orange-500 to-amber-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02]">
                  {/* ✅ Fixed pulsing ring positioning */}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white" />
                  </span>
                  
                  <svg 
                    className="w-4 h-4" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                  </svg>
                  <span className="whitespace-nowrap">יש לי בקשה!</span>
                </div>
              </button>

              {/* Show "השכר פריט" for everyone - will show auth modal if not authenticated */}
              <Link 
                href="/list-item" 
                onClick={handleListItemClick}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md shadow-primary-600/20"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                  />
                </svg>
                השכר פריט
              </Link>

              {/* Auth Section Separator */}
              <div className="h-8 w-px bg-white/30 mx-1" />

              {/* Auth Section */}
              {isAuthenticated ? (
                // Logged in user menu
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center border-2 border-white/50 shadow-md">
                      <span className="text-primary-600 font-bold text-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white leading-tight">{user?.name}</span>
                      <span className="text-xs text-white/70">
                        {user?.role === 'LENDER' ? 'משכיר' : user?.role === 'ADMIN' ? 'מנהל' : 'שוכר'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 text-white/70 hover:text-red-300 hover:bg-white/10 rounded-lg transition-all text-sm font-medium"
                  >
                    יציאה
                  </button>
                </div>
              ) : (
                // Guest view - Login button opens modal
                <div className="flex items-center gap-2">
                  {/* ✅ FIXED: Login button - white text on blue background */}
                  <button 
                    onClick={handleLoginClick}
                    className="px-4 py-2 text-white hover:text-orange-300 hover:bg-white/10 rounded-xl transition-all font-medium text-sm"
                  >
                    התחברות
                  </button>
                  
                  {/* ✅ FIXED: Register button - WHITE background for visibility */}
                  <button 
                    onClick={handleLoginClick}
                    className="px-5 py-2.5 bg-white text-primary-600 hover:bg-orange-50 hover:text-primary-700 rounded-xl font-bold text-sm transition-all shadow-md"
                  >
                    הרשמה
                  </button>
                </div>
              )}
            </div>

            {/* כפתור תפריט מובייל */}
            <button 
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="תפריט"
            >
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                )}
              </svg>
            </button>
          </div>

          {/* תפריט מובייל */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-white/20 animate-slideDown">
              <nav className="flex flex-col gap-1">
                <Link 
                  href="/" 
                  className="px-4 py-3 text-white hover:text-orange-300 hover:bg-white/10 rounded-lg transition-all font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  דף הבית
                </Link>
                <Link 
                  href="/listings" 
                  className="px-4 py-3 text-white hover:text-orange-300 hover:bg-white/10 rounded-lg transition-all font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  כל הפריטים
                </Link>
                <Link 
                  href="/requests" 
                  className="px-4 py-3 text-white hover:text-orange-300 hover:bg-white/10 rounded-lg transition-all font-medium flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  הזדמנויות
                  <span className="bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">חדש</span>
                </Link>
                <Link 
                  href="/how-it-works" 
                  className="px-4 py-3 text-white hover:text-orange-300 hover:bg-white/10 rounded-lg transition-all font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  איך זה עובד?
                </Link>
                
                <hr className="my-2 border-white/20" />
                
                {/* Magic Action Button - Mobile */}
                <button
                  onClick={() => {
                    setIsRequestModalOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="relative flex items-center justify-center gap-2 bg-gradient-to-l from-orange-500 to-amber-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-500/25"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                  </svg>
                  יש לי בקשה!
                </button>
                
                <Link 
                  href="/list-item" 
                  onClick={(e) => {
                    handleListItemClick(e)
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-center gap-2 bg-primary-600 text-white py-3.5 rounded-xl font-semibold"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                    />
                  </svg>
                  השכר פריט
                </Link>
                
                {/* Auth buttons (Mobile) */}
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/20">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-white/70">
                          {user?.role === 'LENDER' ? 'משכיר' : user?.role === 'ADMIN' ? 'מנהל' : 'שוכר'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center justify-center gap-2 text-red-300 border border-red-300/50 bg-red-500/20 py-3 rounded-xl font-medium hover:bg-red-500/30 transition-colors"
                    >
                      יציאה מהחשבון
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    {/* ✅ FIXED: Mobile login button - white text on blue */}
                    <button 
                      onClick={() => {
                        handleLoginClick()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 py-3.5 rounded-xl font-medium transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      התחברות
                    </button>
                    
                    {/* ✅ FIXED: Mobile register button - WHITE for visibility */}
                    <button 
                      onClick={() => {
                        handleLoginClick()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center justify-center gap-2 bg-white text-primary-600 py-3.5 rounded-xl font-bold transition-colors hover:bg-orange-50"
                    >
                      הרשמה חינם
                    </button>
                  </div>
                )}

                {/* Dev Mode Indicator */}
                {isDevMode && !isAuthenticated && (
                  <div className="mt-2 p-3 bg-amber-400/20 border border-amber-400/40 rounded-xl">
                    <p className="text-xs text-amber-200 font-medium mb-2 text-center">⚠️ מצב פיתוח</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          devLogin('RENTER')
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex-1 py-2 bg-amber-400/30 hover:bg-amber-400/50 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        שוכר
                      </button>
                      <button
                        onClick={() => {
                          devLogin('LENDER')
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex-1 py-2 bg-amber-400/30 hover:bg-amber-400/50 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        משכיר
                      </button>
                    </div>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Request Modal */}
      <RequestModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)} 
      />
    </>
  )
}
