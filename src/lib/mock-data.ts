// נתוני דוגמה להצגה ב-MVP

// ============================================
// Types - טיפוסים
// ============================================

export interface MockUser {
  id: string
  name: string
  email: string
  role: 'RENTER' | 'OWNER' | 'BOTH'
  location: string
  subscribedLocations: string[]
  phone?: string
  avatar?: string
}

export interface MockListing {
  id: string
  title: string
  description: string
  pricePerDay: number
  location: string
  imageUrl?: string
  category: string
  ownerName: string
  ownerId: string
  rating?: number
  reviewCount?: number
}

export interface MockItemRequest {
  id: string
  title: string
  description: string
  category: string
  budgetMin: number
  budgetMax: number
  neededFrom: string // ISO date string
  neededUntil: string
  location: string
  status: 'OPEN' | 'FULFILLED' | 'EXPIRED' | 'CANCELLED'
  viewCount: number
  responseCount: number
  requesterId: string
  requesterName: string
  createdAt: string
}

export interface MockRequestResponse {
  id: string
  requestId: string
  responderId: string
  responderName: string
  message: string
  offeredPrice?: number
  listingId?: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
}

// Enum for booking status
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

// ============================================
// Mock Users - משתמשים לדוגמה
// ============================================

export const mockUsers: MockUser[] = [
  {
    id: 'user1',
    name: 'דוד כהן',
    email: 'david@example.com',
    role: 'OWNER',
    location: 'תל אביב',
    subscribedLocations: ['תל אביב', 'רמת גן', 'גבעתיים'],
  },
  {
    id: 'user2',
    name: 'שרה לוי',
    email: 'sarah@example.com',
    role: 'OWNER',
    location: 'רמת גן',
    subscribedLocations: ['רמת גן', 'תל אביב', 'בני ברק'],
  },
  {
    id: 'user3',
    name: 'מיכאל גולדשטיין',
    email: 'michael@example.com',
    role: 'BOTH',
    location: 'הרצליה',
    subscribedLocations: ['הרצליה', 'תל אביב', 'רעננה'],
  },
  {
    id: 'user4',
    name: 'רונית שמעוני',
    email: 'ronit@example.com',
    role: 'OWNER',
    location: 'חיפה',
    subscribedLocations: ['חיפה', 'קריות', 'עכו'],
  },
  {
    id: 'user5',
    name: 'יוסי אברהם',
    email: 'yossi@example.com',
    role: 'OWNER',
    location: 'ירושלים',
    subscribedLocations: ['ירושלים', 'בית שמש', 'מודיעין'],
  },
  {
    id: 'user6',
    name: 'נעמי פרידמן',
    email: 'naomi@example.com',
    role: 'OWNER',
    location: 'ראשון לציון',
    subscribedLocations: ['ראשון לציון', 'תל אביב', 'חולון'],
  },
  {
    id: 'user7',
    name: 'עמית ברק',
    email: 'amit@example.com',
    role: 'RENTER',
    location: 'תל אביב',
    subscribedLocations: [],
  },
  {
    id: 'user8',
    name: 'מיה כץ',
    email: 'maya@example.com',
    role: 'RENTER',
    location: 'רמת גן',
    subscribedLocations: [],
  },
]

// ============================================
// Mock Listings - פריטים להשכרה לדוגמה
// ============================================

export const mockListings: MockListing[] = [
  {
    id: '1',
    title: 'מזוודת Tumi Alpha 3 - גדולה',
    description: 'מזוודת יוקרה מבית Tumi, נפח 80 ליטר, גלגלים 360°, נעילה TSA מובנית. מושלמת לטיסות ארוכות.',
    pricePerDay: 75,
    location: 'תל אביב',
    imageUrl: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&h=400&fit=crop',
    category: 'מזוודות',
    ownerName: 'דוד כהן',
    ownerId: 'user1',
    rating: 4.9,
    reviewCount: 23,
  },
  {
    id: '2',
    title: 'סט מזוודות Rimowa Original',
    description: 'סט שלם הכולל מזוודה גדולה ובינונית. אלומיניום קלאסי, עמיד במיוחד. מותג פרימיום גרמני.',
    pricePerDay: 150,
    location: 'רמת גן',
    imageUrl: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=600&h=400&fit=crop',
    category: 'מזוודות',
    ownerName: 'שרה לוי',
    ownerId: 'user2',
    rating: 5.0,
    reviewCount: 18,
  },
  {
    id: '3',
    title: 'תיק עסקים Louis Vuitton',
    description: 'תיק עור יוקרתי לפגישות עסקים. תאים מרופדים ללפטופ ומסמכים. מצב מושלם.',
    pricePerDay: 120,
    location: 'הרצליה',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=400&fit=crop',
    category: 'תיקים',
    ownerName: 'מיכאל גולדשטיין',
    ownerId: 'user3',
    rating: 4.8,
    reviewCount: 12,
  },
  {
    id: '4',
    title: 'מזוודה קומפקטית Away Carry-On',
    description: 'מזוודת קבינה מעוצבת עם מטען מובנה לטלפון. מושלמת לנסיעות קצרות וטיסות Low Cost.',
    pricePerDay: 45,
    location: 'חיפה',
    imageUrl: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&h=400&fit=crop',
    category: 'מזוודות',
    ownerName: 'רונית שמעוני',
    ownerId: 'user4',
    rating: 4.7,
    reviewCount: 31,
  },
  {
    id: '5',
    title: 'תיק גב Peak Design Travel',
    description: 'תיק גב 45 ליטר מושלם לצילום ולטיולים. תאים מודולריים, גישה צדדית למצלמה.',
    pricePerDay: 55,
    location: 'ירושלים',
    imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=400&fit=crop',
    category: 'תיקים',
    ownerName: 'יוסי אברהם',
    ownerId: 'user5',
    rating: 4.9,
    reviewCount: 27,
  },
  {
    id: '6',
    title: 'מזוודת Samsonite Lite-Shock',
    description: 'המזוודה הקלה ביותר בעולם! רק 2.3 ק"ג. חומר Curv ייחודי, עמידות מרבית במשקל מינימלי.',
    pricePerDay: 60,
    location: 'ראשון לציון',
    imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop',
    category: 'מזוודות',
    ownerName: 'נעמי פרידמן',
    ownerId: 'user6',
    rating: 4.6,
    reviewCount: 14,
  },
]

// ============================================
// Mock Item Requests - ביקושים לדוגמה
// ============================================

export const mockItemRequests: MockItemRequest[] = [
  {
    id: 'req1',
    title: 'מחפש מזוודה גדולה לטיול בחו"ל',
    description: 'טס לאירופה ל-10 ימים וצריך מזוודה גדולה ואיכותית. יותר טוב אם יש גלגלים 360. אזור תל אביב - יכול לאסוף או שתביאו לי.',
    category: 'מזוודות',
    budgetMin: 40,
    budgetMax: 80,
    neededFrom: '2024-01-15',
    neededUntil: '2024-01-25',
    location: 'תל אביב',
    status: 'OPEN',
    viewCount: 12,
    responseCount: 3,
    requesterId: 'user7',
    requesterName: 'עמית ברק',
    createdAt: '2024-01-08T10:30:00Z',
  },
  {
    id: 'req2',
    title: 'צריך סט מזוודות לחופשה משפחתית',
    description: 'טסים כל המשפחה (4 נפשות) לחופשת קיץ. צריכים 2-3 מזוודות בגדלים שונים. נשמח למשהו יוקרתי.',
    category: 'מזוודות',
    budgetMin: 100,
    budgetMax: 200,
    neededFrom: '2024-02-01',
    neededUntil: '2024-02-14',
    location: 'רמת גן',
    status: 'OPEN',
    viewCount: 8,
    responseCount: 1,
    requesterId: 'user8',
    requesterName: 'מיה כץ',
    createdAt: '2024-01-07T14:20:00Z',
  },
  {
    id: 'req3',
    title: 'תיק עסקים יוקרתי לכנס בחו"ל',
    description: 'נוסע לכנס עסקי בלונדון ל-3 ימים. צריך תיק מרשים שייתן מראה מקצועי. עדיף עור או חומר פרימיום.',
    category: 'תיקים',
    budgetMin: 80,
    budgetMax: 150,
    neededFrom: '2024-01-20',
    neededUntil: '2024-01-23',
    location: 'הרצליה',
    status: 'OPEN',
    viewCount: 5,
    responseCount: 2,
    requesterId: 'user3',
    requesterName: 'מיכאל גולדשטיין',
    createdAt: '2024-01-09T09:15:00Z',
  },
  {
    id: 'req4',
    title: 'מזוודת קבינה לנסיעה קצרה',
    description: 'טסה לוינה לסופ"ש ארוך. צריכה מזוודת קבינה קטנה שתיכנס לדרישות Ryanair. משהו קל.',
    category: 'מזוודות',
    budgetMin: 30,
    budgetMax: 50,
    neededFrom: '2024-01-12',
    neededUntil: '2024-01-15',
    location: 'תל אביב',
    status: 'FULFILLED',
    viewCount: 20,
    responseCount: 5,
    requesterId: 'user7',
    requesterName: 'עמית ברק',
    createdAt: '2024-01-05T16:45:00Z',
  },
  {
    id: 'req5',
    title: 'ציוד צילום לחתונה',
    description: 'מצלם חתונה באילת ומחפש תיק ציוד איכותי לנשיאת מצלמות ועדשות. צריך משהו עם הגנה טובה.',
    category: 'ציוד צילום',
    budgetMin: 50,
    budgetMax: 100,
    neededFrom: '2024-01-25',
    neededUntil: '2024-01-27',
    location: 'ירושלים',
    status: 'OPEN',
    viewCount: 3,
    responseCount: 0,
    requesterId: 'user5',
    requesterName: 'יוסי אברהם',
    createdAt: '2024-01-09T11:00:00Z',
  },
]

// ============================================
// Mock Request Responses - תגובות לביקושים
// ============================================

export const mockRequestResponses: MockRequestResponse[] = [
  {
    id: 'resp1',
    requestId: 'req1',
    responderId: 'user1',
    responderName: 'דוד כהן',
    message: 'יש לי מזוודת Tumi מעולה שמתאימה בדיוק! גלגלים 360, נעילה TSA, נפח 80 ליטר. אשמח להשכיר.',
    offeredPrice: 70,
    listingId: '1',
    status: 'PENDING',
    createdAt: '2024-01-08T12:00:00Z',
  },
  {
    id: 'resp2',
    requestId: 'req1',
    responderId: 'user6',
    responderName: 'נעמי פרידמן',
    message: 'יש לי Samsonite קלה מאוד - רק 2.3 קילו! מושלמת לנסיעות ארוכות. יכולה להביא לת"א.',
    offeredPrice: 55,
    listingId: '6',
    status: 'PENDING',
    createdAt: '2024-01-08T14:30:00Z',
  },
  {
    id: 'resp3',
    requestId: 'req2',
    responderId: 'user2',
    responderName: 'שרה לוי',
    message: 'יש לי סט Rimowa מהמם - מזוודה גדולה ובינונית. אלומיניום, עמיד מאוד. אני בדיוק ברמת גן!',
    offeredPrice: 140,
    listingId: '2',
    status: 'PENDING',
    createdAt: '2024-01-07T18:00:00Z',
  },
  {
    id: 'resp4',
    requestId: 'req3',
    responderId: 'user3',
    responderName: 'מיכאל גולדשטיין',
    message: 'יש לי תיק Louis Vuitton עור אמיתי - בדיוק מה שאתה צריך לכנס עסקי. מראה פרימיום!',
    offeredPrice: 100,
    listingId: '3',
    status: 'ACCEPTED',
    createdAt: '2024-01-09T10:30:00Z',
  },
]

// ============================================
// Helper Functions - פונקציות עזר
// ============================================

// מציאת פריט לפי ID
export function getListingById(id: string): MockListing | undefined {
  return mockListings.find(listing => listing.id === id)
}

// חיפוש פריטים
export function searchListings(query?: string, location?: string): MockListing[] {
  return mockListings.filter(listing => {
    const matchesQuery = !query || 
      listing.title.toLowerCase().includes(query.toLowerCase()) ||
      listing.description.toLowerCase().includes(query.toLowerCase()) ||
      listing.category.toLowerCase().includes(query.toLowerCase())
    
    const matchesLocation = !location || 
      listing.location.toLowerCase().includes(location.toLowerCase())
    
    return matchesQuery && matchesLocation
  })
}

// מציאת משתמש לפי ID
export function getUserById(id: string): MockUser | undefined {
  return mockUsers.find(user => user.id === id)
}

// מציאת משתמשים לפי מיקום (למשכירים - לשליחת התראות)
export function getUsersByLocation(location: string): MockUser[] {
  const normalizedLocation = location.toLowerCase()
  return mockUsers.filter(user => 
    // משתמש נמצא באותו מיקום או רשום לקבל התראות מאותו אזור
    user.location.toLowerCase() === normalizedLocation ||
    user.subscribedLocations.some(loc => loc.toLowerCase() === normalizedLocation)
  )
}

// מציאת משכירים (Owners) לפי מיקום
export function getOwnersByLocation(location: string): MockUser[] {
  const usersInLocation = getUsersByLocation(location)
  return usersInLocation.filter(user => user.role === 'OWNER' || user.role === 'BOTH')
}

// מציאת בקשה לפי ID
export function getRequestById(id: string): MockItemRequest | undefined {
  return mockItemRequests.find(request => request.id === id)
}

// מציאת בקשות פתוחות לפי מיקום (Feed למשכירים)
export function getOpenRequestsByLocation(location: string): MockItemRequest[] {
  const normalizedLocation = location.toLowerCase()
  return mockItemRequests
    .filter(request => 
      request.status === 'OPEN' &&
      request.location.toLowerCase() === normalizedLocation
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// מציאת בקשות פתוחות לפי מספר מיקומים (למשכירים עם subscribedLocations)
export function getOpenRequestsByLocations(locations: string[]): MockItemRequest[] {
  const normalizedLocations = locations.map(loc => loc.toLowerCase())
  return mockItemRequests
    .filter(request => 
      request.status === 'OPEN' &&
      normalizedLocations.includes(request.location.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// מציאת תגובות לבקשה
export function getResponsesByRequestId(requestId: string): MockRequestResponse[] {
  return mockRequestResponses.filter(response => response.requestId === requestId)
}

// מציאת בקשות של משתמש
export function getRequestsByUserId(userId: string): MockItemRequest[] {
  return mockItemRequests.filter(request => request.requesterId === userId)
}

// יצירת בקשה חדשה (Mock)
let requestCounter = mockItemRequests.length

export function createRequest(data: {
  title: string
  description: string
  category: string
  budgetMin: number
  budgetMax: number
  neededFrom: string
  neededUntil: string
  location: string
  requesterId: string
  requesterName: string
}): MockItemRequest {
  requestCounter++
  const newRequest: MockItemRequest = {
    id: `req${requestCounter}`,
    ...data,
    status: 'OPEN',
    viewCount: 0,
    responseCount: 0,
    createdAt: new Date().toISOString(),
  }
  mockItemRequests.push(newRequest)
  return newRequest
}

// קבלת רשימת ערים זמינות
export function getAvailableLocations(): string[] {
  const locations = new Set<string>()
  mockListings.forEach(listing => locations.add(listing.location))
  mockItemRequests.forEach(request => locations.add(request.location))
  mockUsers.forEach(user => {
    if (user.location) locations.add(user.location)
    user.subscribedLocations.forEach(loc => locations.add(loc))
  })
  return Array.from(locations).sort()
}
