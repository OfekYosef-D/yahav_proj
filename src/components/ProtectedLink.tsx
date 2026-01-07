'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useAuthModal } from '@/hooks/useAuthModal'

interface ProtectedLinkProps {
  href: string
  children: ReactNode
  className?: string
  action?: 'view_listing' | 'book' | 'post_request' | 'respond' | 'general'
  title?: string
  message?: string
}

export default function ProtectedLink({ 
  href, 
  children, 
  className = '',
  action = 'general',
  title,
  message,
}: ProtectedLinkProps) {
  const { isAuthenticated, showAuthModal } = useAuthModal()

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      showAuthModal(action, title, message)
    }
  }

  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}

