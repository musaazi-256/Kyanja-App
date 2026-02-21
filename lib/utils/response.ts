import type { ActionResult } from '@/types/app'
import { ValidationError, toErrorMessage } from './errors'

export function ok<T>(data: T, message?: string): ActionResult<T> {
  return { success: true, data, message }
}

export function fail(error: unknown): ActionResult<never> {
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: error.message,
      fieldErrors: error.fieldErrors,
    }
  }
  return { success: false, error: toErrorMessage(error) }
}
