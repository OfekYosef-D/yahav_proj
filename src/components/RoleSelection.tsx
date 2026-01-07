'use client'

import { useState } from 'react'

interface RoleSelectionProps {
  selectedRole: 'RENTER' | 'LENDER' | null
  onSelect: (role: 'RENTER' | 'LENDER') => void
}

export default function RoleSelection({ selectedRole, onSelect }: RoleSelectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-800 text-center mb-6">
        מי אתה? 🤔
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option: Renter */}
        <button
          type="button"
          onClick={() => onSelect('RENTER')}
          className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-right group ${
            selectedRole === 'RENTER'
              ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/20'
              : 'border-neutral-200 bg-white hover:border-primary-300 hover:shadow-md'
          }`}
        >
          {/* Selected indicator */}
          {selectedRole === 'RENTER' && (
            <div className="absolute top-3 left-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
            selectedRole === 'RENTER'
              ? 'bg-primary-500 text-white'
              : 'bg-primary-100 text-primary-600 group-hover:bg-primary-200'
          }`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Content */}
          <h4 className={`text-lg font-bold mb-2 ${
            selectedRole === 'RENTER' ? 'text-primary-700' : 'text-neutral-800'
          }`}>
            אני מחפש לשכור 🔍
          </h4>
          <p className="text-sm text-neutral-500">
            אני מחפש פריטים פרימיום להשכרה לטיולים, אירועים או שימוש זמני
          </p>
          
          {/* Features */}
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2 text-sm text-neutral-600">
              <svg className="w-4 h-4 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              חיפוש פריטים באזור שלך
            </li>
            <li className="flex items-center gap-2 text-sm text-neutral-600">
              <svg className="w-4 h-4 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              פרסום בקשות
            </li>
            <li className="flex items-center gap-2 text-sm text-neutral-600">
              <svg className="w-4 h-4 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              הזמנת פריטים
            </li>
          </ul>
        </button>

        {/* Option: Lender */}
        <button
          type="button"
          onClick={() => onSelect('LENDER')}
          className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-right group ${
            selectedRole === 'LENDER'
              ? 'border-secondary-500 bg-secondary-50 shadow-lg shadow-secondary-500/20'
              : 'border-neutral-200 bg-white hover:border-secondary-300 hover:shadow-md'
          }`}
        >
          {/* Selected indicator */}
          {selectedRole === 'LENDER' && (
            <div className="absolute top-3 left-3 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
            selectedRole === 'LENDER'
              ? 'bg-secondary-500 text-white'
              : 'bg-secondary-100 text-secondary-600 group-hover:bg-secondary-200'
          }`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Content */}
          <h4 className={`text-lg font-bold mb-2 ${
            selectedRole === 'LENDER' ? 'text-secondary-700' : 'text-neutral-800'
          }`}>
            אני רוצה להשכיר ציוד 💰
          </h4>
          <p className="text-sm text-neutral-500">
            יש לי פריטים פרימיום שאני רוצה להשכיר ולהרוויח מהם
          </p>
          
          {/* Features */}
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2 text-sm text-neutral-600">
              <svg className="w-4 h-4 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              פרסום פריטים להשכרה
            </li>
            <li className="flex items-center gap-2 text-sm text-neutral-600">
              <svg className="w-4 h-4 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              קבלת התראות על ביקושים
            </li>
            <li className="flex items-center gap-2 text-sm text-neutral-600">
              <svg className="w-4 h-4 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              ניהול הזמנות והכנסות
            </li>
          </ul>
        </button>
      </div>
      
      <p className="text-xs text-neutral-400 text-center mt-4">
        * ניתן לשנות את הבחירה בכל עת מהגדרות החשבון
      </p>
    </div>
  )
}

