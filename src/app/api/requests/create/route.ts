import { NextRequest, NextResponse } from 'next/server'
import { 
  createRequest, 
  getOwnersByLocation, 
  getUserById,
  type MockUser 
} from '@/lib/mock-data'

/**
 * API Route: יצירת בקשה חדשה להשכרת פריט
 * POST /api/requests/create
 * 
 * פיצ'ר "Broadcast Request" - הפצת דרישה למשכירים באזור
 * 
 * Body:
 * - title: מה מחפשים (חובה)
 * - description: תיאור מפורט (חובה)
 * - category: קטגוריה (אופציונלי)
 * - budgetMin: תקציב מינימלי ליום (חובה)
 * - budgetMax: תקציב מקסימלי ליום (חובה)
 * - neededFrom: תאריך התחלה (חובה)
 * - neededUntil: תאריך סיום (חובה)
 * - location: מיקום/אזור (חובה)
 * - requesterId: מזהה המבקש (חובה)
 * 
 * @returns הבקשה שנוצרה + רשימת משכירים שקיבלו התראה (סימולציה)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // ולידציה של שדות חובה
    const { 
      title, 
      description, 
      category,
      budgetMin, 
      budgetMax, 
      neededFrom, 
      neededUntil, 
      location, 
      requesterId 
    } = body

    // בדיקת שדות חובה
    const requiredFields = ['title', 'description', 'budgetMin', 'budgetMax', 'neededFrom', 'neededUntil', 'location', 'requesterId']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `חסרים שדות חובה: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // ולידציה של טווח תקציב
    if (Number(budgetMin) > Number(budgetMax)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'תקציב מינימלי לא יכול להיות גבוה מהמקסימלי' 
        },
        { status: 400 }
      )
    }

    // ולידציה של תאריכים
    const fromDate = new Date(neededFrom)
    const untilDate = new Date(neededUntil)
    
    if (fromDate >= untilDate) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'תאריך סיום חייב להיות אחרי תאריך התחלה' 
        },
        { status: 400 }
      )
    }

    // בדיקת קיום המשתמש
    const requester = getUserById(requesterId)
    if (!requester) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'משתמש לא נמצא' 
        },
        { status: 404 }
      )
    }

    // יצירת הבקשה
    const newRequest = createRequest({
      title,
      description,
      category: category || 'אחר',
      budgetMin: Number(budgetMin),
      budgetMax: Number(budgetMax),
      neededFrom,
      neededUntil,
      location,
      requesterId,
      requesterName: requester.name,
    })

    // ============================================
    // Simulated Matching Logic - לוגיקת התאמה
    // ============================================
    // שליפת כל המשכירים באזור הבקשה לצורך שליחת התראות
    
    const ownersInLocation = getOwnersByLocation(location)
    
    // סינון - לא לשלוח התראה למבקש עצמו
    const eligibleOwners = ownersInLocation.filter(
      owner => owner.id !== requesterId
    )

    // סימולציה של שליחת התראות (Push Notifications)
    const notificationsSent = simulatePushNotifications(eligibleOwners, newRequest)

    // TODO: בפרודקשן - שליחת התראות אמיתיות
    // await sendPushNotifications(eligibleOwners, newRequest)
    // await sendEmailNotifications(eligibleOwners, newRequest)

    console.log(`[Requests] נוצרה בקשה חדשה: ${newRequest.id}`)
    console.log(`[Notifications] נשלחו ${notificationsSent.length} התראות למשכירים באזור ${location}`)

    return NextResponse.json({
      success: true,
      data: {
        request: newRequest,
        // מידע על ההתראות (לדיבוג ו-UI feedback)
        notifications: {
          sentTo: notificationsSent.length,
          owners: notificationsSent.map(owner => ({
            id: owner.id,
            name: owner.name,
            location: owner.location,
          })),
        },
      },
      message: `הבקשה נוצרה בהצלחה! ${notificationsSent.length} משכירים באזור קיבלו התראה.`,
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating request:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה ביצירת הבקשה' },
      { status: 500 }
    )
  }
}

/**
 * סימולציית שליחת Push Notifications למשכירים
 * בפרודקשן - כאן יהיה חיבור לשירות התראות אמיתי (Firebase, OneSignal, etc.)
 */
function simulatePushNotifications(
  owners: MockUser[], 
  request: { id: string; title: string; location: string; budgetMax: number }
): MockUser[] {
  // לוג של "שליחת" ההתראות
  owners.forEach(owner => {
    console.log(`[Push Notification] שולח ל-${owner.name}:`)
    console.log(`  📢 הזדמנות חדשה באזור ${request.location}!`)
    console.log(`  🔍 "${request.title}"`)
    console.log(`  💰 תקציב עד ₪${request.budgetMax} ליום`)
  })

  return owners
}

