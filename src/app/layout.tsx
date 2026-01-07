import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import { AuthProvider } from '@/lib/auth-context'
import { AuthModalProvider } from '@/hooks/useAuthModal'
import { ToastProvider } from '@/components/Toast'

const rubik = Rubik({ 
  subsets: ['latin', 'hebrew'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rubik',
})

export const metadata: Metadata = {
  title: 'פריט לטיסה | השכרות פרימיום P2P',
  description: 'פלטפורמה להשכרת פריטי פרימיום בין אנשים פרטיים - מזוודות יוקרה, תיקים ועוד',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable}>
      <body className="font-rubik min-h-screen bg-neutral-50">
        <AuthProvider>
          <ToastProvider>
            <AuthModalProvider>
              <Header />
              <main>
                {children}
              </main>
              <footer className="bg-neutral-800 text-white py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                  <p className="text-neutral-400">© 2024 פריט לטיסה. כל הזכויות שמורות.</p>
                </div>
              </footer>
            </AuthModalProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
