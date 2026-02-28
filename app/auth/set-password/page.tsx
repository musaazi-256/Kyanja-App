import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SetPasswordForm from './SetPasswordForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Set Password' }

export default async function SetPasswordPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // No session means the invite link was not followed correctly
  if (!user) redirect('/auth/login?error=auth_failed')

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">KJ</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Kyanja Junior School</h1>
          <p className="text-slate-500 mt-1">Welcome, {user.email}</p>
        </div>
        <SetPasswordForm />
      </div>
    </div>
  )
}