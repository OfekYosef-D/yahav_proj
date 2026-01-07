import { NextRequest, NextResponse } from 'next/server'
import { getListingById, getUserById } from '@/lib/mock-data'
import { BookingCreatePayload, Booking, BookingStatus } from '@/types'

// In-memory mock bookings storage
const mockBookings: Booking[] = []

/**
 * API Route: יצירת הזמנה חדשה
 * POST /api/bookings
 * 
 * Body (BookingCreatePayload):
 * - listingId: מזהה הפריט (חובה)
 * - renterId: מזהה השוכר (אופציונלי - יילקח מ-session)
 * - startDate: תאריך התחלה (חובה)
 * - endDate: תאריך סיום (חובה)
 * - totalPrice: מחיר כולל (חובה)
 * - message: הודעה למשכיר (אופציונלי)
 * 
 * @returns ההזמנה שנוצרה
 */
export async function POST(request: NextRequest) {
  try {
    const body: BookingCreatePayload = await request.json()
    
    const { listingId, renterId, startDate, endDate, totalPrice, message } = body

    // ולידציה של שדות חובה
    if (!listingId || !startDate || !endDate || totalPrice === undefined) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'חסרים שדות חובה: listingId, startDate, endDate, totalPrice' 
        },
        { status: 400 }
      )
    }

    // בדיקת קיום הפריט
    const listing = getListingById(listingId)
    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'הפריט לא נמצא' },
        { status: 404 }
      )
    }

    // בדיקת קיום השוכר (אם צוין)
    const actualRenterId = renterId || 'user7' // Default mock user
    const renter = getUserById(actualRenterId)
    if (!renter) {
      return NextResponse.json(
        { success: false, error: 'משתמש לא נמצא' },
        { status: 404 }
      )
    }

    // ולידציה של תאריכים
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (start < today) {
      return NextResponse.json(
        { success: false, error: 'תאריך התחלה לא יכול להיות בעבר' },
        { status: 400 }
      )
    }

    if (end <= start) {
      return NextResponse.json(
        { success: false, error: 'תאריך סיום חייב להיות אחרי תאריך התחלה' },
        { status: 400 }
      )
    }

    // בדיקת זמינות (mock - תמיד זמין)
    // TODO: בפרודקשן - בדיקה מול ההזמנות הקיימות

    // יצירת ההזמנה
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      listingId,
      renterId: actualRenterId,
      startDate,
      endDate,
      totalPrice: Number(totalPrice),
      status: 'PENDING' as BookingStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockBookings.push(newBooking)

    console.log(`[Booking] נוצרה הזמנה חדשה: ${newBooking.id}`)
    console.log(`  📦 פריט: ${listing.title}`)
    console.log(`  👤 שוכר: ${renter.name}`)
    console.log(`  📅 תאריכים: ${startDate} עד ${endDate}`)
    console.log(`  💰 מחיר: ₪${totalPrice}`)
    if (message) console.log(`  💬 הודעה: ${message}`)

    // TODO: בפרודקשן - שליחת מייל/התראה למשכיר

    return NextResponse.json({
      success: true,
      data: {
        booking: newBooking,
        listing: {
          id: listing.id,
          title: listing.title,
          ownerName: listing.ownerName,
        },
      },
      message: 'בקשת ההשכרה נשלחה בהצלחה! המשכיר יצור איתך קשר בקרוב.',
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה ביצירת ההזמנה' },
      { status: 500 }
    )
  }
}

/**
 * API Route: קבלת הזמנות של משתמש
 * GET /api/bookings
 * 
 * Query Parameters:
 * - userId: מזהה המשתמש (חובה)
 * - status: סינון לפי סטטוס (אופציונלי)
 * - role: renter/owner - הזמנות כשוכר או כמשכיר (אופציונלי)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const role = searchParams.get('role') || 'renter'

    if (!userId) {
      // Return all bookings if no userId specified (for demo)
      return NextResponse.json({
        success: true,
        data: mockBookings,
        meta: { total: mockBookings.length },
      })
    }

    let bookings = mockBookings

    // סינון לפי תפקיד
    if (role === 'renter') {
      bookings = bookings.filter(b => b.renterId === userId)
    } else if (role === 'owner') {
      // צריך לבדוק אם הפריט שייך למשתמש
      bookings = bookings.filter(b => {
        const listing = getListingById(b.listingId)
        return listing?.ownerId === userId
      })
    }

    // סינון לפי סטטוס
    if (status) {
      bookings = bookings.filter(b => b.status === status)
    }

    return NextResponse.json({
      success: true,
      data: bookings,
      meta: { total: bookings.length },
    })

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת ההזמנות' },
      { status: 500 }
    )
  }
}

