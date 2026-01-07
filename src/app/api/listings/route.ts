import { NextRequest, NextResponse } from 'next/server'
import { mockListings, searchListings } from '@/lib/mock-data'

/**
 * API Route: קבלת רשימת פריטים להשכרה
 * GET /api/listings
 * 
 * Query Parameters:
 * - q: מחרוזת חיפוש (אופציונלי)
 * - location: סינון לפי מיקום (אופציונלי)
 * - category: סינון לפי קטגוריה (אופציונלי)
 * 
 * @returns רשימת פריטים להשכרה
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || undefined
    const location = searchParams.get('location') || undefined
    const category = searchParams.get('category') || undefined

    // חיפוש וסינון פריטים
    let listings = searchListings(query, location)

    // סינון לפי קטגוריה אם צוין
    if (category) {
      listings = listings.filter(listing => 
        listing.category.toLowerCase() === category.toLowerCase()
      )
    }

    return NextResponse.json({
      success: true,
      data: listings,
      total: listings.length,
    })
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת הפריטים' },
      { status: 500 }
    )
  }
}

/**
 * API Route: יצירת פריט חדש להשכרה
 * POST /api/listings
 * 
 * Body:
 * - title: כותרת הפריט (חובה)
 * - description: תיאור הפריט (חובה)
 * - pricePerDay: מחיר ליום (חובה)
 * - location: מיקום (חובה)
 * - category: קטגוריה (אופציונלי)
 * 
 * @returns הפריט שנוצר
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // ולידציה בסיסית
    const { title, description, pricePerDay, location, category } = body

    if (!title || !description || !pricePerDay || !location) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'חסרים שדות חובה: title, description, pricePerDay, location' 
        },
        { status: 400 }
      )
    }

    // ולידציה - מחיר חיובי בלבד
    const price = Number(pricePerDay)
    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { success: false, error: 'מחיר חייב להיות מספר חיובי' },
        { status: 400 }
      )
    }

    // יצירת פריט חדש (Mock - בפרודקשן יישמר לבסיס הנתונים)
    const newListing = {
      id: `mock-${Date.now()}`,
      title,
      description,
      pricePerDay: price,
      location,
      category: category || 'אחר',
      ownerName: 'משתמש חדש',
      ownerId: 'mock-user',
      createdAt: new Date().toISOString(),
    }

    // TODO: בעתיד - שמירה לבסיס הנתונים באמצעות Prisma
    // const listing = await prisma.listing.create({ data: newListing })

    console.log('[DB LOG] New listing created:', newListing)

    return NextResponse.json({
      success: true,
      data: newListing,
      message: 'הפריט נוצר בהצלחה',
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה ביצירת הפריט' },
      { status: 500 }
    )
  }
}
