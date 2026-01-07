import { NextRequest, NextResponse } from 'next/server'
import { getListingById } from '@/lib/mock-data'

/**
 * API Route: קבלת פריט בודד לפי ID
 * GET /api/listings/:id
 * 
 * @returns פרטי הפריט
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = getListingById(params.id)

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'הפריט לא נמצא' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: listing,
    })
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת הפריט' },
      { status: 500 }
    )
  }
}

/**
 * API Route: עדכון פריט קיים
 * PUT /api/listings/:id
 * 
 * @returns הפריט המעודכן
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const existingListing = getListingById(params.id)

    if (!existingListing) {
      return NextResponse.json(
        { success: false, error: 'הפריט לא נמצא' },
        { status: 404 }
      )
    }

    // Mock update
    const updatedListing = {
      ...existingListing,
      ...body,
      id: params.id, // מניעת שינוי ה-ID
      updatedAt: new Date().toISOString(),
    }

    // TODO: בעתיד - עדכון בבסיס הנתונים באמצעות Prisma
    // const listing = await prisma.listing.update({ where: { id }, data: body })

    return NextResponse.json({
      success: true,
      data: updatedListing,
      message: 'הפריט עודכן בהצלחה',
    })
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בעדכון הפריט' },
      { status: 500 }
    )
  }
}

/**
 * API Route: מחיקת פריט
 * DELETE /api/listings/:id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingListing = getListingById(params.id)

    if (!existingListing) {
      return NextResponse.json(
        { success: false, error: 'הפריט לא נמצא' },
        { status: 404 }
      )
    }

    // TODO: בעתיד - מחיקה מבסיס הנתונים באמצעות Prisma
    // await prisma.listing.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'הפריט נמחק בהצלחה',
    })
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה במחיקת הפריט' },
      { status: 500 }
    )
  }
}

