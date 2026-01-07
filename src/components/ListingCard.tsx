import Link from 'next/link'
import Image from 'next/image'

// Shimmer blur placeholder for smooth image loading
const shimmerBlur = `data:image/svg+xml;base64,${Buffer.from(
  `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f5f5f5"/>
        <stop offset="50%" stop-color="#e5e5e5"/>
        <stop offset="100%" stop-color="#f5f5f5"/>
      </linearGradient>
    </defs>
    <rect fill="url(#shimmer)" width="100%" height="100%"/>
  </svg>`
).toString('base64')}`

export interface ListingCardProps {
  id: string
  title: string
  description: string
  pricePerDay: number
  location: string
  imageUrl?: string
  category?: string
  ownerName?: string
  rating?: number
  reviewCount?: number
  blurDataURL?: string
}

export default function ListingCard({
  id,
  title,
  description,
  pricePerDay,
  location,
  imageUrl,
  category,
  ownerName,
  rating = 4.8,
  reviewCount = 0,
  blurDataURL,
}: ListingCardProps) {
  return (
    <Link href={`/listing/${id}`} className="block group">
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 hover:border-primary-100">
        {/* תמונה */}
        <div className="relative h-52 bg-neutral-100 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={blurDataURL || shimmerBlur}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
              <svg 
                className="w-16 h-16 text-neutral-300" 
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
            </div>
          )}
          
          {/* תגית קטגוריה */}
          {category && (
            <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-neutral-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              {category}
            </span>
          )}

          {/* Badge פרימיום */}
          <div className="absolute top-3 left-3 bg-gradient-to-l from-primary-600 to-primary-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
            PREMIUM
          </div>
        </div>

        {/* תוכן */}
        <div className="p-5">
          {/* כותרת */}
          <h3 className="font-bold text-lg text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1 text-right">
            {title}
          </h3>
          
          {/* תיאור */}
          <p className="text-neutral-500 text-sm mb-4 line-clamp-2 text-right leading-relaxed">
            {description}
          </p>

          {/* מיקום ודירוג */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-sm">
              <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold text-neutral-700">{rating}</span>
              {reviewCount > 0 && (
                <span className="text-neutral-400">({reviewCount})</span>
              )}
            </div>
            
            <div className="flex items-center gap-1.5 text-sm text-neutral-500">
              <svg 
                className="w-4 h-4 text-neutral-400" 
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
            </div>
          </div>

          {/* קו מפריד */}
          <div className="border-t border-neutral-100 pt-4">
            <div className="flex items-center justify-between">
              {/* מחיר */}
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary-600">₪{pricePerDay}</span>
                  <span className="text-neutral-400 text-sm">/ ליום</span>
                </div>
                {ownerName && (
                  <p className="text-xs text-neutral-400 mt-0.5">
                    מאת {ownerName}
                  </p>
                )}
              </div>

              {/* כפתור CTA */}
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 group-hover:scale-105">
                השכר עכשיו
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
