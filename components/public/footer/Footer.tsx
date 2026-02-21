import Link from 'next/link'
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Kyanja Junior School</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Nurturing young minds with quality education in a safe and
              supportive environment since our founding.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-white/80">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'About Us',     href: '/about' },
                { label: 'Programs',     href: '/programs' },
                { label: 'Gallery',      href: '/gallery' },
                { label: 'School Schedule', href: '/schedule' },
                { label: 'Admissions',   href: '/admissions' },
                { label: 'Newsletter',   href: '/newsletter/subscribe' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-white/80">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-white/40" />
                <span>
                  500 M from West Mall, Kyanja<br />
                  Plot 43a Katumba Zone-Kyanja Nakawa Division
                </span>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Phone className="w-4 h-4 shrink-0 text-white/40" />
                <span className="space-y-1">
                  <a href="tel:+256772493267" className="block hover:text-white transition-colors">+256 772 493 267</a>
                  <a href="tel:+256702860382" className="block hover:text-white transition-colors">+256 702 860 382</a>
                  <a href="tel:+256792171850" className="block hover:text-white transition-colors">+256 792 171 850</a>
                </span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail className="w-4 h-4 shrink-0 text-white/40" />
                <a href="mailto:admin@kjsch.com" className="hover:text-white transition-colors">
                  admin@kjsch.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/40 text-xs">
          <p>© {new Date().getFullYear()} Kyanja Junior School. All rights reserved.</p>
          <Link href="/auth/login" className="hover:text-white/70 transition-colors">
            Staff Portal
          </Link>
        </div>
      </div>
    </footer>
  )
}
