import { NextRequest, NextResponse } from 'next/server'
import { 
  getRequestById, 
  getUserById,
  getListingById,
  mockRequestResponses,
  mockItemRequests 
} from '@/lib/mock-data'

/**
 * API Route: תגובה לבקשה - משכיר מציע את הפריט שלו
 * POST /api/requests/:id/respond
 * 
 * Body:
 * - responderId: מזהה המשכיר (חובה)
 * - message: הודעה למבקש (חובה)
 * - offeredPrice: מחיר מוצע ליום (אופציונלי)
 * - listingId: מזהה הפריט המוצע (אופציונלי)
 * 
 * @returns התגובה שנוצרה
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { responderId, message, offeredPrice, listingId } = body

    // ולידציה
    if (!responderId || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'חסרים שדות חובה: responderId, message' 
        },
        { status: 400 }
      )
    }

    // בדיקת קיום הבקשה
    const itemRequest = getRequestById(params.id)
    if (!itemRequest) {
      return NextResponse.json(
        { success: false, error: 'הבקשה לא נמצאה' },
        { status: 404 }
      )
    }

    // בדיקה שהבקשה עדיין פתוחה
    if (itemRequest.status !== 'OPEN') {
      return NextResponse.json(
        { success: false, error: 'הבקשה כבר לא פתוחה להצעות' },
        { status: 400 }
      )
    }

    // בדיקת קיום המשכיר
    const responder = getUserById(responderId)
    if (!responder) {
      return NextResponse.json(
        { success: false, error: 'משתמש לא נמצא' },
        { status: 404 }
      )
    }

    // בדיקה שהמשכיר לא מגיב לבקשה של עצמו
    if (responderId === itemRequest.requesterId) {
      return NextResponse.json(
        { success: false, error: 'לא ניתן להגיב לבקשה של עצמך' },
        { status: 400 }
      )
    }

    // בדיקה שהמשכיר לא כבר הגיב
    const existingResponse = mockRequestResponses.find(
      r => r.requestId === params.id && r.responderId === responderId
    )
    if (existingResponse) {
      return NextResponse.json(
        { success: false, error: 'כבר הגבת לבקשה זו' },
        { status: 400 }
      )
    }

    // בדיקת קיום הפריט אם צוין
    if (listingId) {
      const listing = getListingById(listingId)
      if (!listing) {
        return NextResponse.json(
          { success: false, error: 'הפריט לא נמצא' },
          { status: 404 }
        )
      }
    }

    // יצירת התגובה
    const newResponse = {
      id: `resp${Date.now()}`,
      requestId: params.id,
      responderId,
      responderName: responder.name,
      message,
      offeredPrice: offeredPrice ? Number(offeredPrice) : undefined,
      listingId,
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
    }

    mockRequestResponses.push(newResponse)

    // עדכון מונה תגובות בבקשה
    const requestIndex = mockItemRequests.findIndex(r => r.id === params.id)
    if (requestIndex !== -1) {
      mockItemRequests[requestIndex].responseCount++
    }

    console.log(`[Response] ${responder.name} הגיב לבקשה "${itemRequest.title}"`)

    return NextResponse.json({
      success: true,
      data: newResponse,
      message: 'התגובה נשלחה בהצלחה!',
    }, { status: 201 })

  } catch (error) {
    console.error('Error responding to request:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בשליחת התגובה' },
      { status: 500 }
    )
  }
}

/**
 * API Route: קבלת כל התגובות לבקשה
 * GET /api/requests/:id/respond
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemRequest = getRequestById(params.id)
    
    if (!itemRequest) {
      return NextResponse.json(
        { success: false, error: 'הבקשה לא נמצאה' },
        { status: 404 }
      )
    }

    const responses = mockRequestResponses.filter(r => r.requestId === params.id)

    return NextResponse.json({
      success: true,
      data: responses,
      meta: {
        total: responses.length,
      },
    })
  } catch (error) {
    console.error('Error fetching responses:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת התגובות' },
      { status: 500 }
    )
  }
}

