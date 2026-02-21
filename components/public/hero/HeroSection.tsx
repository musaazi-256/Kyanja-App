'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  academicYear:  string
  /** Desktop/landscape background (lg+ screens). Falls back to mobileUrl if absent. */
  desktopUrl?: string
  /** Mobile/portrait background (below lg). Falls back to desktopUrl if absent. */
  mobileUrl?:  string
}

export default function HeroSection({ academicYear, desktopUrl, mobileUrl }: Props) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Tiny delay ensures the transition plays from the initial opacity-0 state.
    const t = setTimeout(() => setReady(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Returns Tailwind transition classes for staggered entrance.
  function enter(delay: 'delay-0' | 'delay-100' | 'delay-200' | 'delay-300') {
    return `transition-all duration-700 ease-out ${delay} ${
      ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
    }`
  }

  // Each breakpoint falls back to the other variant if its own URL is absent.
  const desktopSrc  = desktopUrl ?? mobileUrl
  const mobileSrc   = mobileUrl  ?? desktopUrl
  const hasAnyImage = !!(desktopSrc || mobileSrc)

  return (
    /**
     * Mobile:  flex-col — text block on top (order-1), image block below (order-2)
     * Desktop: relative block — image is absolute behind content, gradient fades left→right
     */
    <section className="flex flex-col lg:relative lg:block lg:min-h-[90vh] lg:overflow-hidden">

      {hasAnyImage && (
        <>
          {/* ── Mobile image: shown below text on small screens, hidden on lg+ ── */}
          <div className="relative h-[50vh] order-2 lg:hidden">
            <Image
              src={mobileSrc!}
              alt="Students learning at Kyanja Junior School"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>

          {/* ── Desktop image: full-cover absolute, right-aligned (lg+) ────────── */}
          <div className="hidden lg:block absolute inset-0">
            <Image
              src={desktopSrc!}
              alt="Students learning at Kyanja Junior School"
              fill
              priority
              className="object-cover object-top-right"
              sizes="100vw"
            />
          </div>

          {/* Gradient overlay: left dark → right transparent (desktop only) */}
          <div
            className="hidden lg:block absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, #1e3a5f 0%, #1e3a5f 38%, rgba(30,58,95,0.75) 60%, rgba(30,58,95,0.05) 100%)',
            }}
            aria-hidden
          />
        </>
      )}

      {/* ── Text content block ────────────────────────────────────────────────── */}
      {/*   Mobile: solid dark bg, min-h 50vh, stacked above image (order-1)      */}
      {/*   Desktop: transparent bg, min-h 90vh, overlaid on image via z-index    */}
      <div className="order-1 relative z-20 flex items-center bg-[#1e3a5f] lg:bg-transparent min-h-[50vh] lg:min-h-[90vh] px-6 py-16 lg:py-0">
        <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-xl">

            {/* Eyebrow */}
            <div className={enter('delay-0')}>
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white mb-6">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" aria-hidden />
                Enrolling for {academicYear} Academic Year
              </span>
            </div>

            {/* Headline */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 ${enter('delay-100')}`}>
              Nurturing Young Minds{' '}
              <span className="text-blue-300">for a Bright Future</span>
            </h1>

            {/* Supporting paragraph */}
            <p className={`text-lg text-white/80 leading-relaxed mb-10 ${enter('delay-200')}`}>
              Kyanja Junior School provides quality, holistic education in a safe and nurturing
              environment — developing confident, creative, and compassionate learners ready
              for tomorrow.
            </p>

            {/* CTAs */}
            <div className={`flex flex-col sm:flex-row gap-4 ${enter('delay-300')}`}>
              <Button
                asChild
                size="lg"
                className="bg-white text-[#1e3a5f] hover:bg-white/90 font-semibold hover:scale-[1.03] transition-transform duration-200"
              >
                <Link href="/admissions/apply">
                  Apply for Admission
                  <ArrowRight className="w-5 h-5 ml-2" aria-hidden />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:scale-[1.03] transition-transform duration-200"
              >
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}
