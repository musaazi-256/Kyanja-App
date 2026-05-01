import type { Metadata } from 'next'
import { Montserrat, DM_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import SchoolJsonLd from '@/components/seo/SchoolJsonLd'
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
  metadataBase: new URL('https://www.kyanjajuniorschool.com'),
  title: {
    default: 'Kyanja Junior School | Best Primary School in Kyanja, Kampala',
    template: '%s | Kyanja Junior School',
  },
  description:
    'Kyanja Junior School — a leading nursery and primary school in Kyanja, Kisaasi, Nakawa Division, Kampala, Uganda. 500m from Kyanja West Mall. Strong P7 results, safe environment, quality education. Apply for admissions today.',
  keywords: [
    'Kyanja Junior School',
    'school in Kyanja',
    'Kyanja school',
    'Kisaasi school',
    'school near Kisaasi',
    'primary school Kyanja',
    'nursery school Kyanja',
    'school Nakawa Division',
    'school Kampala Uganda',
    'Uganda primary school',
    'best school Kyanja',
    'best school Kisaasi',
    'school near Kyanja West Mall',
    'school Kyanja West Mall',
    'school admissions Uganda',
    'P7 school Kampala',
    'primary school Kampala',
    'junior school Uganda',
    'Plot 43a Katumba Zone',
    'Nakawa primary school',
    'school near Kisaasi Kampala',
  ],
  alternates: {
    canonical: 'https://www.kyanjajuniorschool.com',
  },
  openGraph: {
    type:        'website',
    locale:      'en_UG',
    url:         'https://www.kyanjajuniorschool.com',
    siteName:    'Kyanja Junior School',
    title:       'Kyanja Junior School | Best Primary School in Kyanja, Kampala',
    description: 'Leading nursery and primary school in Kyanja, Kisaasi, Nakawa Division, Kampala. Strong P7 results, safe learning environment. Enrol your child today.',
    images: [
      {
        url:    '/logo.svg',
        width:  200,
        height: 200,
        alt:    'Kyanja Junior School Logo',
      },
    ],
  },
  twitter: {
    card:        'summary',
    title:       'Kyanja Junior School | Kyanja, Kisaasi, Kampala, Uganda',
    description: 'Leading nursery and primary school in Kyanja, Kisaasi, Nakawa Division. Apply for admissions today.',
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:              true,
      follow:             true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${dmSans.variable}`}>
      <head>
        <SchoolJsonLd />
      </head>
      <body className="font-sans antialiased text-slate-800">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
