import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { mockAuthUsers } from '@/lib/auth'

/**
 * API Route: הרשמת משתמש חדש
 * POST /api/auth/register
 * 
 * Body:
 * - name: שם מלא (חובה)
 * - email: כתובת אימייל (חובה)
 * - password: סיסמה (חובה)
 * - role: RENTER | LENDER (חובה)
 * - location: מיקום (אופציונלי)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role, location } = body

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'נא למלא את כל השדות' },
        { status: 400 }
      )
    }

    if (!['RENTER', 'LENDER'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'תפקיד לא תקין' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'הסיסמה חייבת להכיל לפחות 6 תווים' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = mockAuthUsers.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'כתובת האימייל כבר רשומה במערכת' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user (Mock - in production use Prisma)
    const newUser = {
      id: `user${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role: role as 'OWNER' | 'RENTER' | 'BOTH', // Map to old enum for mock
      location: location || '',
      subscribedLocations: role === 'LENDER' && location ? [location] : [],
    }

    // Add to mock database
    mockAuthUsers.push(newUser)

    console.log(`[Auth] New user registered: ${email} as ${role}`)

    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      message: 'ההרשמה הושלמה בהצלחה!',
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בהרשמה' },
      { status: 500 }
    )
  }
}

