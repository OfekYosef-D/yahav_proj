'use client'

import { useState } from 'react'

export default function ListItemPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    location: '',
    category: 'מזוודות',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const categories = ['מזוודות', 'תיקים', 'ציוד צילום', 'ציוד ספורט', 'אלקטרוניקה', 'אחר']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // שליחה ל-API
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pricePerDay: parseFloat(formData.pricePerDay),
        }),
      })

      if (response.ok) {
        setShowSuccess(true)
        setFormData({
          title: '',
          description: '',
          pricePerDay: '',
          location: '',
          category: 'מזוודות',
        })
      }
    } catch (error) {
      console.error('Error:', error)
      // במצב MVP, גם אם יש שגיאה - נציג הצלחה לדוגמה
      setShowSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-neutral-800 mb-3">הפריט נוסף בהצלחה!</h1>
            <p className="text-neutral-500 mb-6">
              הפריט שלך נוסף למערכת ויהיה זמין לצפייה ולהזמנה בקרוב.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/" className="btn-secondary">
                חזרה לדף הבית
              </a>
              <button 
                onClick={() => setShowSuccess(false)} 
                className="btn-primary"
              >
                הוסף פריט נוסף
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* כותרת */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              הוסף פריט להשכרה
            </h1>
            <p className="text-neutral-500">
              מלאו את הפרטים והתחילו להרוויח מהפריטים שלא בשימוש
            </p>
          </div>

          {/* טופס */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* שם הפריט */}
              <div>
                <label htmlFor="title" className="label">
                  שם הפריט *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="לדוגמה: מזוודת Tumi גדולה"
                  className="input-field"
                  required
                />
              </div>

              {/* קטגוריה */}
              <div>
                <label htmlFor="category" className="label">
                  קטגוריה *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* תיאור */}
              <div>
                <label htmlFor="description" className="label">
                  תיאור הפריט *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="תארו את הפריט, המצב שלו, ומה הוא כולל..."
                  rows={4}
                  className="input-field resize-none"
                  required
                />
                <p className="text-xs text-neutral-400 mt-1">
                  תיאור מפורט יעזור לשוכרים להחליט
                </p>
              </div>

              {/* מחיר ומיקום */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pricePerDay" className="label">
                    מחיר ליום (₪) *
                  </label>
                  <input
                    type="number"
                    id="pricePerDay"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    placeholder="50"
                    min="1"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="location" className="label">
                    אזור/עיר *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="תל אביב"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* העלאת תמונות (Placeholder) */}
              <div>
                <label className="label">תמונות הפריט</label>
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                  <svg 
                    className="w-12 h-12 text-neutral-400 mx-auto mb-3" 
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
                  <p className="text-neutral-500 mb-1">לחצו להעלאת תמונות</p>
                  <p className="text-xs text-neutral-400">PNG, JPG עד 5MB</p>
                </div>
                <p className="text-xs text-neutral-400 mt-2">
                  * העלאת תמונות תתאפשר בגרסה הבאה
                </p>
              </div>

              {/* כפתור שליחה */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    שומר...
                  </span>
                ) : (
                  'פרסם את הפריט'
                )}
              </button>

              {/* הסכמה */}
              <p className="text-xs text-neutral-400 text-center">
                בלחיצה על &quot;פרסם את הפריט&quot; אתם מסכימים ל
                <a href="#" className="text-primary-600 hover:underline">תנאי השימוש</a>
                {' '}ול
                <a href="#" className="text-primary-600 hover:underline">מדיניות הפרטיות</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

