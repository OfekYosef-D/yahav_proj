'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import RoleSelection from '@/components/RoleSelection'
import { useAuth } from '@/lib/auth-context'

type SignupStep = 'role' | 'details'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated } = useAuth()
  
  const [step, setStep] = useState<SignupStep>('role')
  const [selectedRole, setSelectedRole] = useState<'RENTER' | 'LENDER' | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get callbackUrl and suggested role from URL params
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const suggestedRole = searchParams.get('role') as 'RENTER' | 'LENDER' | null

  // Pre-select role if passed via URL
  useEffect(() => {
    if (suggestedRole && (suggestedRole === 'RENTER' || suggestedRole === 'LENDER')) {
      setSelectedRole(suggestedRole)
    }
  }, [suggestedRole])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(decodeURIComponent(callbackUrl))
    }
  }, [isAuthenticated, callbackUrl, router])

  const handleRoleSelect = (role: 'RENTER' | 'LENDER') => {
    setSelectedRole(role)
  }

  const handleContinueToDetails = () => {
    if (!selectedRole) {
      setError('נא לבחור סוג חשבון')
      return
    }
    setError('')
    setStep('details')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('נא למלא את כל השדות')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות לא תואמות')
      return
    }

    if (formData.password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים')
      return
    }

    setIsSubmitting(true)

    // Simulate API call for registration
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // ✅ Auto-login after registration via auth-context
    login({
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: selectedRole || 'RENTER',
      location: formData.location,
    })
    
    // The useEffect will handle redirect to callbackUrl
  }

  const locations = [
    'תל אביב', 'רמת גן', 'גבעתיים', 'הרצליה', 'רעננה',
    'חיפה', 'ירושלים', 'באר שבע', 'ראשון לציון', 'פתח תקווה',
    'נתניה', 'אשדוד', 'חולון', 'בת ים', 'אילת',
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
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
            הצטרפו לקהילה! 🎉
          </h1>
          <p className="text-neutral-500">
            {step === 'role' 
              ? 'בחרו את סוג החשבון שלכם' 
              : 'מלאו את הפרטים להשלמת ההרשמה'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === 'role' ? 'text-primary-600' : 'text-neutral-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step === 'role' ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-600'
            }`}>
              {step === 'details' ? '✓' : '1'}
            </div>
            <span className="font-medium">בחירת תפקיד</span>
          </div>
          <div className="w-8 border-t-2 border-neutral-200 self-center" />
          <div className={`flex items-center gap-2 ${step === 'details' ? 'text-primary-600' : 'text-neutral-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step === 'details' ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500'
            }`}>
              2
            </div>
            <span className="font-medium">פרטים אישיים</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>מצב פיתוח - ההרשמה תחבר אתכם אוטומטית</span>
          </div>

          {/* Callback URL indicator */}
          {callbackUrl !== '/' && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>לאחר ההרשמה תועברו ישירות לדף שביקשתם</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {step === 'role' ? (
            <>
              <RoleSelection 
                selectedRole={selectedRole} 
                onSelect={handleRoleSelect} 
              />
              
              <button
                type="button"
                onClick={handleContinueToDetails}
                disabled={!selectedRole}
                className="w-full mt-8 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                המשך לפרטים אישיים
                <svg className="w-5 h-5 inline-block mr-2 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Back button */}
              <button
                type="button"
                onClick={() => setStep('role')}
                className="text-neutral-500 hover:text-primary-600 flex items-center gap-1 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                חזרה לבחירת תפקיד
              </button>

              {/* Selected role badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                selectedRole === 'RENTER' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {selectedRole === 'RENTER' ? '🔍 שוכר' : '💰 משכיר'}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-neutral-700 font-medium mb-2">שם מלא *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="ישראל ישראלי"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-neutral-700 font-medium mb-2">כתובת אימייל *</label>
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
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-neutral-700 font-medium mb-2">
                  {selectedRole === 'LENDER' ? 'אזור הפעילות שלך *' : 'איפה אתה נמצא? *'}
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  required
                >
                  <option value="">בחר אזור</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-neutral-700 font-medium mb-2">סיסמה *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="לפחות 6 תווים"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  dir="ltr"
                  required
                  minLength={6}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-neutral-700 font-medium mb-2">אימות סיסמה *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="הזינו שוב את הסיסמה"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  dir="ltr"
                  required
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
                    יוצר חשבון...
                  </span>
                ) : (
                  'צור חשבון והתחל! 🚀'
                )}
              </button>

              {/* Terms */}
              <p className="text-xs text-neutral-400 text-center">
                בלחיצה על &quot;צור חשבון&quot; אתם מסכימים ל
                <a href="/terms" className="text-primary-600 hover:underline">תנאי השימוש</a>
                {' '}ול
                <a href="/privacy" className="text-primary-600 hover:underline">מדיניות הפרטיות</a>
              </p>
            </form>
          )}
        </div>

        {/* Login link - preserve callbackUrl */}
        <p className="text-center mt-6 text-neutral-600">
          יש לכם כבר חשבון?{' '}
          <Link 
            href={`/login${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} 
            className="text-primary-600 font-medium hover:underline"
          >
            התחברו כאן
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
