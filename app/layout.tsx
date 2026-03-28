import type { Metadata } from 'next'
import { Montserrat, DM_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})

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
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased text-slate-800">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
