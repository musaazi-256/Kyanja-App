import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Palette, Dumbbell, Music, Globe, Calculator } from 'lucide-react'
import AnimateOnScroll from '@/components/public/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Programs & Academics',
  description: 'Explore the academic programs and extra-curricular activities at Kyanja Junior School.',
}

export default function ProgramsPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-linear-to-b from-blue-900 via-blue-800 to-slate-900 text-white pt-24 pb-20 px-4 relative overflow-hidden -mt-16 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Educational Journey
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Programs & Academics</h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            A comprehensive curriculum designed to develop every child at their own natural pace.
          </p>
        </div>
      </section>

      {/* Academic levels */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Academic Levels</h2>
          </AnimateOnScroll>
          <div className="space-y-6">
            {[
              {
                id:      'early-childhood',
                name:    'Early Childhood Department',
                classes: ['Baby Class', 'Middle Class', 'Top Class'],
                age:     'Ages 3–5',
                desc:    'Our early childhood programme lays a strong foundation through play-based learning, phonics, numeracy, and social development. Children are introduced to structured learning in a warm, supportive environment.',
                color:   'border-amber-200',
                bg:      'bg-amber-50',
                textColor: 'text-amber-700'
              },
              {
                id:      'lower-primary',
                name:    'Lower Primary',
                classes: ['Primary 1 (P1)', 'Primary 2 (P2)', 'Primary 3 (P3)', 'Primary 4 (P4)'],
                age:     'Ages 6–9',
                desc:    'Lower primary builds on foundational skills in Literacy, Numeracy, Science, Social Studies, and Religious Education. We emphasize reading, writing, and mathematical thinking through engaging, hands-on activities.',
                color:   'border-blue-200',
                bg:      'bg-blue-50',
                textColor: 'text-blue-700'
              },
              {
                id:      'upper-primary',
                name:    'Upper Primary',
                classes: ['Primary 5 (P5)', 'Primary 6 (P6)', 'Primary 7 (P7)'],
                age:     'Ages 10–13',
                desc:    'Upper primary prepares students for the Primary Leaving Examination (PLE) and secondary school. Core subjects are taught at greater depth, with structured revision programmes and mock examinations.',
                color:   'border-emerald-200',
                bg:      'bg-emerald-50',
                textColor: 'text-emerald-700'
              },
            ].map(({ id, name, classes, age, desc, color, bg, textColor }, index) => (
              <AnimateOnScroll key={name} delay={index * 100}>
              <div id={id} className="relative group bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className={`absolute top-0 left-0 w-2 h-full ${bg} ${color} border-l-4 group-hover:w-full group-hover:opacity-10 transition-all duration-500`}></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div>
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-3 ${bg} ${textColor} w-fit`}>
                      {age}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{name}</h3>
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

      {/* Subjects & Activities */}
      <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-linear-to-b from-blue-50/50 to-transparent skew-x-12 transform origin-top"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
                Beyond The Core
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Subjects & Activities</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: BookOpen,   title: 'English & Literacy',   desc: 'Reading, writing, comprehension, and oral expression.' },
              { icon: Calculator, title: 'Mathematics',           desc: 'Number sense, arithmetic, geometry, and problem-solving.' },
              { icon: Globe,      title: 'Science & SST',         desc: 'Discovery-based learning about the natural and social world.' },
              { icon: Palette,    title: 'Art & Craft',           desc: 'Creative expression through drawing, painting, and crafts.' },
              { icon: Music,      title: 'Music & Drama',         desc: 'Performance arts that build confidence and creativity.' },
              { icon: Dumbbell,   title: 'Physical Education',    desc: 'Sports, games, and physical fitness activities.' },
            ].map(({ icon: Icon, title, desc }, index) => (
              <AnimateOnScroll key={title} delay={index * 80} className="h-full">
                <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow duration-300 rounded-[1.5rem] overflow-hidden group h-full">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="text-[1.15rem] font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-[15px] leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <AnimateOnScroll>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Enrol Your Child Today</h2>
          <p className="text-slate-600 text-lg mb-8 max-w-xl mx-auto">Applications are now officially open for the 2025/2026 academic year.</p>
          <Button asChild size="lg" className="bg-blue-900 hover:bg-blue-800 font-bold rounded-full px-10 h-14 shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
            <Link href="/admissions/apply">Start Application</Link>
          </Button>
        </AnimateOnScroll>
      </section>
    </div>
  )
}
