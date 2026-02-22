import { z } from 'zod'

const roleSchema = z.enum(['admin', 'staff', 'teacher', 'parent', 'student'])

export const userIdSchema = z.object({
  user_id: z.string().uuid('Invalid user id'),
})

export const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  full_name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120, 'Name is too long'),
  role: roleSchema,
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long'),
})

export const inviteUserSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  full_name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120, 'Name is too long'),
  role: roleSchema,
})

export const updateUserRoleSchema = z.object({
  user_id: z.string().uuid('Invalid user id'),
  role: roleSchema,
})

export const updateUserStatusSchema = z.object({
  user_id: z.string().uuid('Invalid user id'),
  is_active: z.preprocess((v) => v === 'true' || v === true, z.boolean()),
})

export const setUserPasswordSchema = z.object({
  user_id: z.string().uuid('Invalid user id'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long'),
})
