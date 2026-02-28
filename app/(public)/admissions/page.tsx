import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, FileText, Send, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'
import AnimateOnScroll from '@/components/public/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Admissions',
  description: 'Apply for admission to Kyanja Junior School for the 2025/2026 academic year.',
}

export default function AdmissionsPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-linear-to-b from-blue-900 via-blue-800 to-slate-900 text-white pt-24 pb-20 px-4 relative overflow-hidden -mt-16 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Join Our Family
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Admissions 2025/2026</h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
            Take the first step towards securing a bright future for your child at Kyanja Junior School.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-white/90 font-bold rounded-full px-8 h-14 shadow-xl active:scale-95 transition-all">
            <Link href="/admissions/apply">
              Start Your Application <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-b from-blue-50/50 to-transparent -skew-x-12 transform origin-top"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
                How to Apply
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Admission Process</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-3 gap-6 md:gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden sm:block absolute top-18 left-[10%] right-[10%] h-0.5 bg-slate-200 z-0"></div>

            {[
              { step: '01', icon: FileText, title: 'Submit Application', desc: 'Complete the online form with your child\'s details and parent/guardian information.' },
              { step: '02', icon: BookOpen,  title: 'Assessment',         desc: 'Your child may be invited for a brief assessment depending on the class applied for.' },
              { step: '03', icon: Send,      title: 'Decision',           desc: 'You will receive a decision by email within 5–10 working days of your submission.' },
            ].map(({ step, icon: Icon, title, desc }, index) => (
              <AnimateOnScroll key={step} delay={index * 120} className="h-full">
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative z-10 text-center group h-full">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500">
                    <Icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                  </div>
                  <div className="inline-block px-3 py-1 bg-slate-50 rounded-full text-xs font-bold text-blue-600 tracking-widest mb-4">STEP {step}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
                  <p className="text-slate-500 text-[15px] leading-relaxed">{desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-24 px-4 bg-white relative">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Requirements</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Completed online application form',
              'Child\'s birth certificate (copy)',
              'Recent passport photograph',
              'Previous school reports (P2 and above)',
              'National ID of parent/guardian',
              'Proof of residential address',
            ].map((req, index) => (
              <AnimateOnScroll key={req} delay={index * 80}>
                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl px-6 py-4 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors duration-300 group">
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

      {/* Fees note */}
      <section className="py-24 px-4 bg-slate-50">
        <AnimateOnScroll>
        <div className="max-w-3xl mx-auto text-center bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">School Fees & Payment Info</h2>
            <p className="text-slate-600 text-[15px] leading-relaxed mb-8 max-w-xl mx-auto">
              For complete transparency regarding school fees, term payments, and available bursaries for the upcoming academic year, please contact our admissions office directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-full h-12 px-8 font-semibold active:scale-95 transition-all">
                <Link href="mailto:admin@kjsch.com">Email Admissions</Link>
              </Button>
              <Button asChild className="bg-blue-900 hover:bg-blue-800 text-white rounded-full h-12 px-8 font-semibold shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                <Link href="/admissions/apply">Apply Online</Link>
              </Button>
            </div>
          </div>
        </div>
        </AnimateOnScroll>
      </section>
    </div>
  )
}
