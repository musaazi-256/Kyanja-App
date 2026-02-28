'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CalendarEvent } from '@/lib/calendar/fetch'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface Props {
  initialEvents: CalendarEvent[]
  initialYear:   number
  initialMonth:  number // 1-indexed
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** Returns a map of YYYY-MM-DD → events on that day */
function groupByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>()
  for (const ev of events) {
    const raw = ev.start?.dateTime ?? ev.start?.date
    if (!raw) continue
    const key = raw.slice(0, 10)
    map.set(key, [...(map.get(key) ?? []), ev])
  }
  return map
}

function formatTime(ev: CalendarEvent): string {
  if (!ev.start?.dateTime) return 'All day'
  return new Date(ev.start.dateTime).toLocaleTimeString('en-UG', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

function formatSelectedDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-UG', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

export default function SchoolCalendar({ initialEvents, initialYear, initialMonth }: Props) {
  const [year,    setYear]    = useState(initialYear)
  const [month,   setMonth]   = useState(initialMonth)
  const [events,  setEvents]  = useState<CalendarEvent[]>(initialEvents)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  async function loadMonth(y: number, m: number) {
    if (y === initialYear && m === initialMonth) {
      setEvents(initialEvents)
      return
    }
    setLoading(true)
    try {
      const res  = await fetch(`/api/calendar?year=${y}&month=${m}`)
      const data = await res.json()
      setEvents(data.items ?? [])
    } catch {
      // Keep existing events on failure
    } finally {
      setLoading(false)
    }
  }

  function navigate(delta: number) {
    let newMonth = month + delta
    let newYear  = year
    if (newMonth < 1)  { newMonth = 12; newYear -= 1 }
    if (newMonth > 12) { newMonth = 1;  newYear += 1 }
    setMonth(newMonth)
    setYear(newYear)
    setSelected(null)
    loadMonth(newYear, newMonth)
  }

  // Build grid
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const daysInMonth  = new Date(year, month, 0).getDate()
  const today        = new Date()
  const todayStr     = toDateStr(today.getFullYear(), today.getMonth() + 1, today.getDate())

  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const eventsByDate   = groupByDate(events)
  const selectedEvents = selected ? (eventsByDate.get(selected) ?? []) : []

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden">

        {/* ── Month header ── */}
        <div className="bg-blue-600 px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-50 flex items-center justify-center transition-colors text-white"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <p className="text-white font-bold text-lg tracking-tight select-none">
            {MONTH_NAMES[month - 1]} {year}
          </p>

          <button
            onClick={() => navigate(1)}
            disabled={loading}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-50 flex items-center justify-center transition-colors text-white"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Day-of-week labels ── */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {DAY_LABELS.map(d => (
            <div key={d} className="py-3 text-center text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              {d}
            </div>
          ))}
        </div>

        {/* ── Day grid ── */}
        <div className={`grid grid-cols-7 transition-opacity duration-200 ${loading ? 'opacity-40 pointer-events-none' : ''}`}>
          {cells.map((day, idx) => {
            if (!day) {
              return <div key={`pad-${idx}`} className="h-16 sm:h-20" />
            }

            const dateStr    = toDateStr(year, month, day)
            const dayEvents  = eventsByDate.get(dateStr) ?? []
            const hasEvent   = dayEvents.length > 0
            const isToday    = dateStr === todayStr
            const isSel      = dateStr === selected
            const firstName  = dayEvents[0]?.summary ?? 'Event'
            const extraCount = dayEvents.length - 1

            return (
              <button
                key={dateStr}
                onClick={() => (hasEvent || isToday) && setSelected(isSel ? null : dateStr)}
                className={[
                  'h-16 sm:h-20 flex flex-col items-center justify-start pt-2 px-0.5 relative',
                  'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
                  // Today: solid blue-600 fill, white text — always takes priority
                  isToday
                    ? 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700'
                    // Event day (not today): light blue fill, blue text
                    : hasEvent
                      ? 'bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200'
                      // Plain day
                      : 'text-slate-700 cursor-default',
                  isSel ? 'ring-2 ring-inset ring-blue-400/60' : '',
                ].join(' ')}
                aria-label={
                  isToday && hasEvent
                    ? `Today, ${day} ${MONTH_NAMES[month - 1]}, has events`
                    : hasEvent
                      ? `${day} ${MONTH_NAMES[month - 1]}, has events`
                      : undefined
                }
              >
                {/* Day number */}
                <span className="text-sm font-bold leading-none">{day}</span>

                {/* Event name — shown on event days or today-with-event */}
                {hasEvent && (
                  <span
                    className={[
                      'mt-1 w-full text-center text-[9px] sm:text-[10px] font-semibold leading-tight px-0.5',
                      isToday ? 'text-white/90' : 'text-blue-700',
                    ].join(' ')}
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {firstName}
                    {extraCount > 0 && ` +${extraCount}`}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Legend ── */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap items-center gap-5 text-[12px] text-slate-500">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-blue-100 border border-blue-200 inline-block shrink-0" />
            Days with events
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm bg-blue-600 inline-block shrink-0" />
            Today
          </span>
          {eventsByDate.size === 0 && !loading && (
            <span className="ml-auto italic text-slate-400">No events this month</span>
          )}
        </div>
      </div>

      {/* ── Event detail panel (shown on click) ── */}
      {selected && selectedEvents.length > 0 && (
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-6">
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-4">
            {formatSelectedDate(selected)}
          </p>
          <div className="space-y-4">
            {selectedEvents.map((ev, i) => (
              <div key={ev.id ?? i} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm leading-snug">
                    {ev.summary ?? 'School Event'}
                  </p>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{formatTime(ev)}</p>
                  {ev.location && (
                    <p className="text-xs text-slate-500 mt-0.5">{ev.location}</p>
                  )}
                  {ev.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3">
                      {ev.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
