import type { Metadata } from 'next'
import { CheckCircle, MapPin, Phone, Mail } from 'lucide-react'
import AnimateOnScroll from '@/components/public/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Kyanja Junior School — our history, mission, values, and dedicated teachers. A trusted nursery and primary school in Kyanja, Kisaasi, Nakawa Division, Kampala, Uganda.',
  alternates: { canonical: 'https://www.kyanjajuniorschool.com/about' },
}

export default function AboutPage() {
  return (
    <div>
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <section
        className="text-white pt-24 pb-20 px-4 relative overflow-hidden -mt-16 z-0"
        style={{ background: "linear-gradient(to bottom, var(--brand-navy), var(--brand-deep))" }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546410531-bea5aad1334c?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Our Story
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            About Kyanja Junior School
          </h1>
          <p className="text-white/75 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Dedicated to shaping the leaders of tomorrow through holistic education and unwavering support.
          </p>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

          <AnimateOnScroll delay={0} className="h-full">
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-1 h-full">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: "var(--brand-ice)" }}
              >
                <CheckCircle className="w-7 h-7" style={{ color: "var(--brand-navy)" }} />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-brand-navy transition-colors">
                Our Mission
              </h2>
              <p className="text-slate-600 leading-relaxed text-[15px]">
                To provide a high quality, nurturing education that develops the whole child —
                academically, socially, emotionally and spiritually — equipping every learner
                with the skills and values needed to thrive in an ever-changing world.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100} className="h-full">
            <div
              className="rounded-[2rem] p-8 md:p-10 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden h-full"
              style={{ backgroundColor: "var(--brand-deep)" }}
            >
              <div
                className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[80px] pointer-events-none"
                style={{ backgroundColor: "rgba(90,165,255,0.15)" }}
              />
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <CheckCircle className="w-7 h-7" style={{ color: "var(--brand-sky)" }} />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-4 tracking-tight relative z-10">Our Vision</h2>
              <p className="text-white/70 leading-relaxed text-[15px] relative z-10">
                To be the leading primary school in Uganda, recognized for academic
                excellence, character development, and producing confident, compassionate,
                and globally-minded citizens.
              </p>
            </div>
          </AnimateOnScroll>

        </div>
      </section>

      {/* ── Core Values ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <span
                className="font-bold tracking-wider uppercase text-sm mb-2 block"
                style={{ color: "var(--brand-navy)" }}
              >
                What Drives Us
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-5 tracking-tight">
                Our Core Values
              </h2>
              <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: "var(--brand-gold)" }} />
            </div>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              'Excellence in all we do',
              'Integrity and honesty',
              'Respect for every individual',
              'Inclusivity and diversity',
              'Continuous learning and growth',
              'Community and collaboration',
              'Innovation and creativity',
              'Responsibility and discipline',
            ].map((value, index) => (
              <AnimateOnScroll key={value} delay={index * 60}>
                <div className="flex items-start gap-4 bg-white rounded-2xl px-6 py-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-ice hover:-translate-y-1 transition-all duration-300 group h-full">
                  <CheckCircle
                    className="w-5 h-5 shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                    style={{ color: "var(--brand-navy)" }}
                  />
                  <span className="text-slate-700 font-medium text-[15px] leading-snug group-hover:text-slate-900 transition-colors">{value}</span>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location / Map ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-5 tracking-tight">
                Visit Our Campus
              </h2>
              <div className="w-24 h-1 mx-auto rounded-full mb-6" style={{ backgroundColor: "var(--brand-gold)" }} />
              <p className="text-slate-500">We welcome parents and guardians to tour our facilities.</p>
            </div>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-12 gap-8 items-center bg-white rounded-[2rem] p-4 sm:p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="md:col-span-7 lg:col-span-8 rounded-[1.5rem] overflow-hidden border border-slate-100 h-64 md:h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127671.22324655321!2d32.598116!3d0.390349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177db1bbbd13cddb%3A0xaa3049ded079cb6c!2sKyanja%20Junior%20School!5e0!3m2!1sen!2sug!4v1771687402502!5m2!1sen!2sug"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kyanja Junior School Location"
                className="grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>

            <div className="md:col-span-5 lg:col-span-4 p-4 md:p-6 flex flex-col justify-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: "var(--brand-ice)" }}
              >
                <MapPin className="w-6 h-6" style={{ color: "var(--brand-navy)" }} />
              </div>
              <p className="font-display font-bold text-xl text-slate-900 mb-2">Kyanja Junior School</p>
              <div className="text-slate-600 text-[15px] space-y-1 mb-6">
                <p>500m from West Mall, Kyanja</p>
                <p>Plot 43a Katumba Zone</p>
                <p>Nakawa Division, Kampala</p>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-navy)" }} />
                  <div className="flex flex-col gap-1">
                    <a href="tel:+256772493267" className="font-semibold hover:opacity-70 transition-opacity text-[15px]" style={{ color: "var(--brand-navy)" }}>
                      +256 772 493 267
                    </a>
                    <a href="tel:+256702860382" className="font-semibold hover:opacity-70 transition-opacity text-[15px]" style={{ color: "var(--brand-navy)" }}>
                      +256 702 860 382
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: "var(--brand-navy)" }} />
                  <a href="mailto:admin@kjsch.com" className="font-semibold hover:opacity-70 transition-opacity text-[15px]" style={{ color: "var(--brand-navy)" }}>
                    admin@kjsch.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
