'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export default function SearchBar({ 
  placeholder = 'חפש מזוודות, תיקים ועוד...', 
  className = '' 
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (location) params.set('location', location)
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className={`w-full ${className}`}>
      <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-col md:flex-row gap-2">
        {/* שדה חיפוש */}
        <div className="flex-1 relative">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full py-3 pr-12 pl-4 bg-transparent border-none focus:outline-none text-neutral-700 placeholder:text-neutral-400"
          />
        </div>

        {/* מפריד */}
        <div className="hidden md:block w-px bg-neutral-200" />

        {/* שדה מיקום */}
        <div className="flex-1 relative">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg 
              className="w-5 h-5" 
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
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="באיזה אזור?"
            className="w-full py-3 pr-12 pl-4 bg-transparent border-none focus:outline-none text-neutral-700 placeholder:text-neutral-400"
          />
        </div>

        {/* כפתור חיפוש */}
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 md:px-8 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          <span className="hidden sm:inline">חפש</span>
        </button>
      </div>
    </form>
  )
}

