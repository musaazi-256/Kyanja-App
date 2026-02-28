'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, BookOpen, X } from 'lucide-react'

const LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'About',      href: '/about' },
  { label: 'Programs',   href: '/programs' },
  { label: 'Gallery',    href: '/gallery' },
  { label: 'Schedule',   href: '/schedule' },
  { label: 'Admissions', href: '/admissions' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-blue-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-3">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-blue-900 leading-tight text-[15px] group-hover:text-blue-800 transition-colors">Kyanja Junior School</p>
            <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-0.5">Kampala, Uganda</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-50/50 p-1 rounded-full border border-slate-100">
          {LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 relative overflow-hidden',
                pathname === href
                  ? 'text-blue-900 bg-white shadow-sm ring-1 ring-slate-900/5'
                  : 'text-slate-500 hover:text-blue-900 hover:bg-slate-100',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild size="sm" className="bg-blue-900 hover:bg-blue-800 text-white rounded-full px-5 py-0 h-9 font-semibold shadow-md shadow-blue-900/20 active:scale-95 transition-all">
            <Link href="/admissions/apply">Apply Now</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-slate-100 transition-colors">
              <Menu className="w-5 h-5 text-slate-700" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 border-l border-white/20 bg-white/95 backdrop-blur-xl">
            <div className="flex flex-col gap-2 mt-8">
              {LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'px-5 py-3.5 text-base font-semibold rounded-2xl transition-all active:scale-95',
                    pathname === href
                      ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-900',
                  )}
                >
                  {label}
                </Link>
              ))}
              <Button asChild className="mt-6 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl h-12 text-base font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                <Link href="/admissions/apply" onClick={() => setOpen(false)}>Apply Now</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
