import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { ConvexClentProvider } from '@/components/providers/convex-provider'
import { ModalProvider } from '@/components/providers/modal-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jotion',
  description: 'The connected workspace wherebetter, faster work happens.',
  icons: {
    icon: [
      {
        media: '(prefers-color-schema: light)',
        url: '/logo.svg',
        href: '/logo.svg'
      },
      {
        media: '(prefers-color-schema: dark)',
        url: '/logo-dark.svg',
        href: '/logo-dark.svg'
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClentProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="jotion-theme-2"
          >
            <Toaster position="top-center" />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </ConvexClentProvider>
      </body>
    </html>
  )
}
