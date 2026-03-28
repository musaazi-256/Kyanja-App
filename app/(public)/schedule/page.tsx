import type { Metadata } from 'next'
import { Calendar, Clock } from 'lucide-react'
import { fetchCalendarEvents, type CalendarEvent } from '@/lib/calendar/fetch'
import SchoolCalendar from '@/components/public/SchoolCalendar'
import AnimateOnScroll from '@/components/public/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'School Schedule',
  description: 'View upcoming school events and the academic calendar for Kyanja Junior School.',
}

function formatEventDate(event: CalendarEvent): string {
  const dateValue = event.start?.dateTime ?? event.start?.date
  if (!dateValue) return 'Date TBA'
  const d = new Date(dateValue)
  return event.start?.dateTime
    ? d.toLocaleString('en-UG', { dateStyle: 'medium', timeStyle: 'short' })
    : d.toLocaleDateString('en-UG', { dateStyle: 'long' })
}

export default async function SchedulePage() {
  const today        = new Date()
  const currentYear  = today.getFullYear()
  const currentMonth = today.getMonth() + 1

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
  const monthEnd   = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const [events, calendarEvents] = await Promise.all([
    fetchCalendarEvents(),
    fetchCalendarEvents({ timeMin: monthStart, timeMax: monthEnd, maxResults: 50 }),
  ])

  return (
    <div>
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <section
        className="text-white pt-24 pb-20 px-4 relative overflow-hidden -mt-16 z-0"
        style={{ background: "linear-gradient(to bottom, var(--brand-navy), var(--brand-deep))" }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Stay Updated
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight">School Schedule</h1>
          <p className="text-white/75 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Upcoming events, important dates, and the academic calendar for Kyanja Junior School.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-20">

          {/* ── Interactive Calendar ─────────────────────────────────────────── */}
          <div>
            <AnimateOnScroll>
              <div className="flex flex-col items-center text-center mb-10">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "var(--brand-ice)" }}
                >
                  <Calendar className="w-7 h-7" style={{ color: "var(--brand-navy)" }} />
                </div>
                <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
                  Interactive Calendar
                </h2>
                <div className="w-24 h-1 rounded-full mt-4" style={{ backgroundColor: "var(--brand-gold)" }} />
              </div>
            </AnimateOnScroll>

            <div className="max-w-2xl mx-auto">
              <SchoolCalendar
                initialEvents={calendarEvents}
                initialYear={currentYear}
                initialMonth={currentMonth}
              />
            </div>
            <p className="text-[13px] font-medium text-slate-400 mt-4 text-center tracking-wide uppercase">
              Powered by Google Calendar · Times shown in East Africa Time (EAT)
            </p>
          </div>

          {/* ── Term dates ───────────────────────────────────────────────────── */}
          <div className="max-w-4xl mx-auto">
            <AnimateOnScroll>
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                  <Clock className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
                  {currentYear} Term Dates
                </h2>
                <div className="w-24 h-1 bg-emerald-500 rounded-full mt-4" />
              </div>
            </AnimateOnScroll>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { term: 'Term 1', dates: 'To be announced', badgeClass: 'bg-brand-ice text-brand-navy' },
                { term: 'Term 2', dates: 'To be announced', badgeClass: 'bg-emerald-50 text-emerald-600' },
                { term: 'Term 3', dates: 'To be announced', badgeClass: 'bg-amber-50 text-amber-600' },
              ].map(({ term, dates, badgeClass }, index) => (
                <AnimateOnScroll key={term} delay={index * 100}>
                  <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group">
                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 ${badgeClass}`}>
                      {term}
                    </div>
                    <p className="text-slate-500 text-[15px] font-medium">{dates}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>

          {/* ── Upcoming events ──────────────────────────────────────────────── */}
          {events.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll>
                <div className="flex flex-col items-center text-center mb-10">
                  <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
                    Upcoming Highlights
                  </h2>
                  <div className="w-24 h-1 rounded-full mt-4" style={{ backgroundColor: "var(--brand-gold)" }} />
                </div>
              </AnimateOnScroll>
              <div className="space-y-4">
                {events.map((event, index) => (
                  <AnimateOnScroll key={event.id ?? `${event.summary}-${event.start?.date}`} delay={index * 60}>
                    <div className="bg-white border border-slate-100 rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex gap-6 group items-center">
                      <div
                        className="shrink-0 w-2 h-16 rounded-full transition-colors duration-300"
                        style={{ backgroundColor: "var(--brand-ice)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--brand-navy)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--brand-ice)")}
                      />
                      <div className="min-w-0 grow">
                        <p className="font-display font-bold text-lg text-slate-900 mb-1 group-hover:text-brand-navy transition-colors">
                          {event.summary ?? 'School Event'}
                        </p>
                        <div className="flex items-center gap-4 text-[14px] text-slate-500">
                          <span className="flex items-center font-medium" style={{ color: "var(--brand-navy)" }}>
                            <Calendar className="w-4 h-4 mr-1.5" /> {formatEventDate(event)}
                          </span>
                          {event.location && (
                            <span className="hidden sm:flex items-center">
                              <div className="w-1 h-1 rounded-full bg-slate-300 mx-2" />
                              {event.location}
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-[15px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
