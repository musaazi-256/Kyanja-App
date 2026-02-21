import { z } from 'zod'

export const csvRowSchema = z.object({
  student_first_name:  z.string().min(1, 'Required'),
  student_last_name:   z.string().min(1, 'Required'),
  date_of_birth:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  gender:              z.enum(['male', 'female', 'other']).optional().or(z.literal('')),
  applying_for_class:  z.string().min(1, 'Required'),
  academic_year:       z.string().min(1, 'Required'),
  parent_name:         z.string().min(1, 'Required'),
  parent_email:        z.string().email('Invalid email'),
  parent_phone:        z.string().min(7, 'Too short'),
  parent_relationship: z.string().min(1, 'Required'),
  address:             z.string().optional().or(z.literal('')),
  previous_school:     z.string().optional().or(z.literal('')),
  special_needs:       z.string().optional().or(z.literal('')),
  notes:               z.string().optional().or(z.literal('')),
})

export type CSVRowInput = z.infer<typeof csvRowSchema>

export const CSV_HEADERS = [
  'student_first_name',
  'student_last_name',
  'date_of_birth',
  'gender',
  'applying_for_class',
  'academic_year',
  'parent_name',
  'parent_email',
  'parent_phone',
  'parent_relationship',
  'address',
  'previous_school',
  'special_needs',
  'notes',
] as const
