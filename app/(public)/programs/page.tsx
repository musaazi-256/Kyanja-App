import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { BookOpen, Palette, Dumbbell, Music, Globe, Calculator, ArrowRight } from 'lucide-react'
import AnimateOnScroll from '@/components/public/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Programs & Academics',
  description: 'Explore the academic programs and extra-curricular activities at Kyanja Junior School.',
}

export default function ProgramsPage() {
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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Educational Journey
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Programs &amp; Academics
          </h1>
          <p className="text-white/75 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            A comprehensive curriculum designed to develop every child at their own natural pace.
          </p>
        </div>
      </section>

      {/* ── Academic levels ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <h2 className="font-display text-3xl font-bold text-slate-900 text-center mb-10 tracking-tight">
              Academic Levels
            </h2>
          </AnimateOnScroll>
          <div className="space-y-6">
            {[
              {
                id:        'early-childhood',
                name:      'Early Childhood Department',
                classes:   ['Baby Class', 'Middle Class', 'Top Class'],
                age:       'Ages 3–5',
                desc:      'Our early childhood programme lays a strong foundation through play-based learning, phonics, numeracy, and social development. Children are introduced to structured learning in a warm, supportive environment.',
                borderClass: 'border-amber-200',
                bgClass:     'bg-amber-50',
                textClass:   'text-amber-700',
              },
              {
                id:        'lower-primary',
                name:      'Lower Primary',
                classes:   ['Primary 1 (P1)', 'Primary 2 (P2)', 'Primary 3 (P3)', 'Primary 4 (P4)'],
                age:       'Ages 6–9',
                desc:      'Lower primary builds on foundational skills in Literacy, Numeracy, Science, Social Studies, and Religious Education. We emphasize reading, writing, and mathematical thinking through engaging, hands-on activities.',
                borderClass: 'border-brand-ice',
                bgClass:     'bg-brand-ice',
                textClass:   'text-brand-navy',
              },
              {
                id:        'upper-primary',
                name:      'Upper Primary',
                classes:   ['Primary 5 (P5)', 'Primary 6 (P6)', 'Primary 7 (P7)'],
                age:       'Ages 10–13',
                desc:      'Upper primary prepares students for the Primary Leaving Examination (PLE) and secondary school. Core subjects are taught at greater depth, with structured revision programmes and mock examinations.',
                borderClass: 'border-emerald-200',
                bgClass:     'bg-emerald-50',
                textClass:   'text-emerald-700',
              },
            ].map(({ id, name, classes, age, desc, borderClass, bgClass, textClass }, index) => (
              <AnimateOnScroll key={name} delay={index * 100}>
                <div
                  id={id}
                  className="relative group bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-2 h-full ${bgClass} ${borderClass} border-l-4 group-hover:w-full group-hover:opacity-10 transition-all duration-500`} />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <div>
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-3 ${bgClass} ${textClass} w-fit`}>
                        {age}
                      </div>
                      <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight">{name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 max-w-sm justify-start md:justify-end">
                      {classes.map((c) => (
                        <span key={c} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[13px] font-semibold text-slate-600 shadow-sm">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="relative z-10 text-slate-600 leading-relaxed text-[15px]">{desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subjects & Activities ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <span
                className="font-bold tracking-wider uppercase text-sm mb-2 block"
                style={{ color: "var(--brand-navy)" }}
              >
                Beyond The Core
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-5 tracking-tight">
                Subjects &amp; Activities
              </h2>
              <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: "var(--brand-gold)" }} />
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: BookOpen,   title: 'English & Literacy',  desc: 'Reading, writing, comprehension, and oral expression.' },
              { icon: Calculator, title: 'Mathematics',          desc: 'Number sense, arithmetic, geometry, and problem-solving.' },
              { icon: Globe,      title: 'Science & SST',        desc: 'Discovery-based learning about the natural and social world.' },
              { icon: Palette,    title: 'Art & Craft',          desc: 'Creative expression through drawing, painting, and crafts.' },
              { icon: Music,      title: 'Music & Drama',        desc: 'Performance arts that build confidence and creativity.' },
              { icon: Dumbbell,   title: 'Physical Education',   desc: 'Sports, games, and physical fitness activities.' },
            ].map(({ icon: Icon, title, desc }, index) => (
              <AnimateOnScroll key={title} delay={index * 80} className="h-full">
                <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow duration-300 rounded-[1.5rem] overflow-hidden group h-full">
                  <CardContent className="p-8">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: "var(--brand-ice)" }}
                    >
                      <Icon className="w-7 h-7" style={{ color: "var(--brand-navy)" }} />
                    </div>
                    <h3 className="font-display text-[1.1rem] font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-[15px] leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enrol CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 text-center">
        <AnimateOnScroll>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Enrol Your Child Today
          </h2>
          <p className="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
            Applications are now officially open for the {academicYear} academic year.
          </p>
          <Link
            href="/admissions/apply"
            className="inline-flex items-center font-display font-bold py-4 px-10 rounded-full transition-all duration-200 hover:scale-105 hover:brightness-105 active:scale-95"
            style={{ backgroundColor: "var(--brand-navy)", color: "white" }}
          >
            Start Application <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </AnimateOnScroll>
      </section>
    </div>
  )
}
