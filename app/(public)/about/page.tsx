import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Kyanja Junior School — our history, mission, and values.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-linear-to-b from-blue-900 via-blue-800 to-slate-900 text-white pt-24 pb-20 px-4 relative overflow-hidden -mt-16 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546410531-bea5aad1334c?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">About Kyanja Junior School</h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Dedicated to shaping the leaders of tomorrow through holistic education and unwavering support.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 relative">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 relative z-10">
          
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed text-[15px]">
              To provide a high quality, nurturing education that develops the whole child —
              academically, socially, emotionally and spiritually — equipping every learner
              with the skills and values needed to thrive in an ever-changing world.
            </p>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 border border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
              <CheckCircle className="w-7 h-7 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight relative z-10">Our Vision</h2>
            <p className="text-slate-300 leading-relaxed text-[15px] relative z-10">
              To be the leading primary school in Uganda, recognized for academic
              excellence, character development, and producing confident, compassionate,
              and globally-minded citizens.
            </p>
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
          </div>

        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-b from-blue-50/50 to-transparent -skew-x-12 transform origin-top"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
              What Drives Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Our Core Values</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>
          
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
            ].map((value) => (
              <div key={value} className="flex items-start gap-4 bg-white rounded-2xl px-6 py-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 group">
                <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-slate-700 font-medium text-[15px] leading-snug group-hover:text-slate-900 transition-colors">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location / Google Maps */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Visit Our Campus</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600">We welcome parents and guardians to tour our facilities.</p>
          </div>
          
          <div className="grid md:grid-cols-12 gap-8 items-center bg-white rounded-[2rem] p-4 sm:p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="md:col-span-7 lg:col-span-8 rounded-[1.5rem] overflow-hidden shadow-inner border border-slate-100 h-64 md:h-[400px]">
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
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <p className="font-bold text-xl text-slate-900 mb-2">Kyanja Junior School</p>
              <div className="text-slate-600 text-[15px] space-y-1 mb-6">
                <p>500m from West Mall, Kyanja</p>
                <p>Plot 43a Katumba Zone</p>
                <p>Nakawa Division, Kampala</p>
              </div>
              
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase text-slate-400 w-12">Tel</span>
                  <div className="flex flex-col gap-1">
                    <a href="tel:+256772493267" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors text-[15px]">+256 772 493 267</a>
                    <a href="tel:+256702860382" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors text-[15px]">+256 702 860 382</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-bold uppercase text-slate-400 w-12">Email</span>
                  <a href="mailto:admin@kjsch.com" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors text-[15px]">
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
