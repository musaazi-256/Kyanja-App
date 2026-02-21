import { NextResponse } from 'next/server'
import { fetchCalendarEvents } from '@/lib/calendar/fetch'

export const revalidate = 3600

/**
 * Public REST endpoint for calendar events.
 * Kept for external consumers; the schedule page calls fetchCalendarEvents() directly.
 */
export async function GET() {
  const items = await fetchCalendarEvents()
  return NextResponse.json({ items })
}
