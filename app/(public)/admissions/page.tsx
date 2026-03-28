import Link from 'next/link'
import { CheckCircle, ArrowRight, FileText, Send, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'
import AnimateOnScroll from '@/components/public/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Admissions',
  description: 'Apply for admission to Kyanja Junior School.',
}

export default function AdmissionsPage() {
  const year = new Date().getFullYear()
  const startYear = new Date().getMonth() >= 7 ? year : year - 1
  const academicYear = `${startYear}/${startYear + 1}`

  return (
    <div>
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <section
        className="text-white pt-24 pb-20 px-4 relative overflow-hidden -mt-16 z-0"
        style={{ background: "linear-gradient(to bottom, var(--brand-navy), var(--brand-deep))" }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Join Our Family
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Admissions {academicYear}
          </h1>
          <p className="text-white/75 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
            Take the first step towards securing a bright future for your child at Kyanja Junior School.
          </p>
          <Link
            href="/admissions/apply"
            className="inline-flex items-center font-display font-bold py-3.5 px-8 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: "var(--brand-gold)", color: "var(--brand-navy)" }}
          >
            Start Your Application <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* ── Admission Process ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <span
                className="font-bold tracking-wider uppercase text-sm mb-2 block"
                style={{ color: "var(--brand-navy)" }}
              >
                How to Apply
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-5 tracking-tight">
                Admission Process
              </h2>
              <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: "var(--brand-gold)" }} />
            </div>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-3 gap-6 md:gap-8 relative">
            {/* Connecting line — desktop only */}
            <div className="hidden sm:block absolute top-18 left-[10%] right-[10%] h-0.5 bg-slate-200 z-0" />

            {[
              { step: '01', icon: FileText, title: 'Submit Application', desc: "Complete the online form with your child's details and parent/guardian information." },
              { step: '02', icon: BookOpen,  title: 'Assessment',         desc: 'Your child may be invited for a brief assessment depending on the class applied for.' },
              { step: '03', icon: Send,      title: 'Decision',           desc: 'You will receive a decision by email within 5–10 working days of your submission.' },
            ].map(({ step, icon: Icon, title, desc }, index) => (
              <AnimateOnScroll key={step} delay={index * 120} className="h-full">
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative z-10 text-center group h-full">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500"
                    style={{ backgroundColor: "var(--brand-ice)" }}
                  >
                    <Icon
                      className="w-8 h-8 transition-colors duration-500"
                      style={{ color: "var(--brand-navy)" }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-4"
                    style={{ backgroundColor: "var(--brand-ice)", color: "var(--brand-navy)" }}
                  >
                    STEP {step}
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-navy transition-colors">{title}</h3>
                  <p className="text-slate-500 text-[15px] leading-relaxed">{desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Requirements ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-5 tracking-tight">
                Requirements
              </h2>
              <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: "var(--brand-gold)" }} />
            </div>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Completed online application form",
              "Child's birth certificate (copy)",
              "Recent passport photograph",
              "Previous school reports (P2 and above)",
              "National ID of parent/guardian",
              "Proof of residential address",
            ].map((req, index) => (
              <AnimateOnScroll key={req} delay={index * 80}>
                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl px-6 py-4 border border-slate-100 hover:border-brand-ice hover:bg-brand-ice/40 transition-colors duration-300 group">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-slate-700 font-medium text-[15px]">{req}</span>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fees note ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto text-center bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(135deg, rgba(232,240,255,0.5) 0%, transparent 60%)" }}
            />
            <div className="relative z-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                School Fees &amp; Payment Info
              </h2>
              <p className="text-slate-500 text-[15px] leading-relaxed mb-8 max-w-xl mx-auto">
                For complete transparency regarding school fees, term payments, and available bursaries
                for the upcoming academic year, please contact our admissions office directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="mailto:admin@kjsch.com"
                  className="inline-flex items-center justify-center font-semibold py-3 px-8 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-brand-navy active:scale-95 transition-all"
                >
                  Email Admissions
                </Link>
                <Link
                  href="/admissions/apply"
                  className="inline-flex items-center justify-center font-display font-bold py-3 px-8 rounded-full transition-all duration-200 hover:scale-105 hover:brightness-105 active:scale-95"
                  style={{ backgroundColor: "var(--brand-navy)", color: "white" }}
                >
                  Apply Online
                </Link>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  )
}
