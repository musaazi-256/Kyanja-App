import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Users, Star, ArrowRight, GraduationCap, Heart, Globe } from 'lucide-react'
import HeroSection from '@/components/public/hero/HeroSection'
import { getSetting } from '@/lib/db/settings'

export default async function HomePage() {
  const year = new Date().getFullYear()
  const startYear = new Date().getMonth() >= 7 ? year : year - 1
  const academicYear = `${startYear}/${startYear + 1}`

  // Fetch variant-specific hero URLs in parallel; fall back to legacy single key.
  const [heroDesktop, heroMobile, heroLegacy] = await Promise.all([
    getSetting('hero_image_url_desktop'),
    getSetting('hero_image_url_mobile'),
    getSetting('hero_image_url'),
  ])

  const desktopUrl = heroDesktop || heroLegacy || undefined
  const mobileUrl  = heroMobile  || heroLegacy || undefined

  return (
    <div>
      {/* Hero */}
      <HeroSection academicYear={academicYear} desktopUrl={desktopUrl} mobileUrl={mobileUrl} />

      {/* Stats bar */}
      <section className="bg-[#16305a] text-white py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '500+', label: 'Students Enrolled' },
            { value: '40+',  label: 'Qualified Teachers' },
            { value: '20+',  label: 'Years of Excellence' },
            { value: '98%',  label: 'Promotion Rate' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-blue-300">{value}</p>
              <p className="text-white/60 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Kyanja Junior School?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              We believe every child has unique potential. Our environment is designed to help them discover and develop it.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen,      title: 'Quality Curriculum',     desc: 'Uganda National Curriculum implemented by experienced, passionate educators dedicated to academic excellence.' },
              { icon: Heart,         title: 'Holistic Development',   desc: 'We nurture emotional intelligence, creativity, and social skills alongside academics.' },
              { icon: Users,         title: 'Small Class Sizes',      desc: 'Smaller classes mean more individual attention and a stronger teacher-student relationship.' },
              { icon: GraduationCap, title: 'Experienced Staff',      desc: 'Our qualified and dedicated teachers bring years of experience in early and primary education.' },
              { icon: Globe,         title: 'Safe Environment',       desc: 'A secure, child-friendly campus where students feel safe, valued and inspired to learn.' },
              { icon: Star,          title: 'Proven Track Record',    desc: 'Consistently strong academic results with many alumni excelling in top secondary schools.' },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#1e3a5f]" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs preview */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Programs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'Early Childhood',  desc: 'Baby Class to Top Class', age: 'Ages 3–5', color: 'bg-amber-50 border-amber-200' },
              { name: 'Lower Primary',    desc: 'Primary 1 to Primary 4',  age: 'Ages 6–9', color: 'bg-blue-50 border-blue-200' },
              { name: 'Upper Primary',    desc: 'Primary 5 to Primary 7',  age: 'Ages 10–13', color: 'bg-green-50 border-green-200' },
            ].map(({ name, desc, age, color }) => (
              <div key={name} className={`p-6 rounded-2xl border ${color}`}>
                <h3 className="text-lg font-bold text-slate-900">{name}</h3>
                <p className="text-slate-600 mt-1">{desc}</p>
                <p className="text-sm text-slate-400 mt-2">{age}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/programs">View All Programs <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#1e3a5f] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Kyanja Family?</h2>
          <p className="text-white/70 mb-8">
            Applications for {academicYear} are now open. Secure your child&apos;s place today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#1e3a5f] hover:bg-white/90 font-semibold">
              <Link href="/admissions/apply">Start Application</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link href="/admissions">Learn About Admissions</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
