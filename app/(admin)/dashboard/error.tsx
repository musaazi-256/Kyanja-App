'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldOff, AlertTriangle } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // In production Next.js hides error details, so we show a message that
  // covers the two most common cases: permission denied and unexpected errors.
  const looksLikeForbidden =
    error.message?.toLowerCase().includes('permission') ||
    error.message?.toLowerCase().includes('forbidden') ||
    error.message?.toLowerCase().includes('unauthorized')

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${
        looksLikeForbidden ? 'bg-red-50' : 'bg-amber-50'
      }`}>
        {looksLikeForbidden
          ? <ShieldOff className="w-8 h-8 text-red-500" />
          : <AlertTriangle className="w-8 h-8 text-amber-500" />}
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        {looksLikeForbidden ? 'Access Denied' : 'Something Went Wrong'}
      </h1>

      <p className="text-slate-500 mb-7 max-w-sm text-sm">
        {looksLikeForbidden
          ? "You don't have permission to access this page. Contact an administrator if you think this is a mistake."
          : 'An unexpected error occurred while loading this page. Please try again or contact support.'}
      </p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
        <Button asChild className="bg-[#1e3a5f] hover:bg-[#16305a]">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>

      {error.digest && (
        <p className="mt-6 text-xs text-slate-400">Error ref: {error.digest}</p>
      )}
    </div>
  )
}