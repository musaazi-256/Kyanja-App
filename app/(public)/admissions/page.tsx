import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, FileText, Send, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admissions',
  description: 'Apply for admission to Kyanja Junior School for the 2025/2026 academic year.',
}

export default function AdmissionsPage() {
  return (
    <div>
      <section className="bg-[#1e3a5f] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Admissions 2025/2026</h1>
          <p className="text-white/70 text-lg">Join the Kyanja Junior School family</p>
          <Button asChild size="lg" className="mt-8 bg-white text-[#1e3a5f] hover:bg-white/90 font-semibold">
            <Link href="/admissions/apply">
              Start Your Application <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Admission Process</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '01', icon: FileText, title: 'Submit Application', desc: 'Complete the online form with your child\'s details and parent/guardian information.' },
              { step: '02', icon: BookOpen,  title: 'Assessment',         desc: 'Your child may be invited for a brief assessment depending on the class applied for.' },
              { step: '03', icon: Send,      title: 'Decision',           desc: 'You will receive a decision by email within 5–10 working days of your submission.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 bg-[#1e3a5f]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-[#1e3a5f]" />
                </div>
                <div className="text-xs font-bold text-[#1e3a5f] mb-2">STEP {step}</div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Requirements</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Completed online application form',
              'Child\'s birth certificate (copy)',
              'Recent passport photograph',
              'Previous school reports (P2 and above)',
              'National ID of parent/guardian',
              'Proof of residential address',
            ].map((req) => (
              <div key={req} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-slate-700 text-sm">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fees note */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center bg-blue-50 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">School Fees</h2>
          <p className="text-slate-600 mb-6">
            For information on school fees, term payments, and available bursaries, please contact
            our admissions office directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="mailto:admin@kjsch.com">Email Admissions Office</Link>
            </Button>
            <Button asChild className="bg-[#1e3a5f] hover:bg-[#16305a]">
              <Link href="/admissions/apply">Apply Online</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
