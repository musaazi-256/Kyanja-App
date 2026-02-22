import type { Metadata } from 'next'
import { Calendar, Clock } from 'lucide-react'
import { fetchCalendarEvents, type CalendarEvent } from '@/lib/calendar/fetch'

export const metadata: Metadata = {
  title: 'School Schedule',
  description: 'View upcoming school events and the academic calendar for Kyanja Junior School.',
}

// Calendar ID for the Google Calendar embed iframe.
const SCHOOL_CALENDAR_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID ?? 'staffkyanjajunior@gmail.com'

function formatEventDate(event: CalendarEvent): string {
  const dateValue = event.start?.dateTime ?? event.start?.date
  if (!dateValue) return 'Date TBA'
  const d = new Date(dateValue)
  return event.start?.dateTime
    ? d.toLocaleString('en-UG', { dateStyle: 'medium', timeStyle: 'short' })
    : d.toLocaleDateString('en-UG', { dateStyle: 'long' })
}

export default async function SchedulePage() {
  const events      = await fetchCalendarEvents()
  const currentYear = new Date().getFullYear()

  const calendarBase =
    `https://calendar.google.com/calendar/embed` +
    `?src=${encodeURIComponent(SCHOOL_CALENDAR_ID)}` +
    `&ctz=Africa%2FKampala` +
    `&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0`

  // Desktop: full month grid
  const calendarMonthSrc  = calendarBase + `&mode=MONTH`
  // Mobile: agenda / schedule list view
  const calendarAgendaSrc = calendarBase + `&mode=AGENDA`

  return (
    <div>
      {/* Header */}
      <section className="bg-[#1e3a5f] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">School Schedule</h1>
          <p className="text-white/70">Upcoming events and term dates for Kyanja Junior School</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-14">

          {/* ── Google Calendar embed ───────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#1e3a5f]" />
              <h2 className="text-2xl font-bold text-slate-900">School Calendar</h2>
            </div>
            {/* Mobile: agenda/schedule list view */}
            <div className="rounded-2xl overflow-hidden shadow-lg border bg-white md:hidden">
              <iframe
                src={calendarAgendaSrc}
                style={{ border: 0 }}
                width="100%"
                height="560"
                title="Kyanja Junior School Schedule"
                loading="lazy"
              />
            </div>

            {/* Desktop: full month grid */}
            <div className="rounded-2xl overflow-hidden shadow-lg border bg-white hidden md:block">
              <iframe
                src={calendarMonthSrc}
                style={{ border: 0 }}
                width="100%"
                height="700"
                title="Kyanja Junior School Calendar"
                loading="lazy"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Powered by Google Calendar · Times shown in East Africa Time (EAT)
            </p>
          </div>

          {/* ── Term dates ─────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-[#1e3a5f]" />
              <h2 className="text-2xl font-bold text-slate-900">{currentYear} Term Dates</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { term: 'Term 1', dates: 'To be announced' },
                { term: 'Term 2', dates: 'To be announced' },
                { term: 'Term 3', dates: 'To be announced' },
              ].map(({ term, dates }) => (
                <div key={term} className="bg-white border rounded-xl p-6 shadow-sm">
                  <p className="font-bold text-[#1e3a5f] text-lg">{term}</p>
                  <p className="text-slate-500 text-sm mt-1">{dates}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Upcoming events (API-powered, when API key is set) ── */}
          {events.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Upcoming Events</h2>
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id ?? `${event.summary}-${event.start?.date}`}
                    className="bg-white border rounded-xl p-5 shadow-sm flex gap-4"
                  >
                    <div className="shrink-0 w-1.5 rounded-full bg-[#1e3a5f]" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{event.summary ?? 'School Event'}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{formatEventDate(event)}</p>
                      {event.location && (
                        <p className="text-sm text-slate-400 mt-0.5">{event.location}</p>
                      )}
                      {event.description && (
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{event.description}</p>
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
