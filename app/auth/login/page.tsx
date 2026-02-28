import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Login' }

function sanitizeRedirectPath(path?: string) {
  if (!path) return '/dashboard'
  if (!path.startsWith('/')) return '/dashboard'
  if (path.startsWith('//')) return '/dashboard'
  return path
}

function mapAuthError(error?: string) {
  if (!error) return undefined

  if (error === 'auth_failed') {
    return 'Authentication failed. Please sign in with your email and password.'
  }

  if (error === 'supabase_not_configured') {
    return 'Supabase is not configured. Update NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.'
  }

  return 'Unable to sign in. Please try again.'
}

function isPlaceholderSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return url.includes('placeholder.supabase.co') || anon.includes('.placeholder')
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>
}) {
  const { redirectTo, error } = await searchParams
  const safeRedirectTo = sanitizeRedirectPath(redirectTo)
  const errorMessage = mapAuthError(error)
  const placeholderConfig = isPlaceholderSupabaseConfig()

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) redirect(safeRedirectTo)
  } catch {
    // Supabase not configured — render login form anyway
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">KJ</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Kyanja Junior School</h1>
          <p className="text-slate-500 mt-1">Admin Portal</p>
        </div>
        <LoginForm
          redirectTo={safeRedirectTo}
          initialError={placeholderConfig ? mapAuthError('supabase_not_configured') : errorMessage}
        />
      </div>
    </div>
  )
}
