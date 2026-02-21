'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { subscribeToNewsletter } from '@/actions/newsletter/subscribe'
import { subscribeSchema, type SubscribeFormData } from '@/lib/validations/newsletter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail } from 'lucide-react'

export default function SubscribePage() {
  const [pending, startTransition] = useTransition()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
  })

  function onSubmit(data: SubscribeFormData) {
    const fd = new FormData()
    fd.set('email', data.email)
    if (data.full_name) fd.set('full_name', data.full_name)

    startTransition(async () => {
      const res = await subscribeToNewsletter(fd)
      if (res.success) {
        toast.success(res.message ?? 'Subscribed!')
        reset()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-[#1e3a5f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-[#1e3a5f]" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Stay Connected</h1>
        <p className="text-slate-500 mb-8">
          Subscribe to receive news, term updates, and announcements from Kyanja Junior School.
        </p>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
              <div className="space-y-2">
                <Label htmlFor="full_name">Your Name (optional)</Label>
                <Input id="full_name" placeholder="Jane Doe" {...register('full_name')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="jane@example.com" {...register('email')} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <Button type="submit" disabled={pending} className="w-full bg-[#1e3a5f] hover:bg-[#16305a]">
                {pending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Subscribe to Newsletter
              </Button>
              <p className="text-xs text-slate-400 text-center">
                You can unsubscribe at any time from the link in any email.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
