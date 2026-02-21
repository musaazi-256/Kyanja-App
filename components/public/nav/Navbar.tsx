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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-[#1e3a5f] leading-tight text-sm">Kyanja Junior School</p>
            <p className="text-[10px] text-slate-400 tracking-wide uppercase">Kampala, Uganda</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                pathname === href
                  ? 'text-[#1e3a5f] bg-slate-100'
                  : 'text-slate-600 hover:text-[#1e3a5f] hover:bg-slate-50',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild size="sm" className="bg-[#1e3a5f] hover:bg-[#16305a]">
            <Link href="/admissions/apply">Apply Now</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-1 mt-6">
              {LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    pathname === href
                      ? 'bg-[#1e3a5f] text-white'
                      : 'text-slate-700 hover:bg-slate-100',
                  )}
                >
                  {label}
                </Link>
              ))}
              <Button asChild className="mt-4 bg-[#1e3a5f] hover:bg-[#16305a]">
                <Link href="/admissions/apply" onClick={() => setOpen(false)}>Apply Now</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
