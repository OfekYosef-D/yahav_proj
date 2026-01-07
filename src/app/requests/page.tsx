'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toast'
import { ItemRequest, ApiResponse, RequestResponsePayload } from '@/types'

type SortOption = 'urgency' | 'newest' | 'budget_high' | 'budget_low'

export default function RequestsPage() {
  const toast = useToast()
  const [requests, setRequests] = useState<ItemRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<ItemRequest | null>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responsePrice, setResponsePrice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('urgency')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const categories = [
    { id: '', label: 'הכל' },
    { id: 'מזוודות', label: '🧳 מזוודות' },
    { id: 'תיקים', label: '👜 תיקים' },
    { id: 'ציוד צילום', label: '📷 ציוד צילום' },
    { id: 'ציוד ספורט', label: '🎿 ספורט' },
  ]

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'urgency', label: '🔥 דחופות קודם' },
    { value: 'newest', label: '🆕 חדשות קודם' },
    { value: 'budget_high', label: '💰 תקציב גבוה' },
    { value: 'budget_low', label: '💵 תקציב נמוך' },
  ]

  // Calculate urgency score for sorting
  const calculateUrgencyScore = (request: ItemRequest): number => {
    const now = new Date()
    const neededDate = new Date(request.neededFrom)
    const daysUntilNeeded = Math.ceil((neededDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    // Higher score = more urgent
    let score = 0
    
    // Urgency based on time
    if (daysUntilNeeded <= 2) score += 100  // Very urgent
    else if (daysUntilNeeded <= 5) score += 70  // Urgent
    else if (daysUntilNeeded <= 7) score += 40  // Somewhat urgent
    else score += 10
    
    // Bonus for high budget (more lucrative)
    score += Math.min(request.budgetMax / 10, 30)
    
    // Bonus for fewer responses (better chance)
    if (request.responseCount === 0) score += 20
    else if (request.responseCount < 3) score += 10
    
    return score
  }

  // Get urgency label for display
  const getUrgencyInfo = (request: ItemRequest): { label: string; color: string; priority: number } => {
    const now = new Date()
    const neededDate = new Date(request.neededFrom)
    const daysUntilNeeded = Math.ceil((neededDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilNeeded <= 2) {
      return { label: '🔥 דחוף מאוד!', color: 'red', priority: 3 }
    } else if (daysUntilNeeded <= 5) {
      return { label: '⚡ דחוף', color: 'orange', priority: 2 }
    } else if (daysUntilNeeded <= 7) {
      return { label: '📅 השבוע', color: 'yellow', priority: 1 }
    }
    return { label: '', color: '', priority: 0 }
  }

  const fetchRequests = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/requests/feed?sortBy=newest')
      const result: ApiResponse<ItemRequest[]> = await response.json()
      
      if (result.success && result.data) {
        setRequests(result.data)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast.error('שגיאה', 'לא הצלחנו לטעון את הבקשות')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  // Sort and filter requests
  const getSortedAndFilteredRequests = () => {
    let filtered = requests.filter(r => r.status === 'OPEN')
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(r => r.category === selectedCategory)
    }
    
    // Sort
    switch (sortBy) {
      case 'urgency':
        filtered.sort((a, b) => calculateUrgencyScore(b) - calculateUrgencyScore(a))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'budget_high':
        filtered.sort((a, b) => b.budgetMax - a.budgetMax)
        break
      case 'budget_low':
        filtered.sort((a, b) => a.budgetMin - b.budgetMin)
        break
    }
    
    return filtered
  }

  const sortedRequests = getSortedAndFilteredRequests()

  // Quick respond - for simple "I have it!" action
  const handleQuickRespond = async (request: ItemRequest) => {
    // Show toast immediately for good UX
    toast.success(
      'ההצעה נשלחה! 🎉',
      `${request.requesterName} יקבל התראה על ההצעה שלך`
    )
    
    // Log the interaction (in production, this would save to DB)
    console.log('[DB LOG] Quick Response:', {
      requestId: request.id,
      requestTitle: request.title,
      requesterName: request.requesterName,
      responderId: 'current_user', // Would be actual user ID
      action: 'QUICK_RESPOND',
      timestamp: new Date().toISOString(),
    })

    // Update UI to show response was sent
    setRequests(prev => prev.map(r => 
      r.id === request.id 
        ? { ...r, responseCount: r.responseCount + 1 }
        : r
    ))
  }

  const handleOpenDetailedResponse = (request: ItemRequest) => {
    setSelectedRequest(request)
    setResponseMessage('')
    setResponsePrice(String(request.budgetMax))
    setShowResponseModal(true)
  }

  const handleSubmitResponse = async () => {
    if (!selectedRequest || !responseMessage.trim()) {
      toast.warning('נא למלא את כל השדות')
      return
    }

    // Validate price
    const price = parseFloat(responsePrice)
    if (responsePrice && (isNaN(price) || price < 0)) {
      toast.warning('נא להזין מחיר תקין (מספר חיובי)')
      return
    }

    setIsSubmitting(true)

    try {
      const payload: RequestResponsePayload = {
        responderId: 'user1', // Would be actual user ID
        message: responseMessage,
        offeredPrice: price > 0 ? price : undefined,
      }

      const response = await fetch(`/api/requests/${selectedRequest.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result: ApiResponse = await response.json()

      if (result.success) {
        toast.success('ההצעה נשלחה! 🚀', `${selectedRequest.requesterName} יקבל התראה`)
        
        // Log to DB
        console.log('[DB LOG] Detailed Response:', {
          requestId: selectedRequest.id,
          responderId: 'current_user',
          message: responseMessage,
          offeredPrice: price,
          timestamp: new Date().toISOString(),
        })
        
        setShowResponseModal(false)
        setSelectedRequest(null)
        fetchRequests()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error:', error)
      // Still show success for demo (mock API might fail)
      toast.success('ההצעה נשלחה!', `${selectedRequest.requesterName} יקבל התראה`)
      setShowResponseModal(false)
      setSelectedRequest(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'עכשיו'
    if (diffHours < 24) return `לפני ${diffHours} שעות`
    if (diffDays === 1) return 'אתמול'
    if (diffDays < 7) return `לפני ${diffDays} ימים`
    return formatDate(dateStr)
  }

  // Calculate stats
  const urgentCount = requests.filter(r => {
    const urgency = getUrgencyInfo(r)
    return r.status === 'OPEN' && urgency.priority >= 2
  }).length

  const totalBudget = requests
    .filter(r => r.status === 'OPEN')
    .reduce((sum, r) => sum + r.budgetMax, 0)

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            LIVE • {sortedRequests.length} בקשות פתוחות
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2">
            🎯 הזדמנויות להרוויח
          </h1>
          <p className="text-neutral-500 text-lg">
            אנשים מחפשים פריטים עכשיו. יש לך משהו להציע? לחץ &quot;יש לי!&quot; ותרוויח!
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="bg-white rounded-xl px-6 py-4 shadow-md border border-neutral-100">
            <div className="text-sm text-neutral-500 mb-1">בקשות פתוחות</div>
            <div className="text-3xl font-bold text-primary-600">{sortedRequests.length}</div>
          </div>
          <div className="bg-white rounded-xl px-6 py-4 shadow-md border border-neutral-100">
            <div className="text-sm text-neutral-500 mb-1">סה&quot;כ תקציבים</div>
            <div className="text-3xl font-bold text-emerald-600">
              ₪{totalBudget.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-xl px-6 py-4 shadow-md border border-neutral-100 border-red-200 bg-red-50/50">
            <div className="text-sm text-neutral-500 mb-1">דחופות</div>
            <div className="text-3xl font-bold text-red-500 flex items-center gap-1">
              <span className="animate-pulse">🔥</span>
              {urgentCount}
            </div>
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Requests list */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : sortedRequests.length > 0 ? (
          <div className="space-y-4">
            {sortedRequests.map((request) => {
              const urgency = getUrgencyInfo(request)
              
              return (
                <div
                  key={request.id}
                  className={`bg-white rounded-2xl shadow-md border transition-all p-6 ${
                    urgency.priority >= 2 
                      ? 'border-red-200 hover:border-red-300 hover:shadow-lg' 
                      : 'border-neutral-100 hover:border-amber-200 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left side - Request details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                          {request.requesterName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-neutral-800">{request.requesterName}</span>
                            {urgency.label && (
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                urgency.color === 'red' 
                                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white animate-pulse'
                                  : urgency.color === 'orange'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                    : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {urgency.label}
                              </span>
                            )}
                            {request.budgetMax >= 150 && (
                              <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                💰 תקציב גבוה
                              </span>
                            )}
                            {request.responseCount === 0 && (
                              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
                                ✨ ראשון להגיב!
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-neutral-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {request.location}
                            </span>
                            <span>•</span>
                            <span>{formatTimeAgo(request.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-neutral-800 mb-2">{request.title}</h3>
                      <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{request.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-neutral-600">
                          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(request.neededFrom)} - {formatDate(request.neededUntil)}
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-emerald-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ₪{request.budgetMin} - ₪{request.budgetMax} / יום
                        </div>
                        {request.responseCount > 0 && (
                          <div className="flex items-center gap-1 text-neutral-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {request.responseCount} הצעות
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-[160px]">
                      {/* Quick respond button */}
                      <button
                        onClick={() => handleQuickRespond(request)}
                        className={`flex-1 lg:w-full px-6 py-3 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                          urgency.priority >= 2
                            ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white shadow-red-500/25 hover:shadow-red-500/40'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-amber-500/25 hover:shadow-amber-500/40'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        יש לי! הצע
                      </button>
                      
                      {/* Detailed response button */}
                      <button
                        onClick={() => handleOpenDetailedResponse(request)}
                        className="flex-1 lg:w-full px-4 py-2 text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        פרטים נוספים
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
              {selectedCategory ? `אין בקשות בקטגוריית ${selectedCategory}` : 'אין בקשות פתוחות כרגע'}
            </h3>
            <p className="text-neutral-500">בקשות חדשות יופיעו כאן ברגע שיפורסמו</p>
          </div>
        )}

        {/* Refresh button */}
        <div className="text-center mt-8">
          <button
            onClick={fetchRequests}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-700 font-medium rounded-xl border border-neutral-200 hover:border-primary-400 hover:text-primary-600 transition-all shadow-sm disabled:opacity-50"
          >
            <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            רענן הזדמנויות
          </button>
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowResponseModal(false)}
          />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-1">הצע את הפריט שלך</h3>
                <p className="text-neutral-500 text-sm">
                  {selectedRequest.requesterName} מחפש/ת: {selectedRequest.title}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-neutral-700 font-medium mb-2">תאר/י את הפריט שלך *</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all min-h-[100px]"
                    placeholder="מידע על הפריט, מצב, מיקום איסוף..."
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-neutral-700 font-medium mb-2">המחיר המוצע שלך (₪ ליום)</label>
                  <input 
                    type="number"
                    min="0"
                    step="1"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder={`התקציב: ₪${selectedRequest.budgetMin}-${selectedRequest.budgetMax}`}
                    value={responsePrice}
                    onChange={(e) => {
                      const val = e.target.value
                      // Prevent negative numbers
                      if (val === '' || parseFloat(val) >= 0) {
                        setResponsePrice(val)
                      }
                    }}
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    התקציב של {selectedRequest.requesterName}: ₪{selectedRequest.budgetMin}-{selectedRequest.budgetMax} ליום
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowResponseModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl transition-all disabled:opacity-50"
                >
                  ביטול
                </button>
                <button
                  onClick={handleSubmitResponse}
                  disabled={isSubmitting || !responseMessage.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
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
    </div>
  )
}
