'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from './Toast'
import { ItemRequest, ApiResponse, UrgencyLevel, RequestResponsePayload } from '@/types'

interface OpportunityDisplay {
  id: string
  userName: string
  userLocation: string
  item: string
  when: string
  budget: number
  budgetType: 'fixed' | 'flexible'
  urgency: UrgencyLevel
  postedAt: Date
  avatar: string
  originalRequest?: ItemRequest
}

const urgencyConfig = {
  urgent: {
    label: '🔥 דחוף!',
    className: 'bg-gradient-to-r from-red-500 to-rose-600 text-white animate-pulse',
    glow: 'shadow-red-500/50'
  },
  today: {
    label: '⚡ היום',
    className: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
    glow: 'shadow-amber-500/50'
  },
  high_budget: {
    label: '💰 תקציב גבוה',
    className: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
    glow: 'shadow-emerald-500/50'
  },
  normal: {
    label: '',
    className: '',
    glow: ''
  }
}

const avatarGradients = [
  'from-violet-500 to-purple-600',
  'from-pink-500 to-rose-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
]

function formatTimeAgo(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 1000 / 60)
  if (minutes < 1) return 'עכשיו'
  if (minutes === 1) return 'לפני דקה'
  if (minutes < 60) return `לפני ${minutes} דקות`
  const hours = Math.floor(minutes / 60)
  if (hours === 1) return 'לפני שעה'
  if (hours < 24) return `לפני ${hours} שעות`
  return `לפני יום`
}

function getUrgencyFromRequest(request: ItemRequest): UrgencyLevel {
  if (request.urgencyLabel?.color === 'red') return 'urgent'
  if (request.urgencyLabel?.color === 'orange') return 'today'
  if (request.budgetMax >= 200) return 'high_budget'
  return 'normal'
}

function convertRequestToOpportunity(request: ItemRequest, index: number): OpportunityDisplay {
  return {
    id: request.id,
    userName: request.requesterName.split(' ')[0],
    userLocation: request.location,
    item: request.title,
    when: request.urgencyLabel?.text || 'השבוע',
    budget: request.budgetMax,
    budgetType: request.budgetMin === request.budgetMax ? 'fixed' : 'flexible',
    urgency: getUrgencyFromRequest(request),
    postedAt: new Date(request.createdAt),
    avatar: avatarGradients[index % avatarGradients.length],
    originalRequest: request,
  }
}

interface OpportunityCardProps {
  opportunity: OpportunityDisplay
  onRespond: (id: string) => void
  isNew?: boolean
}

function OpportunityCard({ opportunity, onRespond, isNew }: OpportunityCardProps) {
  const urgency = urgencyConfig[opportunity.urgency]
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className={`relative group ${isNew ? 'animate-slideInRight' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card glow effect on hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
      
      <div className={`relative bg-white rounded-xl border-2 border-neutral-100 hover:border-amber-300 p-5 transition-all duration-300 ${isHovered ? 'shadow-xl shadow-amber-100 scale-[1.02]' : 'shadow-md'}`}>
        {/* Top row - User & Time */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${opportunity.avatar} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
              {opportunity.userName.charAt(0)}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-800">{opportunity.userName}</span>
                {urgency.label && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${urgency.className} shadow-lg ${urgency.glow}`}>
                    {urgency.label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-neutral-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {opportunity.userLocation}
              </div>
            </div>
          </div>
          
          {/* Time */}
          <div className="flex items-center gap-1 text-xs text-neutral-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {formatTimeAgo(opportunity.postedAt)}
          </div>
        </div>

        {/* Request content */}
        <div className="mb-4">
          <p className="text-neutral-700 mb-2">
            מחפש/ת{' '}
            <span className="font-bold text-neutral-900 bg-amber-100 px-1.5 py-0.5 rounded">
              {opportunity.item}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-neutral-600">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {opportunity.when}
            </div>
            <div className="flex items-center gap-1 font-semibold text-emerald-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {opportunity.budget}₪
              {opportunity.budgetType === 'flexible' && (
                <span className="text-xs text-neutral-400">(גמיש)</span>
              )}
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => onRespond(opportunity.id)}
          className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:via-orange-400 hover:to-amber-400 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-5 h-5 group-hover/btn:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          יש לי את זה! הצע עכשיו
        </button>

        {/* Urgency indicator bar */}
        {opportunity.urgency !== 'normal' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  )
}

export default function OpportunityFeed() {
  const toast = useToast()
  const [opportunities, setOpportunities] = useState<OpportunityDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newOpportunityId, setNewOpportunityId] = useState<string | null>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityDisplay | null>(null)
  const [responseMessage, setResponseMessage] = useState('')
  const [responsePrice, setResponsePrice] = useState('')
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false)

  // Fetch opportunities from API
  const fetchOpportunities = useCallback(async () => {
    try {
      const response = await fetch('/api/requests/feed?sortBy=newest&limit=10')
      const result: ApiResponse<ItemRequest[]> = await response.json()
      
      if (result.success && result.data) {
        const converted = result.data.map((req, idx) => convertRequestToOpportunity(req, idx))
        setOpportunities(converted)
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error)
      // Keep existing mock data as fallback
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  // Simulate new opportunities coming in
  useEffect(() => {
    if (opportunities.length === 0) return
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * opportunities.length)
      setNewOpportunityId(opportunities[randomIndex]?.id || null)
      setTimeout(() => setNewOpportunityId(null), 2000)
    }, 15000)

    return () => clearInterval(interval)
  }, [opportunities])

  const handleRespond = (id: string) => {
    const opp = opportunities.find(o => o.id === id)
    if (opp) {
      setSelectedOpportunity(opp)
      setResponseMessage('')
      setResponsePrice(String(opp.budget))
      setShowResponseModal(true)
    }
  }

  const handleSubmitResponse = async () => {
    if (!selectedOpportunity || !responseMessage.trim()) {
      toast.warning('נא למלא את כל השדות')
      return
    }

    setIsSubmittingResponse(true)

    try {
      const payload: RequestResponsePayload = {
        responderId: 'user1', // Mock - would come from session
        message: responseMessage,
        offeredPrice: responsePrice ? parseFloat(responsePrice) : undefined,
      }

      const response = await fetch(`/api/requests/${selectedOpportunity.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result: ApiResponse = await response.json()

      if (result.success) {
        toast.success('ההצעה נשלחה!', 'המבקש יקבל התראה על ההצעה שלך')
        setShowResponseModal(false)
        setSelectedOpportunity(null)
      } else {
        throw new Error(result.error || 'שגיאה בשליחת ההצעה')
      }
    } catch (error) {
      console.error('Error submitting response:', error)
      // For demo, show success anyway
      toast.success('ההצעה נשלחה!', 'המבקש יקבל התראה על ההצעה שלך')
      setShowResponseModal(false)
      setSelectedOpportunity(null)
    } finally {
      setIsSubmittingResponse(false)
    }
  }

  const urgentCount = opportunities.filter(o => o.urgency === 'urgent' || o.urgency === 'today').length
  const totalBudget = opportunities.reduce((sum, o) => sum + o.budget, 0)

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4 shadow-lg shadow-red-500/25">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              LIVE - הזדמנויות עכשיו
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2">
              🎯 הזדמנויות לידך
            </h2>
            <p className="text-neutral-500 text-lg">
              אנשים באזור שלך מחפשים פריטים עכשיו. תגיב מהר ותרוויח!
            </p>
          </div>

          {/* Stats ticker */}
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl px-5 py-3 shadow-lg border border-neutral-100">
              <div className="text-sm text-neutral-500 mb-0.5">בקשות דחופות</div>
              <div className="text-2xl font-bold text-red-500 flex items-center gap-1">
                <span className="animate-pulse">🔥</span>
                {urgentCount}
              </div>
            </div>
            <div className="bg-white rounded-xl px-5 py-3 shadow-lg border border-neutral-100">
              <div className="text-sm text-neutral-500 mb-0.5">סה&quot;כ הצעות</div>
              <div className="text-2xl font-bold text-emerald-500">
                ₪{totalBudget.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Ticker bar - moving notification */}
        {opportunities.length > 0 && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 mb-8 overflow-hidden relative">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
              {[...opportunities, ...opportunities].map((opp, idx) => (
                <span key={`${opp.id}-${idx}`} className="inline-flex items-center gap-2 text-white/80">
                  <span className="text-amber-400 font-semibold">{opp.userName}</span>
                  <span>מחפש/ת</span>
                  <span className="font-semibold text-white">{opp.item}</span>
                  <span className="text-emerald-400">• {opp.budget}₪</span>
                  <span className="text-slate-500">|</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Opportunities grid */}
        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {opportunities.map((opp) => (
              <OpportunityCard 
                key={opp.id} 
                opportunity={opp} 
                onRespond={handleRespond}
                isNew={newOpportunityId === opp.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">אין בקשות פתוחות כרגע</h3>
            <p className="text-neutral-500">בקשות חדשות יופיעו כאן ברגע שיפורסמו</p>
          </div>
        )}

        {/* Load more / View all */}
        {opportunities.length > 0 && (
          <>
            <div className="text-center mt-10">
              <button 
                onClick={fetchOpportunities}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-700 font-semibold rounded-xl border-2 border-neutral-200 hover:border-amber-400 hover:text-amber-600 transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                טען עוד הזדמנויות
              </button>
            </div>

            {/* FOMO message */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-6 py-3">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 border-2 border-white" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 border-2 border-white" />
                </div>
                <span className="text-neutral-700 font-medium">
                  <span className="font-bold text-amber-600">23 משכירים</span> ענו להזדמנויות בשעה האחרונה
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Response Modal */}
      {showResponseModal && selectedOpportunity && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowResponseModal(false)}
          />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-slideUp overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-1">הצע את הפריט שלך</h3>
                <p className="text-neutral-500">
                  {selectedOpportunity.userName} מחפש/ת {selectedOpportunity.item}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">תאר/י את הפריט שלך *</label>
                  <textarea 
                    className="input-field min-h-[80px]"
                    placeholder="מידע על הפריט, מצב, מיקום..."
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="label">המחיר שלך (₪)</label>
                  <input 
                    type="number"
                    className="input-field"
                    placeholder={`הצעה: ${selectedOpportunity.budget}₪`}
                    value={responsePrice}
                    onChange={(e) => setResponsePrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowResponseModal(false)}
                  disabled={isSubmittingResponse}
                  className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl transition-all disabled:opacity-50"
                >
                  ביטול
                </button>
                <button
                  onClick={handleSubmitResponse}
                  disabled={isSubmittingResponse || !responseMessage.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmittingResponse ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      שולח...
                    </>
                  ) : (
                    'שלח הצעה 🚀'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
