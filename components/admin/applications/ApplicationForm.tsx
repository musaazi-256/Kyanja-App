'use client'

import { useTransition } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { applicationSchema, AVAILABLE_CLASSES, type ApplicationFormData } from '@/lib/validations/application'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import type { ActionResult } from '@/types/app'

interface Props {
  action: (data: FormData) => Promise<ActionResult<{ id: string }>>
  submitLabel?: string
  isPublic?: boolean
}

const CURRENT_YEAR = `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
const YEARS = [CURRENT_YEAR, `${new Date().getFullYear() + 1}/${new Date().getFullYear() + 2}`]
const RELATIONSHIPS = ['Mother', 'Father', 'Guardian', 'Grandparent', 'Other']

export default function ApplicationForm({ action, submitLabel = 'Submit Application', isPublic = false }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { academic_year: CURRENT_YEAR },
  })

  function onSubmit(data: ApplicationFormData) {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') fd.set(k, String(v))
    })

    startTransition(async () => {
      const result = await action(fd)
      if (result.success) {
        toast.success(isPublic ? 'Application submitted! Check your email for confirmation.' : 'Application created.')
        if (!isPublic) router.push(`/dashboard/applications/${result.data.id}`)
        if (isPublic) router.push('/admissions/apply?success=1')
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Student Info */}
      <Card>
        <CardHeader><CardTitle className="text-base">Student Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="student_first_name">First Name *</Label>
            <Input id="student_first_name" {...register('student_first_name')} />
            {errors.student_first_name && <p className="text-xs text-red-500">{errors.student_first_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="student_last_name">Last Name *</Label>
            <Input id="student_last_name" {...register('student_last_name')} />
            {errors.student_last_name && <p className="text-xs text-red-500">{errors.student_last_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth *</Label>
            <Input id="date_of_birth" type="date" {...register('date_of_birth')} />
            {errors.date_of_birth && <p className="text-xs text-red-500">{errors.date_of_birth.message}</p>}
          </div>

          {/* Gender — Controller ensures proper registration and error clearing */}
          <div className="space-y-2">
            <Label>Gender</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input id="nationality" {...register('nationality')} placeholder="e.g. Ugandan" />
          </div>

          {/* Applying for class — required, Controller for proper tracking */}
          <div className="space-y-2">
            <Label>Applying for Class *</Label>
            <Controller
              name="applying_for_class"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.applying_for_class && <p className="text-xs text-red-500">{errors.applying_for_class.message}</p>}
          </div>

          {/* Academic year */}
          <div className="space-y-2">
            <Label>Academic Year *</Label>
            <Controller
              name="academic_year"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? CURRENT_YEAR}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.academic_year && <p className="text-xs text-red-500">{errors.academic_year.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="previous_school">Previous School</Label>
            <Input id="previous_school" {...register('previous_school')} />
          </div>
        </CardContent>
      </Card>

      {/* Parent Info */}
      <Card>
        <CardHeader><CardTitle className="text-base">Parent / Guardian Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="parent_name">Full Name *</Label>
            <Input id="parent_name" {...register('parent_name')} />
            {errors.parent_name && <p className="text-xs text-red-500">{errors.parent_name.message}</p>}
          </div>

          {/* Relationship — required, Controller */}
          <div className="space-y-2">
            <Label>Relationship *</Label>
            <Controller
              name="parent_relationship"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIPS.map((r) => (
                      <SelectItem key={r} value={r.toLowerCase()}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.parent_relationship && <p className="text-xs text-red-500">{errors.parent_relationship.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent_email">Email Address *</Label>
            <Input id="parent_email" type="email" {...register('parent_email')} />
            {errors.parent_email && <p className="text-xs text-red-500">{errors.parent_email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent_phone">Phone Number *</Label>
            <Input id="parent_phone" type="tel" {...register('parent_phone')} placeholder="+256 700 000 000" />
            {errors.parent_phone && <p className="text-xs text-red-500">{errors.parent_phone.message}</p>}
          </div>
          <div className="col-span-full space-y-2">
            <Label htmlFor="address">Home Address</Label>
            <Input id="address" {...register('address')} placeholder="Street, Parish, District" />
          </div>
        </CardContent>
      </Card>

      {/* Additional */}
      <Card>
        <CardHeader><CardTitle className="text-base">Additional Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="special_needs">Special Needs or Requirements</Label>
            <Textarea id="special_needs" {...register('special_needs')} rows={2} placeholder="Any medical conditions, learning needs, etc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea id="notes" {...register('notes')} rows={2} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-[#1e3a5f] hover:bg-[#16305a]">
        {pending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  )
}
