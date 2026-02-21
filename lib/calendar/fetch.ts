/**
 * Shared Google Calendar fetch logic used by both:
 *  - app/api/calendar/route.ts  (public REST endpoint)
 *  - app/(public)/schedule/page.tsx  (direct server-component call)
 *
 * Calling it directly avoids a self-referencing HTTP round-trip
 * that breaks in dev when NEXT_PUBLIC_SITE_URL points to the wrong port.
 */

export type CalendarEvent = {
  id?: string
  summary?: string
  description?: string
  location?: string
  start?: { dateTime?: string; date?: string }
  end?:   { dateTime?: string; date?: string }
}

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID ?? 'staffkyanjajunior@gmail.com'

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY
  if (!apiKey) return []

  try {
    const now = new Date().toISOString()
    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
    )
    url.searchParams.set('key',          apiKey)
    url.searchParams.set('timeMin',      now)
    url.searchParams.set('maxResults',   '20')
    url.searchParams.set('singleEvents', 'true')
    url.searchParams.set('orderBy',      'startTime')

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    if (!res.ok) {
      console.error('[calendar] API error', res.status)
      return []
    }
    const data = await res.json()
    return data.items ?? []
  } catch (err) {
    console.error('[calendar] fetch error', err)
    return []
  }
}
