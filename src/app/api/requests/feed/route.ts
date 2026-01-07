import { NextRequest, NextResponse } from 'next/server'
import { 
  getOpenRequestsByLocation, 
  getOpenRequestsByLocations,
  getUserById,
  mockItemRequests,
  type MockItemRequest 
} from '@/lib/mock-data'

/**
 * API Route: פיד "הזדמנויות חמות" למשכירים
 * GET /api/requests/feed
 * 
 * מחזיר את כל הבקשות הפתוחות באזור המשכיר
 * 
 * Query Parameters:
 * - location: מיקום לחיפוש (חובה אם אין userId)
 * - userId: מזהה משתמש - ישלוף את כל האזורים שלו (אופציונלי)
 * - category: סינון לפי קטגוריה (אופציונלי)
 * - minBudget: סינון לפי תקציב מינימלי (אופציונלי)
 * - sortBy: מיון - newest/budget/urgency (ברירת מחדל: newest)
 * - limit: מספר תוצאות מקסימלי (ברירת מחדל: 20)
 * 
 * @returns רשימת בקשות פתוחות ("הזדמנויות חמות")
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const location = searchParams.get('location')
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')
    const minBudget = searchParams.get('minBudget')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const limit = parseInt(searchParams.get('limit') || '20')

    let requests: MockItemRequest[] = []

    // ============================================
    // שליפת בקשות לפי מיקום
    // ============================================

    if (userId) {
      // אם יש userId - שליפה לפי כל האזורים של המשתמש
      const user = getUserById(userId)
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'משתמש לא נמצא' },
          { status: 404 }
        )
      }

      // איחוד המיקום הראשי עם האזורים למנוי
      const allLocations = [user.location, ...user.subscribedLocations].filter(Boolean)
      
      if (allLocations.length === 0) {
        return NextResponse.json({
          success: true,
          data: [],
          meta: {
            total: 0,
            message: 'לא הוגדרו אזורים למשתמש',
          },
        })
      }

      requests = getOpenRequestsByLocations(allLocations)
      
    } else if (location) {
      // אם יש מיקום ספציפי
      requests = getOpenRequestsByLocation(location)
      
    } else {
      // אם אין מיקום ואין userId - החזר את כל הבקשות הפתוחות
      requests = mockItemRequests.filter(req => req.status === 'OPEN')
    }

    // ============================================
    // סינונים נוספים
    // ============================================

    // סינון לפי קטגוריה
    if (category) {
      requests = requests.filter(req => 
        req.category.toLowerCase() === category.toLowerCase()
      )
    }

    // סינון לפי תקציב מינימלי (למשכירים שרוצים הזדמנויות "משתלמות")
    if (minBudget) {
      const minBudgetNum = parseFloat(minBudget)
      requests = requests.filter(req => req.budgetMax >= minBudgetNum)
    }

    // ============================================
    // מיון התוצאות
    // ============================================

    requests = sortRequests(requests, sortBy)

    // ============================================
    // הגבלת מספר תוצאות
    // ============================================

    const totalBeforeLimit = requests.length
    requests = requests.slice(0, limit)

    // ============================================
    // העשרת הנתונים
    // ============================================

    const enrichedRequests = requests.map(req => ({
      ...req,
      // חישוב ימים עד לתחילת ההשכרה
      daysUntilNeeded: calculateDaysUntil(req.neededFrom),
      // חישוב משך ההשכרה
      rentalDuration: calculateRentalDuration(req.neededFrom, req.neededUntil),
      // תווית דחיפות
      urgencyLabel: getUrgencyLabel(req.neededFrom),
      // פוטנציאל רווח (לפי תקציב מקסימלי * ימים)
      potentialEarnings: req.budgetMax * calculateRentalDuration(req.neededFrom, req.neededUntil),
    }))

    return NextResponse.json({
      success: true,
      data: enrichedRequests,
      meta: {
        total: totalBeforeLimit,
        returned: enrichedRequests.length,
        filters: {
          location: location || (userId ? 'לפי משתמש' : 'הכל'),
          category: category || 'הכל',
          minBudget: minBudget || 'ללא',
          sortBy,
        },
      },
    })

  } catch (error) {
    console.error('Error fetching requests feed:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת ההזדמנויות' },
      { status: 500 }
    )
  }
}

/**
 * מיון בקשות לפי קריטריון
 */
function sortRequests(requests: MockItemRequest[], sortBy: string): MockItemRequest[] {
  switch (sortBy) {
    case 'newest':
      // הכי חדש קודם
      return [...requests].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    
    case 'budget':
      // תקציב הכי גבוה קודם
      return [...requests].sort((a, b) => b.budgetMax - a.budgetMax)
    
    case 'urgency':
      // הכי דחוף קודם (לפי תאריך התחלה)
      return [...requests].sort((a, b) => 
        new Date(a.neededFrom).getTime() - new Date(b.neededFrom).getTime()
      )
    
    case 'popularity':
      // הכי פופולרי (הכי הרבה צפיות)
      return [...requests].sort((a, b) => b.viewCount - a.viewCount)
    
    default:
      return requests
  }
}

/**
 * חישוב ימים עד לתאריך
 */
function calculateDaysUntil(dateString: string): number {
  const targetDate = new Date(dateString)
  const today = new Date()
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

/**
 * חישוב משך ההשכרה בימים
 */
function calculateRentalDuration(fromDate: string, untilDate: string): number {
  const from = new Date(fromDate)
  const until = new Date(untilDate)
  const diffTime = until.getTime() - from.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays)
}

/**
 * קבלת תווית דחיפות
 */
function getUrgencyLabel(neededFrom: string): { text: string; color: string } {
  const daysUntil = calculateDaysUntil(neededFrom)
  
  if (daysUntil <= 2) {
    return { text: 'דחוף מאוד! 🔥', color: 'red' }
  } else if (daysUntil <= 5) {
    return { text: 'דחוף', color: 'orange' }
  } else if (daysUntil <= 7) {
    return { text: 'השבוע', color: 'yellow' }
  } else {
    return { text: 'לא דחוף', color: 'green' }
  }
}

