import type { Tables, Enums } from './database'

// ─── Re-exported DB row types ────────────────────────────────────────────────
export type Profile = Tables<'profiles'>
export type Application = Tables<'applications'>
export type ApplicationStatusHistory = Tables<'application_status_history'>
export type CSVImportBatch = Tables<'csv_import_batches'>
export type NewsletterSubscriber = Tables<'newsletter_subscribers'>
export type Newsletter = Tables<'newsletters'>
export type NewsletterSend = Tables<'newsletter_sends'>
export type MediaFile = Tables<'media_files'>

// ─── Enums ───────────────────────────────────────────────────────────────────
export type ApplicationStatus = Enums<'application_status'>
export type UserRole = Enums<'user_role'>
export type SendStatus = Enums<'send_status'>
export type MediaContext = Enums<'media_context'>

// ─── Application with relations ───────────────────────────────────────────────
export type ApplicationWithHistory = Application & {
  application_status_history: ApplicationStatusHistory[]
  processor?: Pick<Profile, 'id' | 'full_name' | 'email'> | null
}

// ─── Server Action response ───────────────────────────────────────────────────
export type ActionResult<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

// ─── CSV Import ───────────────────────────────────────────────────────────────
export interface CSVImportError {
  row: number
  field: string
  value: string
  message: string
}

export interface CSVImportResult {
  batchId: string
  totalRows: number
  validRows: number
  errorCount: number
  errors: CSVImportError[]
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  permission?: string
  children?: NavItem[]
}

// ─── Pagination ──────────────────────────────────────────────────────────────
export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PaginatedResult<T> {
  data: T[]
  meta: PaginationMeta
}

// ─── Filter types ─────────────────────────────────────────────────────────────
export interface ApplicationFilters {
  status?: ApplicationStatus
  academic_year?: string
  applying_for_class?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface MediaFilters {
  context?: MediaContext
  search?: string
  page?: number
  pageSize?: number
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
export interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: { date?: string; dateTime?: string; timeZone?: string }
  end: { date?: string; dateTime?: string; timeZone?: string }
  location?: string
  colorId?: string
}
