import { z } from 'zod'

const CLASSES = ['Baby Class', 'Middle Class', 'Top Class', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'] as const

export const applicationSchema = z.object({
  student_first_name:  z.string().min(2, 'First name must be at least 2 characters'),
  student_last_name:   z.string().min(2, 'Last name must be at least 2 characters'),
  date_of_birth:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use format YYYY-MM-DD'),
  gender:              z.enum(['male', 'female', 'other']).optional(),
  nationality:         z.string().optional(),
  applying_for_class:  z.string().min(1, 'Please select a class'),
  academic_year:       z.string().min(4, 'Academic year is required'),
  parent_name:         z.string().min(2, 'Parent/guardian name is required'),
  parent_email:        z.string().email('Enter a valid email address'),
  parent_phone:        z.string().min(7, 'Enter a valid phone number'),
  parent_relationship: z.string().min(1, 'Relationship is required'),
  address:             z.string().optional(),
  previous_school:     z.string().optional(),
  special_needs:       z.string().optional(),
  notes:               z.string().optional(),
})

export type ApplicationFormData = z.infer<typeof applicationSchema>

// Subset used when admin manually adds status note
export const statusUpdateSchema = z.object({
  application_id: z.string().uuid(),
  new_status:     z.enum([
    'draft', 'submitted', 'under_review', 'accepted', 'declined', 'waitlisted', 'withdrawn',
  ]),
  note: z.string().optional(),
})

export type StatusUpdateData = z.infer<typeof statusUpdateSchema>

export const AVAILABLE_CLASSES = CLASSES
