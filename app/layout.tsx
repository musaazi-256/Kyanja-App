import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Kyanja Junior School',
    template: '%s | Kyanja Junior School',
  },
  description:
    'Kyanja Junior School — providing quality education in Kampala, Uganda.',
  keywords: ['school', 'Kyanja', 'Uganda', 'Kampala', 'primary school', 'admissions'],
  openGraph: {
    type:        'website',
    locale:      'en_UG',
    url:         'https://www.kyanjajuniorschool.com',
    siteName:    'Kyanja Junior School',
    title:       'Kyanja Junior School',
    description: 'Quality education in Kampala, Uganda.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
