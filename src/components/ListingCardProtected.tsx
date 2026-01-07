'use client'

import Image from 'next/image'
import { useAuthModal } from '@/hooks/useAuthModal'
import { useRouter } from 'next/navigation'

export interface ListingCardProtectedProps {
  id: string
  title: string
  description: string
  pricePerDay: number
  location: string
  imageUrl?: string
  category?: string
  ownerName?: string
}

export default function ListingCardProtected({
  id,
  title,
  description,
  pricePerDay,
  location,
  imageUrl,
  category,
  ownerName,
}: ListingCardProtectedProps) {
  const router = useRouter()
  const { isAuthenticated, showAuthModal } = useAuthModal()

  const handleClick = () => {
    if (isAuthenticated) {
      router.push(`/listing/${id}`)
    } else {
      showAuthModal(
        'view_listing',
        'צפייה בפרטי הפריט',
        'עליכם להירשם כדי לצפות בפרטי המשכיר וליצור איתו קשר'
      )
    }
  }

  return (
    <article 
      onClick={handleClick}
      className="card group cursor-pointer"
    >
      {/* תמונה */}
      <div className="relative h-48 bg-neutral-200 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
            <svg 
              className="w-16 h-16 text-neutral-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
          </div>
        )}
        
        {/* תגית קטגוריה */}
        {category && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-neutral-700 text-xs font-medium px-3 py-1 rounded-full">
            {category}
          </span>
        )}

        {/* Lock indicator for guests */}
        {!isAuthenticated && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm font-medium text-neutral-700">הרשמו לצפייה</span>
            </div>
          </div>
        )}
      </div>

      {/* תוכן */}
      <div className="p-4">
        {/* כותרת */}
        <h3 className="font-semibold text-lg text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
          {title}
        </h3>
        
        {/* תיאור */}
        <p className="text-neutral-500 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        {/* מיקום ובעלים */}
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          <span>{location}</span>
          {ownerName && (
            <>
              <span className="text-neutral-300">•</span>
              <span>{isAuthenticated ? ownerName : '***'}</span>
            </>
          )}
        </div>

        {/* מחיר */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div>
            <span className="text-2xl font-bold text-primary-600">₪{pricePerDay}</span>
            <span className="text-neutral-500 text-sm mr-1">/ ליום</span>
          </div>
          <span className="text-primary-600 text-sm font-medium group-hover:underline">
            {isAuthenticated ? 'לפרטים נוספים ←' : 'הרשמו לצפייה ←'}
          </span>
        </div>
      </div>
    </article>
  )
}

