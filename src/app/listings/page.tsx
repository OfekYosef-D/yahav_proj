'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import ListingCard from '@/components/ListingCard'
import { Listing, ApiResponse } from '@/types'

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest'

function ListingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Read initial values from URL
  const initialQuery = searchParams.get('q') || ''
  const initialLocation = searchParams.get('location') || ''
  const initialCategory = searchParams.get('category') || ''
  const initialSort = (searchParams.get('sort') as SortOption) || 'relevance'

  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [searchLocation, setSearchLocation] = useState(initialLocation)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState<SortOption>(initialSort)

  const categories = [
    { id: '', label: 'הכל', icon: '🏷️' },
    { id: 'מזוודות', label: 'מזוודות', icon: '🧳' },
    { id: 'תיקים', label: 'תיקים', icon: '👜' },
    { id: 'ציוד צילום', label: 'ציוד צילום', icon: '📷' },
    { id: 'ציוד ספורט', label: 'ציוד ספורט', icon: '🎿' },
    { id: 'אלקטרוניקה', label: 'אלקטרוניקה', icon: '💻' },
  ]

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'relevance', label: 'רלוונטיות' },
    { value: 'price_asc', label: 'מחיר: מהנמוך לגבוה' },
    { value: 'price_desc', label: 'מחיר: מהגבוה לנמוך' },
    { value: 'rating', label: 'דירוג גבוה' },
    { value: 'newest', label: 'חדש ביותר' },
  ]

  // Update URL with current filters
  const updateURL = useCallback((params: {
    q?: string
    location?: string
    category?: string
    sort?: SortOption
  }) => {
    const newParams = new URLSearchParams(searchParams.toString())
    
    // Update or remove each param
    if (params.q !== undefined) {
      if (params.q) newParams.set('q', params.q)
      else newParams.delete('q')
    }
    if (params.location !== undefined) {
      if (params.location) newParams.set('location', params.location)
      else newParams.delete('location')
    }
    if (params.category !== undefined) {
      if (params.category) newParams.set('category', params.category)
      else newParams.delete('category')
    }
    if (params.sort !== undefined) {
      if (params.sort && params.sort !== 'relevance') newParams.set('sort', params.sort)
      else newParams.delete('sort')
    }

    const queryString = newParams.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }, [searchParams, router, pathname])

  // Fetch listings from API
  const fetchListings = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (searchLocation) params.set('location', searchLocation)
      if (selectedCategory) params.set('category', selectedCategory)

      const response = await fetch(`/api/listings?${params.toString()}`)
      const result: ApiResponse<Listing[]> = await response.json()

      if (result.success && result.data) {
        // Sort the results client-side
        let sortedData = [...result.data]
        
        switch (sortBy) {
          case 'price_asc':
            sortedData.sort((a, b) => a.pricePerDay - b.pricePerDay)
            break
          case 'price_desc':
            sortedData.sort((a, b) => b.pricePerDay - a.pricePerDay)
            break
          case 'rating':
            sortedData.sort((a, b) => (b.rating || 0) - (a.rating || 0))
            break
          case 'newest':
            sortedData.sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
              return dateB - dateA
            })
            break
          case 'relevance':
          default:
            // Keep original order (relevance based on search match)
            break
        }
        
        setListings(sortedData)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, searchLocation, selectedCategory, sortBy])

  // Fetch on initial load and when dependencies change
  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL({ q: searchQuery, location: searchLocation })
  }

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    updateURL({ category: categoryId })
  }

  // Handle sort change
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    updateURL({ sort: newSort })
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSearchLocation('')
    setSelectedCategory('')
    setSortBy('relevance')
    router.push(pathname)
  }

  // Check if any filters are active
  const hasActiveFilters = searchQuery || searchLocation || selectedCategory

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2">
            כל הפריטים להשכרה
          </h1>
          <p className="text-neutral-500">
            מצאו את הפריט המושלם להשכרה באזור שלכם
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            {/* Search input */}
            <div className="flex-1 relative">
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חפש פריטים... (מצלמה, מזוודה, תיק)"
                className="w-full py-3 pr-12 pl-4 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Location input */}
            <div className="flex-1 relative">
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="מיקום (תל אביב, חיפה...)"
                className="w-full py-3 pr-12 pl-4 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              חפש
            </button>
          </form>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results header with count and sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-neutral-500">
              נמצאו <span className="font-semibold text-neutral-800">{listings.length}</span> פריטים
              {searchQuery && <span> עבור &quot;{searchQuery}&quot;</span>}
              {searchLocation && <span> ב{searchLocation}</span>}
              {selectedCategory && <span> בקטגוריית {selectedCategory}</span>}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-1 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                נקה מסננים
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-neutral-500">מיין לפי:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Listings grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                description={listing.description}
                pricePerDay={listing.pricePerDay}
                location={listing.location}
                imageUrl={listing.imageUrl || listing.images?.[0]}
                category={listing.category}
                ownerName={listing.ownerName}
                rating={listing.rating}
                reviewCount={listing.reviewCount}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">לא נמצאו פריטים</h3>
            <p className="text-neutral-500 mb-6">נסו לשנות את מילות החיפוש או להסיר מסננים</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
            >
              נקה חיפוש
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    }>
      <ListingsContent />
    </Suspense>
  )
}
