import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Palette, Dumbbell, Music, Globe, Calculator } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Programs & Academics',
  description: 'Explore the academic programs and extra-curricular activities at Kyanja Junior School.',
}

export default function ProgramsPage() {
  return (
    <div>
      <section className="bg-[#1e3a5f] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Programs & Academics</h1>
          <p className="text-white/70 text-lg">
            A comprehensive curriculum designed to develop every child
          </p>
        </div>
      </section>

      {/* Academic levels */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Academic Levels</h2>
          <div className="space-y-6">
            {[
              {
                name:    'Early Childhood Department',
                classes: ['Baby Class', 'Middle Class', 'Top Class'],
                age:     'Ages 3–5',
                desc:    'Our early childhood programme lays a strong foundation through play-based learning, phonics, numeracy, and social development. Children are introduced to structured learning in a warm, supportive environment.',
                color:   'border-amber-400',
                bg:      'bg-amber-50',
              },
              {
                name:    'Lower Primary',
                classes: ['Primary 1 (P1)', 'Primary 2 (P2)', 'Primary 3 (P3)', 'Primary 4 (P4)'],
                age:     'Ages 6–9',
                desc:    'Lower primary builds on foundational skills in Literacy, Numeracy, Science, Social Studies, and Religious Education. We emphasize reading, writing, and mathematical thinking through engaging, hands-on activities.',
                color:   'border-blue-400',
                bg:      'bg-blue-50',
              },
              {
                name:    'Upper Primary',
                classes: ['Primary 5 (P5)', 'Primary 6 (P6)', 'Primary 7 (P7)'],
                age:     'Ages 10–13',
                desc:    'Upper primary prepares students for the Primary Leaving Examination (PLE) and secondary school. Core subjects are taught at greater depth, with structured revision programmes and mock examinations.',
                color:   'border-green-400',
                bg:      'bg-green-50',
              },
            ].map(({ name, classes, age, desc, color, bg }) => (
              <div key={name} className={`rounded-2xl border-l-4 ${color} ${bg} p-8`}>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                    <p className="text-slate-500 mt-0.5">{age}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {classes.map((c) => (
                      <span key={c} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-slate-700 shadow-sm">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects & Activities */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Subjects & Activities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen,   title: 'English & Literacy',   desc: 'Reading, writing, comprehension, and oral expression.' },
              { icon: Calculator, title: 'Mathematics',           desc: 'Number sense, arithmetic, geometry, and problem-solving.' },
              { icon: Globe,      title: 'Science & SST',         desc: 'Discovery-based learning about the natural and social world.' },
              { icon: Palette,    title: 'Art & Craft',           desc: 'Creative expression through drawing, painting, and crafts.' },
              { icon: Music,      title: 'Music & Drama',         desc: 'Performance arts that build confidence and creativity.' },
              { icon: Dumbbell,   title: 'Physical Education',    desc: 'Sports, games, and physical fitness activities.' },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[#1e3a5f]" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Enrol Your Child Today</h2>
        <p className="text-slate-500 mb-6">Applications are open for the 2025/2026 academic year.</p>
        <Button asChild className="bg-[#1e3a5f] hover:bg-[#16305a]">
          <Link href="/admissions/apply">Apply Now</Link>
        </Button>
      </section>
    </div>
  )
}
