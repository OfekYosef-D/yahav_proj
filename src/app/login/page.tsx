'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const messageParam = searchParams.get('message')
  const roleParam = searchParams.get('role')

  // Handle redirect messages
  useEffect(() => {
    if (messageParam === 'login_required' || messageParam === 'auth_required') {
      setMessage('עליכם להתחבר כדי לצפות בתוכן זה')
    } else if (messageParam === 'registration_success') {
      setMessage('ההרשמה הושלמה בהצלחה! כעת תוכלו להתחבר')
    } else if (messageParam === 'lender_required') {
      setMessage('עליכם להתחבר כמשכיר כדי לגשת לדף זה')
    }
  }, [messageParam])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(decodeURIComponent(callbackUrl))
    }
  }, [isAuthenticated, callbackUrl, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!formData.email || !formData.password) {
      setError('נא למלא את כל השדות')
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Demo accounts validation
    const demoAccounts: Record<string, { name: string; role: 'RENTER' | 'LENDER' | 'ADMIN' }> = {
      'david@example.com': { name: 'דוד כהן', role: 'LENDER' },
      'amit@example.com': { name: 'עמית לוי', role: 'RENTER' },
      'admin@example.com': { name: 'מנהל מערכת', role: 'ADMIN' },
    }

    const account = demoAccounts[formData.email]
    
    if (account && formData.password === '123456') {
      // ✅ Login via auth-context (sets cookie + state)
      login({
        id: `user-${formData.email.split('@')[0]}`,
        name: account.name,
        email: formData.email,
        role: account.role,
      })
      
      // Redirect will happen via useEffect when isAuthenticated changes
    } else {
      setError('אימייל או סיסמה שגויים. לבדיקה, השתמשו בחשבונות הדמו.')
      setIsSubmitting(false)
    }
  }

  // Demo accounts for testing
  const demoAccounts = [
    { email: 'david@example.com', password: '123456', label: 'משכיר', role: 'LENDER' as const },
    { email: 'amit@example.com', password: '123456', label: 'שוכר', role: 'RENTER' as const },
  ]

  const handleDemoLogin = async (email: string, role: 'RENTER' | 'LENDER', label: string) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // ✅ Login via auth-context
    login({
      id: `user-${email.split('@')[0]}`,
      name: role === 'LENDER' ? 'דוד כהן' : 'עמית לוי',
      email,
      role,
    })
    
    // Redirect will happen via useEffect
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4 flex items-center">
      <div className="max-w-md mx-auto w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-neutral-800">פריט לטיסה</span>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            שמחים לראות אתכם! 👋
          </h1>
          <p className="text-neutral-500">
            התחברו לחשבון שלכם
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>מצב פיתוח - השתמשו בחשבונות הדמו למטה</span>
          </div>

          {/* Callback URL indicator */}
          {callbackUrl !== '/' && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>לאחר ההתחברות תועברו חזרה לדף שביקשתם</span>
            </div>
          )}

          {/* Success/Info Message */}
          {message && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-neutral-700 font-medium mb-2">כתובת אימייל</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                dir="ltr"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-neutral-700 font-medium">סיסמה</label>
                <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">
                  שכחתי סיסמה
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                dir="ltr"
                required
                autoComplete="current-password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  מתחבר...
                </span>
              ) : (
                'התחבר'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <p className="text-sm text-neutral-500 text-center mb-4">
              💡 לבדיקה מהירה (סיסמה: 123456):
            </p>
            <div className="grid grid-cols-2 gap-3">
              {demoAccounts.map(account => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleDemoLogin(account.email, account.role, account.label)}
                  disabled={isSubmitting}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
                    account.role === 'LENDER'
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  }`}
                >
                  {account.role === 'LENDER' ? '💰' : '🔍'} {account.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Signup link - preserve callbackUrl */}
        <p className="text-center mt-6 text-neutral-600">
          אין לכם עדיין חשבון?{' '}
          <Link 
            href={`/signup${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}${roleParam ? `&role=${roleParam}` : ''}` : ''}`} 
            className="text-primary-600 font-medium hover:underline"
          >
            הצטרפו עכשיו
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
