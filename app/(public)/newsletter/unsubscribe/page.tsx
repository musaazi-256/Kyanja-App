import { unsubscribeByToken } from '@/actions/newsletter/subscribe'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Unsubscribe' }

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const { token } = await searchParams

  if (!token) {
    return <Result success={false} message="Invalid unsubscribe link. No token provided." />
  }

  const result = await unsubscribeByToken(token)

  return (
    <Result
      success={result.success}
      message={result.success ? result.message : result.error}
    />
  )
}

function Result({ success, message }: { success: boolean; message?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${success ? 'bg-green-100' : 'bg-red-100'}`}>
          {success
            ? <CheckCircle className="w-9 h-9 text-green-600" />
            : <XCircle className="w-9 h-9 text-red-600" />}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          {success ? 'Unsubscribed' : 'Something went wrong'}
        </h1>
        <p className="text-slate-600 mb-8">{message}</p>
        <Button asChild variant="outline">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  )
}
