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
      <section className="bg-[#1e3a5f] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">About Kyanja Junior School</h1>
          <p className="text-white/70 text-lg">Dedicated to shaping the leaders of tomorrow</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              To provide a high quality, nurturing education that develops the whole child —
              academically, socially, emotionally and spiritually — equipping every learner
              with the skills and values needed to thrive in an ever-changing world.
            </p>
          </div>
          <div className="bg-green-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed">
              To be the leading primary school in Uganda, recognized for academic
              excellence, character development, and producing confident, compassionate,
              and globally-minded citizens.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 gap-4">
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
              <div key={value} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm">
                <CheckCircle className="w-5 h-5 text-[#1e3a5f] shrink-0" />
                <span className="text-slate-700">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location / Google Maps */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Find Us</h2>
          <div className="rounded-2xl overflow-hidden shadow-lg border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127671.22324655321!2d32.598116!3d0.390349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177db1bbbd13cddb%3A0xaa3049ded079cb6c!2sKyanja%20Junior%20School!5e0!3m2!1sen!2sug!4v1771687402502!5m2!1sen!2sug"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kyanja Junior School Location"
            />
          </div>
          <div className="mt-6 text-center text-slate-600">
            <p className="font-semibold text-slate-900">Kyanja Junior School</p>
            <p>500 M from West Mall, Kyanja</p>
            <p>Plot 43a Katumba Zone-Kyanja Nakawa Division</p>
            <p className="mt-1">
              <a href="tel:+256772493267" className="text-[#1e3a5f] hover:underline">+256 772 493 267</a>
              {' · '}
              <a href="tel:+256702860382" className="text-[#1e3a5f] hover:underline">+256 702 860 382</a>
              {' · '}
              <a href="tel:+256792171850" className="text-[#1e3a5f] hover:underline">+256 792 171 850</a>
              {' · '}
              <a href="mailto:admin@kjsch.com" className="text-[#1e3a5f] hover:underline">
                admin@kjsch.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
