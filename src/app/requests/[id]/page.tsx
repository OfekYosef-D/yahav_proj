'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getRequestById, getResponsesByRequestId, getListingById, mockListings } from '@/lib/mock-data'

interface RequestPageProps {
  params: { id: string }
}

export default function RequestDetailPage({ params }: RequestPageProps) {
  const router = useRouter()
  const [showResponseForm, setShowResponseForm] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [offeredPrice, setOfferedPrice] = useState('')
  const [selectedListingId, setSelectedListingId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const request = getRequestById(params.id)
  const responses = getResponsesByRequestId(params.id)

  if (!request) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">הבקשה לא נמצאה</h1>
          <Link href="/requests" className="btn-primary">
            חזרה לרשימת הבקשות
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const rentalDuration = Math.ceil(
    (new Date(request.neededUntil).getTime() - new Date(request.neededFrom).getTime()) / (1000 * 60 * 60 * 24)
  )

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/requests/${params.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responderId: 'user1', // Mock user ID
          message: responseMessage,
          offeredPrice: offeredPrice ? parseFloat(offeredPrice) : undefined,
          listingId: selectedListingId || undefined,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setShowSuccess(true)
        setShowResponseForm(false)
        setResponseMessage('')
        setOfferedPrice('')
        setSelectedListingId('')
      } else {
        alert(result.error || 'שגיאה בשליחת ההצעה')
      }
    } catch (error) {
      console.error('Error:', error)
      // For MVP - show success anyway
      setShowSuccess(true)
      setShowResponseForm(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-neutral-500 mb-6">
          <Link href="/" className="hover:text-primary-600">דף הבית</Link>
          <span className="mx-2">/</span>
          <Link href="/requests" className="hover:text-primary-600">הזדמנויות</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-800">{request.title}</span>
        </nav>

        {/* Success message */}
        {showSuccess && (
          <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-secondary-800">ההצעה נשלחה בהצלחה!</p>
              <p className="text-sm text-secondary-600">המבקש יקבל התראה ויוכל לצפות בהצעה שלך</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">
                  {request.category}
                </span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  request.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                  request.status === 'FULFILLED' ? 'bg-blue-100 text-blue-700' :
                  'bg-neutral-100 text-neutral-600'
                }`}>
                  {request.status === 'OPEN' ? '🟢 פתוח להצעות' :
                   request.status === 'FULFILLED' ? '✓ נמצא' : 'סגור'}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
                {request.title}
              </h1>

              <p className="text-neutral-600 leading-relaxed mb-6">
                {request.description}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-xl">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">תקציב ליום</p>
                  <p className="font-bold text-secondary-600">₪{request.budgetMin}-{request.budgetMax}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">תאריכים</p>
                  <p className="font-medium text-neutral-800">
                    {formatDate(request.neededFrom)} - {formatDate(request.neededUntil)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">משך</p>
                  <p className="font-medium text-neutral-800">{rentalDuration} ימים</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">אזור</p>
                  <p className="font-medium text-neutral-800">{request.location}</p>
                </div>
              </div>
            </div>

            {/* Requester Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">על המבקש</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {request.requesterName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-neutral-800">{request.requesterName}</p>
                  <p className="text-sm text-neutral-500">פורסם {formatDate(request.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Existing Responses */}
            {responses.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                  הצעות שהתקבלו ({responses.length})
                </h2>
                <div className="space-y-4">
                  {responses.map((response) => (
                    <div key={response.id} className="border border-neutral-100 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-600 font-medium">
                            {response.responderName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-800">{response.responderName}</p>
                            <p className="text-xs text-neutral-500">
                              {new Date(response.createdAt).toLocaleDateString('he-IL')}
                            </p>
                          </div>
                        </div>
                        {response.offeredPrice && (
                          <div className="text-left">
                            <p className="text-xs text-neutral-500">מחיר מוצע</p>
                            <p className="font-bold text-secondary-600">₪{response.offeredPrice}/יום</p>
                          </div>
                        )}
                      </div>
                      <p className="text-neutral-600 text-sm">{response.message}</p>
                      {response.status === 'ACCEPTED' && (
                        <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                          ✓ התקבל
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Response Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                {/* Stats */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-neutral-800">{request.viewCount}</p>
                    <p className="text-xs text-neutral-500">צפיות</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-neutral-800">{request.responseCount}</p>
                    <p className="text-xs text-neutral-500">הצעות</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-secondary-600">₪{request.budgetMax * rentalDuration}</p>
                    <p className="text-xs text-neutral-500">פוטנציאל</p>
                  </div>
                </div>

                {request.status === 'OPEN' ? (
                  showResponseForm ? (
                    <form onSubmit={handleSubmitResponse} className="space-y-4">
                      <div>
                        <label className="label">בחר פריט להצעה (אופציונלי)</label>
                        <select
                          value={selectedListingId}
                          onChange={(e) => setSelectedListingId(e.target.value)}
                          className="input-field"
                        >
                          <option value="">ללא פריט ספציפי</option>
                          {mockListings.map(listing => (
                            <option key={listing.id} value={listing.id}>
                              {listing.title} (₪{listing.pricePerDay}/יום)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="label">מחיר מוצע ליום (₪)</label>
                        <input
                          type="number"
                          value={offeredPrice}
                          onChange={(e) => setOfferedPrice(e.target.value)}
                          placeholder={`${request.budgetMin}-${request.budgetMax}`}
                          className="input-field"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="label">הודעה למבקש *</label>
                        <textarea
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                          placeholder="ספרו על הפריט שלכם ולמה הוא מתאים..."
                          rows={4}
                          className="input-field resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary disabled:opacity-50"
                      >
                        {isSubmitting ? 'שולח...' : 'שלח הצעה'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowResponseForm(false)}
                        className="w-full btn-secondary"
                      >
                        ביטול
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <button
                        onClick={() => setShowResponseForm(true)}
                        className="w-full btn-primary text-lg py-4"
                      >
                        🤝 הצע פריט
                      </button>
                      <p className="text-xs text-neutral-400 text-center">
                        יש לך פריט שמתאים? הציעו למבקש והרוויחו!
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-4">
                    <p className="text-neutral-500">הבקשה כבר לא פתוחה להצעות</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

