import Link from 'next/link'

export interface RequestCardProps {
  id: string
  title: string
  description: string
  category: string
  budgetMin: number
  budgetMax: number
  neededFrom: string
  neededUntil: string
  location: string
  status: 'OPEN' | 'FULFILLED' | 'EXPIRED' | 'CANCELLED'
  viewCount: number
  responseCount: number
  requesterName: string
  createdAt: string
  // שדות מועשרים (אופציונלי)
  daysUntilNeeded?: number
  rentalDuration?: number
  urgencyLabel?: { text: string; color: string }
  potentialEarnings?: number
}

export default function RequestCard({
  id,
  title,
  description,
  category,
  budgetMin,
  budgetMax,
  neededFrom,
  neededUntil,
  location,
  status,
  viewCount,
  responseCount,
  requesterName,
  createdAt,
  daysUntilNeeded,
  rentalDuration,
  urgencyLabel,
  potentialEarnings,
}: RequestCardProps) {
  // פורמט תאריכים
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'short',
    })
  }

  // חישוב ימים אם לא מסופק
  const days = daysUntilNeeded ?? Math.ceil(
    (new Date(neededFrom).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  // צבע לפי דחיפות
  const getUrgencyColor = () => {
    if (urgencyLabel) return urgencyLabel.color
    if (days <= 2) return 'red'
    if (days <= 5) return 'orange'
    if (days <= 7) return 'yellow'
    return 'green'
  }

  const urgencyColors: Record<string, string> = {
    red: 'bg-red-100 text-red-700 border-red-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    green: 'bg-green-100 text-green-700 border-green-200',
  }

  return (
    <Link href={`/requests/${id}`} className="block">
      <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-neutral-100 group">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              {/* תגיות */}
              <div className="flex flex-wrap gap-2 mb-2">
                {/* קטגוריה */}
                <span className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded-full">
                  {category}
                </span>
                
                {/* דחיפות */}
                <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full border ${urgencyColors[getUrgencyColor()]}`}>
                  {urgencyLabel?.text || (days <= 2 ? 'דחוף! 🔥' : days <= 5 ? 'בקרוב' : 'לא דחוף')}
                </span>

                {/* סטטוס */}
                {status !== 'OPEN' && (
                  <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                    status === 'FULFILLED' ? 'bg-green-100 text-green-700' :
                    status === 'EXPIRED' ? 'bg-neutral-100 text-neutral-500' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {status === 'FULFILLED' ? 'נמצא ✓' : 
                     status === 'EXPIRED' ? 'פג תוקף' : 'בוטל'}
                  </span>
                )}
              </div>

              {/* כותרת */}
              <h3 className="font-bold text-lg text-neutral-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                {title}
              </h3>
            </div>

            {/* תקציב */}
            <div className="text-left flex-shrink-0">
              <div className="text-xs text-neutral-500 mb-1">תקציב ליום</div>
              <div className="text-lg font-bold text-secondary-600">
                ₪{budgetMin}-{budgetMax}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* תיאור */}
          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>

          {/* פרטים */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* מיקום */}
            <div className="flex items-center gap-2 text-neutral-500">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{location}</span>
            </div>

            {/* תאריכים */}
            <div className="flex items-center gap-2 text-neutral-500">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(neededFrom)} - {formatDate(neededUntil)}</span>
            </div>

            {/* משך */}
            <div className="flex items-center gap-2 text-neutral-500">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{rentalDuration || Math.ceil((new Date(neededUntil).getTime() - new Date(neededFrom).getTime()) / (1000 * 60 * 60 * 24))} ימים</span>
            </div>

            {/* מבקש */}
            <div className="flex items-center gap-2 text-neutral-500">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{requesterName}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
          {/* סטטיסטיקות */}
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {viewCount} צפיות
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {responseCount} הצעות
            </span>
          </div>

          {/* פוטנציאל רווח */}
          {potentialEarnings && status === 'OPEN' && (
            <div className="text-left">
              <span className="text-xs text-neutral-500">פוטנציאל: </span>
              <span className="text-sm font-bold text-secondary-600">₪{potentialEarnings}</span>
            </div>
          )}

          {/* CTA */}
          {status === 'OPEN' && (
            <span className="text-primary-600 text-sm font-medium group-hover:underline">
              הצע פריט ←
            </span>
          )}
        </div>
      </article>
    </Link>
  )
}

