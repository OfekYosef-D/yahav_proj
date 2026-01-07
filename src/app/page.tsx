import SearchBar from '@/components/SearchBar'
import ListingCard from '@/components/ListingCard'
import OpportunityFeed from '@/components/OpportunityFeed'
import { mockListings } from '@/lib/mock-data'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-bl from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        {/* רקע דקורטיבי מעודן */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-300/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center md:text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90">+1,200 עסקאות מוצלחות החודש</span>
            </div>

            {/* כותרת ראשית */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              השכירו וחסכו.
              <br />
              <span className="bg-gradient-to-l from-amber-300 to-orange-400 bg-clip-text text-transparent">פריטי פרימיום</span> בלחיצה.
            </h1>
            
            {/* תיאור משנה */}
            <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto md:mx-0 md:mr-0 leading-relaxed">
              פלטפורמת ההשכרות החברתית הראשונה בישראל.
              <br className="hidden md:block" />
              מזוודות יוקרה, ציוד צילום ורחפנים — ישירות מהשכנים שלכם.
            </p>
            
            {/* שורת חיפוש */}
            <SearchBar className="max-w-3xl mx-auto md:mx-0" />

            {/* סטטיסטיקות */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 pt-8 border-t border-white/10 max-w-xl mx-auto md:mx-0">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1">98%</div>
                <div className="text-primary-200 text-xs md:text-sm">שביעות רצון</div>
              </div>
              <div className="text-center border-x border-white/10">
                <div className="text-2xl md:text-3xl font-bold mb-1">1,200+</div>
                <div className="text-primary-200 text-xs md:text-sm">עסקאות מוצלחות</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1">500+</div>
                <div className="text-primary-200 text-xs md:text-sm">פריטים זמינים</div>
              </div>
            </div>
          </div>
        </div>

        {/* גל תחתון */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg 
            viewBox="0 0 1440 80" 
            className="w-full h-auto fill-neutral-50"
            preserveAspectRatio="none"
          >
            <path d="M0,40L80,45C160,50,320,60,480,55C640,50,800,30,960,25C1120,20,1280,30,1360,35L1440,40L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z" />
          </svg>
        </div>
      </section>

      {/* קטגוריות פופולריות */}
      <section className="py-8 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { name: 'מזוודות', icon: '🧳' },
              { name: 'תיקים', icon: '👜' },
              { name: 'ציוד צילום', icon: '📷' },
              { name: 'ציוד ספורט', icon: '🎿' },
              { name: 'אלקטרוניקה', icon: '💻' },
            ].map((category) => (
              <button
                key={category.name}
                className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-neutral-700 font-medium shadow-sm hover:shadow-md hover:text-primary-600 hover:border-primary-200 transition-all border border-neutral-100"
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* פריטים מומלצים */}
      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* כותרת סקשן */}
          <div className="flex items-center justify-between mb-10">
            <div className="text-right">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-1">
                פריטים פופולריים
              </h2>
              <p className="text-neutral-500">
                הפריטים הכי מבוקשים השבוע
              </p>
            </div>
            <a 
              href="/listings" 
              className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors bg-primary-50 px-4 py-2 rounded-lg"
            >
              הצג הכל
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* גריד כרטיסים */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {mockListings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                description={listing.description}
                pricePerDay={listing.pricePerDay}
                location={listing.location}
                imageUrl={listing.imageUrl}
                category={listing.category}
                ownerName={listing.ownerName}
                rating={listing.rating}
                reviewCount={listing.reviewCount}
              />
            ))}
          </div>

          {/* כפתור הצג הכל (מובייל) */}
          <div className="mt-8 text-center md:hidden">
            <a 
              href="/listings" 
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
            >
              הצג את כל הפריטים
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* 🎯 Opportunity Feed - Live requests from users */}
      <OpportunityFeed />

      {/* איך זה עובד */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-3">
              איך זה עובד?
            </h2>
            <p className="text-neutral-500 max-w-md mx-auto">
              השכרה קלה ובטוחה ב-3 צעדים פשוטים
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* צעד 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary-100 transition-colors relative">
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <svg className="w-9 h-9 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-800 mb-2">חפשו פריט</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                מצאו את הפריט המושלם לטיסה שלכם מתוך מגוון אפשרויות באזור
              </p>
            </div>

            {/* צעד 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-orange-100 transition-colors relative">
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <svg className="w-9 h-9 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-800 mb-2">בחרו תאריכים</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                הזמינו לתאריכי הטיסה שלכם ותאמו איסוף עם המשכיר
              </p>
            </div>

            {/* צעד 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary-100 transition-colors relative">
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <svg className="w-9 h-9 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-800 mb-2">טסו בסטייל!</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                תהנו מציוד פרימיום ללא צורך לקנות, ובסיום — החזירו
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - קריאה לפעולה */}
      <section className="py-16 md:py-20 bg-neutral-800 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="text-amber-400">💰</span>
            <span className="text-sm font-medium text-white/90">הרוויחו עד ₪2,000 בחודש</span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            יש לכם פריטים שלא בשימוש?
          </h2>
          <p className="text-neutral-300 mb-8 max-w-xl mx-auto leading-relaxed">
            הפכו את המזוודות והתיקים שיושבים בארון לרווח. 
            הצטרפו לקהילת המשכירים שלנו והרוויחו בקלות.
          </p>
          <a 
            href="/list-item" 
            className="inline-flex items-center gap-2 bg-gradient-to-l from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            התחילו להשכיר עכשיו
          </a>
        </div>
      </section>
    </div>
  )
}
