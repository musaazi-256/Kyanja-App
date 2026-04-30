'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * Listens for Supabase PASSWORD_RECOVERY events fired when a recovery token
 * lands in the URL hash (implicit flow). Redirects to the set-password page
 * so the user can choose a new password.
 */
export default function RecoveryRedirect() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        router.replace('/auth/set-password')
      }
    })
    return () => subscription.unsubscribe()
  }, [router])

  return null
}
