import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white text-slate-900 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 shrink-0">
                <Image src="/logo.svg" alt="Kyanja Junior School logo" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
              <span className="font-bold text-xl tracking-tight">Kyanja Junior School</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Nurturing young minds with quality education in a safe, dynamic, and
              supportive environment since our founding.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'About Us',     href: '/about' },
                { label: 'Programs',     href: '/programs' },
                { label: 'Gallery',      href: '/gallery' },
                { label: 'School Schedule', href: '/schedule' },
                { label: 'Admissions',   href: '/admissions' },
                { label: 'Newsletter',   href: '/newsletter/subscribe' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-500 hover:text-slate-900 text-sm transition-all duration-300 inline-block hover:-translate-y-0.5 relative group">
                    {label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-slate-500 text-sm group cursor-default">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <span className="leading-relaxed pt-1">
                  500m from West Mall, Kyanja<br />
                  Plot 43a Katumba Zone<br />
                  Nakawa Division
                </span>
              </li>
              <li className="flex items-start gap-4 text-slate-500 text-sm group">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <span className="space-y-2 pt-1 flex flex-col">
                  <a href="tel:+256772493267" className="hover:text-slate-900 transition-all hover:-translate-y-0.5">+256 772 493 267</a>
                  <a href="tel:+256702860382" className="hover:text-slate-900 transition-all hover:-translate-y-0.5">+256 702 860 382</a>
                  <a href="tel:+256792171850" className="hover:text-slate-900 transition-all hover:-translate-y-0.5">+256 792 171 850</a>
                </span>
              </li>
              <li className="flex items-center gap-4 text-slate-500 text-sm group">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <a href="mailto:admin@kjsch.com" className="hover:text-slate-900 transition-all hover:-translate-y-0.5">
                  admin@kjsch.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-[13px]">
          <p>© {new Date().getFullYear()} Kyanja Junior School. All rights reserved.</p>
          <Link href="/auth/login" className="px-4 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 hover:text-slate-700 transition-all">
            Staff Portal
          </Link>
        </div>
      </div>
    </footer>
  )
}
