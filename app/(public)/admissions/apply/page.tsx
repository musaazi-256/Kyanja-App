import { submitPublicApplication } from '@/actions/applications/create'
import ApplicationForm from '@/components/admin/applications/ApplicationForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Apply for Admission',
  description: 'Submit your child\'s application to Kyanja Junior School.',
}

interface PageProps {
  searchParams: Promise<{ success?: string }>
}

export default async function ApplyPage({ searchParams }: PageProps) {
  const { success } = await searchParams

  if (success === '1') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted!</h1>
          <p className="text-slate-600 mb-8">
            Thank you for applying to Kyanja Junior School. We have received your application
            and will review it within 5–10 working days. You will receive a confirmation email
            shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/">Return Home</Link>
            </Button>
            <Button asChild className="bg-blue-900 hover:bg-blue-800 active:scale-95 transition-all">
              <Link href="/admissions">Back to Admissions</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/admissions" className="text-sm text-[#1e3a5f] hover:underline">
          ← Back to Admissions
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2">
          Online Application Form
        </h1>
        <p className="text-slate-500">
          Please complete all required fields (*). You will receive a confirmation
          email once your application is submitted.
        </p>
      </div>

      <ApplicationForm
        action={submitPublicApplication}
        submitLabel="Submit Application"
        isPublic
      />
    </div>
  )
}
