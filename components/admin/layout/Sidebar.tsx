'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import NextImage from 'next/image'
import {
  LayoutDashboard, Users, FileText, Mail, Image,
  ChevronRight, Settings, Download, Quote, Newspaper,
} from 'lucide-react'
import { hasPermission } from '@/lib/rbac/permissions'
import type { Permission } from '@/types/rbac'

const NAV: { label: string; href: string; icon: React.ElementType; permission: Permission | null }[] = [
  { label: 'Dashboard',     href: '/dashboard',              icon: LayoutDashboard, permission: null },
  { label: 'Applications',  href: '/dashboard/applications', icon: FileText,        permission: 'applications:read' },
  { label: 'Newsletter',    href: '/dashboard/newsletter',   icon: Mail,            permission: 'newsletter:read' },
  { label: 'News & Announcements', href: '/dashboard/media?context=news', icon: Newspaper,  permission: 'media:read' },
  { label: 'Testimonials',         href: '/dashboard/testimonials',       icon: Quote,      permission: 'testimonials:read' },
  { label: 'Media Library',        href: '/dashboard/media',              icon: Image,      permission: 'media:read' },
  { label: 'Download Center',      href: '/dashboard/downloads',          icon: Download,   permission: 'downloads:read' },
  { label: 'Users',           href: '/dashboard/users',      icon: Users,    permission: 'users:read' },
  { label: 'Settings',      href: '/dashboard/settings',     icon: Settings,        permission: null },
]

interface Props {
  role?: string
  onClose?: () => void
}

export default function Sidebar({ role, onClose }: Props) {
  const pathname = usePathname()

  const visibleNav = NAV.filter(
    ({ permission }) => !permission || hasPermission(role ?? '', permission),
  )

  return (
    <div className="flex flex-col h-full bg-blue-900 text-white w-64">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 shrink-0">
          <NextImage src="/logo.svg" alt="Kyanja Junior School logo" width={36} height={36} className="w-9 h-9 object-contain" />
        </div>
        <div>
          <p className="font-semibold text-sm leading-tight">Kyanja Junior</p>
          <p className="text-xs text-white/50">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleNav.map(({ label, href, icon: Icon }) => {
          const active = href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:text-white/80 transition-colors rounded-lg hover:bg-white/10"
        >
          View public site
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}