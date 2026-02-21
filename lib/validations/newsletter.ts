import { z } from 'zod'

export const subscribeSchema = z.object({
  email:     z.string().email('Enter a valid email address'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').optional(),
})

export const composeNewsletterSchema = z.object({
  subject:   z.string().min(5, 'Subject must be at least 5 characters'),
  body_html: z.string().min(20, 'Email body is too short'),
  body_text: z.string().optional(),
})

export type SubscribeFormData    = z.infer<typeof subscribeSchema>
export type ComposeNewsletterData = z.infer<typeof composeNewsletterSchema>
