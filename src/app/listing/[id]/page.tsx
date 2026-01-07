import { notFound } from 'next/navigation'
import { getListingById } from '@/lib/mock-data'
import BookingForm from '@/components/BookingForm'

interface ListingPageProps {
  params: { id: string }
}

export default function ListingPage({ params }: ListingPageProps) {
  const listing = getListingById(params.id)

  if (!listing) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-neutral-500 mb-6">
          <a href="/" className="hover:text-primary-600">דף הבית</a>
          <span className="mx-2">/</span>
          <a href="/listings" className="hover:text-primary-600">פריטים</a>
          <span className="mx-2">/</span>
          <span className="text-neutral-800">{listing.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* עמודה ימנית - פרטי הפריט */}
          <div className="lg:col-span-2">
            {/* גלריית תמונות */}
            <div className="bg-neutral-200 rounded-2xl h-80 md:h-96 flex items-center justify-center mb-6">
              <div className="text-center">
                <svg 
                  className="w-20 h-20 text-neutral-400 mx-auto mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <p className="text-neutral-500">תמונות יתווספו בקרוב</p>
              </div>
            </div>

            {/* פרטי הפריט */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              {/* קטגוריה */}
              <span className="inline-block bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                {listing.category}
              </span>

              {/* כותרת */}
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
                {listing.title}
              </h1>

              {/* מיקום */}
              <div className="flex items-center gap-2 text-neutral-500 mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{listing.location}</span>
              </div>

              {/* תיאור */}
              <div className="border-t border-neutral-100 pt-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-3">תיאור הפריט</h2>
                <p className="text-neutral-600 leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* פרטי המשכיר */}
              <div className="border-t border-neutral-100 pt-6 mt-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">על המשכיר</h2>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                    {listing.ownerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">{listing.ownerName}</p>
                    <p className="text-sm text-neutral-500">חבר מאז 2024</p>
                  </div>
                </div>
              </div>

              {/* מדיניות */}
              <div className="border-t border-neutral-100 pt-6 mt-6">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">מדיניות השכרה</h2>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-secondary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>איסוף והחזרה בתיאום מראש</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-secondary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>פיקדון בטחון יידרש</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-secondary-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>ביטול חינם עד 48 שעות מראש</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* עמודה שמאלית - טופס הזמנה */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm 
                listingId={listing.id}
                pricePerDay={listing.pricePerDay}
                title={listing.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

