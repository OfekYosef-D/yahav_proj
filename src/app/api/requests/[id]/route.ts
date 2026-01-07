import { NextRequest, NextResponse } from 'next/server'
import { 
  getRequestById, 
  getResponsesByRequestId,
  mockItemRequests 
} from '@/lib/mock-data'

/**
 * API Route: קבלת בקשה בודדת לפי ID
 * GET /api/requests/:id
 * 
 * @returns פרטי הבקשה כולל תגובות
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

    // עדכון מונה צפיות
    const requestIndex = mockItemRequests.findIndex(r => r.id === params.id)
    if (requestIndex !== -1) {
      mockItemRequests[requestIndex].viewCount++
    }

    // שליפת תגובות לבקשה
    const responses = getResponsesByRequestId(params.id)

    return NextResponse.json({
      success: true,
      data: {
        ...itemRequest,
        responses,
      },
    })
  } catch (error) {
    console.error('Error fetching request:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת הבקשה' },
      { status: 500 }
    )
  }
}

/**
 * API Route: עדכון בקשה (שינוי סטטוס וכו')
 * PATCH /api/requests/:id
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const requestIndex = mockItemRequests.findIndex(r => r.id === params.id)

    if (requestIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'הבקשה לא נמצאה' },
        { status: 404 }
      )
    }

    // עדכון שדות מותרים
    const allowedFields = ['status', 'title', 'description', 'budgetMin', 'budgetMax']
    const updates: Record<string, unknown> = {}
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    mockItemRequests[requestIndex] = {
      ...mockItemRequests[requestIndex],
      ...updates,
    }

    return NextResponse.json({
      success: true,
      data: mockItemRequests[requestIndex],
      message: 'הבקשה עודכנה בהצלחה',
    })
  } catch (error) {
    console.error('Error updating request:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בעדכון הבקשה' },
      { status: 500 }
    )
  }
}

/**
 * API Route: מחיקת/ביטול בקשה
 * DELETE /api/requests/:id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestIndex = mockItemRequests.findIndex(r => r.id === params.id)

    if (requestIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'הבקשה לא נמצאה' },
        { status: 404 }
      )
    }

    // במקום למחוק - משנים סטטוס לבוטל
    mockItemRequests[requestIndex].status = 'CANCELLED'

    return NextResponse.json({
      success: true,
      message: 'הבקשה בוטלה בהצלחה',
    })
  } catch (error) {
    console.error('Error cancelling request:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בביטול הבקשה' },
      { status: 500 }
    )
  }
}

