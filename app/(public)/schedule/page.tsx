import type { Metadata } from 'next'
import { Calendar, Clock } from 'lucide-react'
import { fetchCalendarEvents, type CalendarEvent } from '@/lib/calendar/fetch'
import SchoolCalendar from '@/components/public/SchoolCalendar'

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
  const currentMonth = today.getMonth() + 1 // 1-indexed

  // Fetch upcoming events for "Highlights" and current-month events for the calendar in parallel
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
  const monthEnd   = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const [events, calendarEvents] = await Promise.all([
    fetchCalendarEvents(),
    fetchCalendarEvents({ timeMin: monthStart, timeMax: monthEnd, maxResults: 50 }),
  ])

  return (
    <div>
      {/* Header */}
      <section className="bg-linear-to-b from-blue-900 via-blue-800 to-slate-900 text-white pt-24 pb-20 px-4 relative overflow-hidden -mt-16 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Stay Updated
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">School Schedule</h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Upcoming events, important dates, and the academic calendar for Kyanja Junior School.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-b from-blue-50/50 to-transparent -skew-x-12 transform origin-top"></div>
        <div className="max-w-6xl mx-auto space-y-20 relative z-10">

          {/* ── Custom School Calendar ───────────────────────────── */}
          <div>
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Interactive Calendar</h2>
              <div className="w-16 h-1 bg-blue-500 rounded-full mt-4"></div>
            </div>

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

          {/* ── Term dates ─────────────────────────────────────── */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{currentYear} Term Dates</h2>
              <div className="w-16 h-1 bg-emerald-500 rounded-full mt-4"></div>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { term: 'Term 1', dates: 'To be announced', color: 'blue' },
                { term: 'Term 2', dates: 'To be announced', color: 'emerald' },
                { term: 'Term 3', dates: 'To be announced', color: 'amber' },
              ].map(({ term, dates, color }) => (
                <div key={term} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group">
                  <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 bg-${color}-50 text-${color}-600`}>
                    {term}
                  </div>
                  <p className="text-slate-500 text-[15px] font-medium">{dates}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Upcoming events (API-powered, when API key is set) ── */}
          {events.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Upcoming Highlights</h2>
                <div className="w-16 h-1 bg-amber-500 rounded-full mt-4"></div>
              </div>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id ?? `${event.summary}-${event.start?.date}`}
                    className="bg-white border border-slate-100 rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex gap-6 group items-center"
                  >
                    <div className="shrink-0 w-2 h-16 rounded-full bg-blue-100 group-hover:bg-blue-500 transition-colors duration-300" />
                    <div className="min-w-0 grow">
                      <p className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{event.summary ?? 'School Event'}</p>
                      <div className="flex items-center gap-4 text-[14px] text-slate-500">
                        <span className="flex items-center font-medium text-blue-600/80"><Calendar className="w-4 h-4 mr-1.5" /> {formatEventDate(event)}</span>
                        {event.location && (
                          <span className="hidden sm:flex items-center"><div className="w-1 h-1 rounded-full bg-slate-300 mx-2"></div> {event.location}</span>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-[15px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
