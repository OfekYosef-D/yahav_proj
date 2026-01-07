import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 bg-gradient-to-b from-neutral-50 to-white" dir="rtl">
      <div className="text-center max-w-lg mx-auto">
        {/* 404 Header with Brand Styling */}
        <div className="relative mb-8">
          {/* Decorative background circles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 bg-primary-100 rounded-full opacity-40 blur-xl" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-52 h-52 bg-primary-200 rounded-full opacity-25 blur-lg" />
          </div>
          
          {/* Main 404 Text */}
          <div className="relative">
            <h1 className="text-[140px] md:text-[180px] font-black text-primary-600 leading-none select-none tracking-tight">
              404
            </h1>
            
            {/* Floating Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center animate-float border border-neutral-100">
                {/* Map Pin Off Icon */}
                <svg 
                  className="w-10 h-10 md:w-12 md:h-12 text-primary-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" 
                  />
                  {/* X mark to indicate "not found" */}
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" 
                    className="text-red-400"
                    stroke="#F87171"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Message - RTL Hebrew */}
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-3">
          אופס! נראה שהלכתם לאיבוד
        </h2>
        <p className="text-neutral-500 mb-8 leading-relaxed text-base md:text-lg">
          העמוד שחיפשתם לא קיים או שהוסר.
          <br />
          <span className="text-neutral-400">אל דאגה, אפשר לחזור הביתה בקלות!</span>
        </p>

        {/* Primary Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary-600/30 hover:shadow-primary-600/40 hover:scale-[1.02] min-w-[200px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            חזרה לדף הבית
          </Link>
          
          <Link
            href="/listings"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-700 px-6 py-4 rounded-xl font-semibold transition-all border-2 border-neutral-200 hover:border-primary-300 hover:text-primary-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            עיין בפריטים
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-400 mb-4">אולי חיפשתם:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link 
              href="/listings" 
              className="px-4 py-2 bg-neutral-100 hover:bg-primary-100 hover:text-primary-600 text-neutral-600 rounded-full text-sm font-medium transition-colors"
            >
              📦 כל הפריטים
            </Link>
            <Link 
              href="/requests" 
              className="px-4 py-2 bg-neutral-100 hover:bg-orange-100 hover:text-orange-600 text-neutral-600 rounded-full text-sm font-medium transition-colors"
            >
              🎯 הזדמנויות
            </Link>
            <Link 
              href="/how-it-works" 
              className="px-4 py-2 bg-neutral-100 hover:bg-primary-100 hover:text-primary-600 text-neutral-600 rounded-full text-sm font-medium transition-colors"
            >
              ❓ איך זה עובד
            </Link>
            <Link 
              href="/list-item" 
              className="px-4 py-2 bg-neutral-100 hover:bg-green-100 hover:text-green-600 text-neutral-600 rounded-full text-sm font-medium transition-colors"
            >
              ➕ השכר פריט
            </Link>
          </div>
        </div>

        {/* Fun footer */}
        <p className="text-xs text-neutral-300 mt-8">
          קוד שגיאה: 404 | העמוד לא נמצא
        </p>
      </div>
    </div>
  )
}
