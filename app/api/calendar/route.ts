import { NextRequest, NextResponse } from 'next/server'
import { fetchCalendarEvents } from '@/lib/calendar/fetch'

/**
 * Public REST endpoint for calendar events.
 * Supports optional ?year=YYYY&month=M (1-indexed) to fetch a specific month.
 * Without params, returns upcoming events from now onwards.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const year  = searchParams.get('year')
  const month = searchParams.get('month')

  let options: Parameters<typeof fetchCalendarEvents>[0]

  if (year && month) {
    const y = parseInt(year,  10)
    const m = parseInt(month, 10) - 1 // convert to 0-indexed for Date
    const start = new Date(y, m, 1)
    const end   = new Date(y, m + 1, 0, 23, 59, 59)
    options = { timeMin: start.toISOString(), timeMax: end.toISOString(), maxResults: 50 }
  }

  const items = await fetchCalendarEvents(options)
  return NextResponse.json({ items })
}
