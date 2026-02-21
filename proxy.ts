import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasPlaceholderConfig =
    (supabaseUrl ?? '').includes('placeholder.supabase.co')
    || (supabaseAnon ?? '').includes('.placeholder')

  // Skip if env vars not configured (e.g. during local dev without .env.local)
  if (!supabaseUrl || !supabaseAnon || hasPlaceholderConfig) {
    const { pathname } = request.nextUrl
    if (pathname.startsWith('/dashboard')) {
      const loginUrl = new URL('/auth/login', request.url)
      if (hasPlaceholderConfig) loginUrl.searchParams.set('error', 'supabase_not_configured')
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnon,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh the session, but avoid hanging the whole app if auth network stalls.
  const userResult = await Promise.race([
    supabase.auth.getUser(),
    new Promise<{ data: { user: null } }>((resolve) => setTimeout(
      () => resolve({ data: { user: null } }),
      3000,
    )),
  ]).catch((err) => {
    console.error('[proxy] auth.getUser failed', err)
    return { data: { user: null } }
  })
  const user = userResult.data.user

  const { pathname } = request.nextUrl

  // Protect all /dashboard/* routes
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect authenticated users away from login
  if (pathname === '/auth/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/login',
    '/auth/callback',
  ],
}
