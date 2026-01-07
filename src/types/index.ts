/**
 * Unified Types for Social Renting Platform
 * 
 * These types are used consistently across:
 * - Frontend components
 * - API routes
 * - Mock data
 */

// ============================================
// User Types
// ============================================

export type UserRole = 'RENTER' | 'OWNER' | 'BOTH'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  avatar?: string
  location?: string
  subscribedLocations: string[]
  createdAt?: string
  updatedAt?: string
}

// ============================================
// Listing Types
// ============================================

export interface Listing {
  id: string
  title: string
  description: string
  pricePerDay: number
  location: string
  category: string
  images: string[]
  imageUrl?: string // Backward compatibility
  isActive: boolean
  ownerId: string
  ownerName: string
  rating?: number // Optional rating (e.g., 4.5)
  reviewCount?: number // Optional review count
  createdAt?: string
  updatedAt?: string
}

export interface ListingCreatePayload {
  title: string
  description: string
  pricePerDay: number
  location: string
  category?: string
  images?: string[]
}

// ============================================
// Booking Types
// ============================================

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'

export interface Booking {
  id: string
  listingId: string
  renterId: string
  startDate: string // ISO date
  endDate: string // ISO date
  totalPrice: number
  status: BookingStatus
  listing?: Listing
  renter?: User
  createdAt?: string
  updatedAt?: string
}

export interface BookingCreatePayload {
  listingId: string
  renterId?: string // Optional - might use session
  startDate: string
  endDate: string
  totalPrice: number
  message?: string
}

// ============================================
// Item Request Types (Broadcast Requests)
// ============================================

export type RequestStatus = 'OPEN' | 'FULFILLED' | 'EXPIRED' | 'CANCELLED'
export type ResponseStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'
export type UrgencyLevel = 'urgent' | 'today' | 'high_budget' | 'normal'

export interface ItemRequest {
  id: string
  title: string
  description: string
  category: string
  budgetMin: number
  budgetMax: number
  neededFrom: string // ISO date
  neededUntil: string // ISO date
  location: string
  status: RequestStatus
  viewCount: number
  responseCount: number
  requesterId: string
  requesterName: string
  createdAt: string
  expiresAt?: string
  // Enriched fields from API
  daysUntilNeeded?: number
  rentalDuration?: number
  urgencyLabel?: { text: string; color: string }
  potentialEarnings?: number
}

export interface ItemRequestCreatePayload {
  title: string
  description: string
  category?: string
  budgetMin: number
  budgetMax: number
  neededFrom: string
  neededUntil: string
  location: string
  requesterId?: string // Optional - might use session
}

// Quick form data for the simplified modal
export interface QuickRequestFormData {
  item: string
  location: string
  when: 'today' | 'tomorrow' | 'weekend' | 'this_week' | string
  budget: string
}

// ============================================
// Request Response Types
// ============================================

export interface RequestResponse {
  id: string
  requestId: string
  responderId: string
  responderName: string
  message: string
  offeredPrice?: number
  listingId?: string
  status: ResponseStatus
  createdAt: string
}

export interface RequestResponsePayload {
  responderId?: string // Optional - might use session
  message: string
  offeredPrice?: number
  listingId?: string
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: Record<string, unknown>
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number
    returned: number
    page?: number
    limit?: number
  }
}

// ============================================
// UI Types
// ============================================

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

// Opportunity card for feed
export interface OpportunityDisplay {
  id: string
  userName: string
  userLocation: string
  item: string
  when: string
  budget: number
  budgetType: 'fixed' | 'flexible'
  urgency: UrgencyLevel
  postedAt: Date
  avatar: string
}

