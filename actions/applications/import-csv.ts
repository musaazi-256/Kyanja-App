'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requirePermission } from '@/lib/rbac/check'
import { parseCSV } from '@/lib/csv/parser'
import { ok, fail } from '@/lib/utils/response'
import type { ActionResult, CSVImportResult } from '@/types/app'
import { revalidatePath } from 'next/cache'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export async function importCSV(formData: FormData): Promise<ActionResult<CSVImportResult>> {
  try {
    const profile = await requirePermission('applications:import')

    const file = formData.get('file') as File | null
    if (!file || file.size === 0) {
      return fail(new Error('No file provided'))
    }
    if (file.size > MAX_FILE_SIZE) {
      return fail(new Error('File exceeds maximum size of 5 MB'))
    }
    if (!file.name.endsWith('.csv')) {
      return fail(new Error('Only CSV files are accepted'))
    }

    // Parse and validate
    const { valid, errors, totalRows } = await parseCSV(file)

    const admin = createAdminClient()

    // Create import batch record
    const { data: batch, error: batchError } = await admin
      .from('csv_import_batches')
      .insert({
        file_name:     file.name,
        total_rows:    totalRows,
        success_count: 0,
        error_count:   errors.length,
        status:        valid.length > 0 ? 'processing' : 'done',
        errors:        errors.length > 0 ? (errors as unknown as import('@/types/database').Json) : null,
        uploaded_by:   profile.id,
      })
      .select('id')
      .single()

    if (batchError || !batch) throw new Error('Failed to create import batch')

    let successCount = 0

    if (valid.length > 0) {
      const supabase = await createClient()

      // Bulk insert valid rows
      const rows = valid.map((row) => ({
        ...row,
        gender:          row.gender || null,
        status:          'submitted' as const,
        source:          'csv_import',
        import_batch_id: batch.id,
        created_by:      profile.id,
      }))

      const { data: inserted, error: insertError } = await supabase
        .from('applications')
        .insert(rows)
        .select('id')

      if (insertError) throw insertError

      successCount = inserted?.length ?? 0

      // Bulk insert status history
      if (inserted && inserted.length > 0) {
        await supabase.from('application_status_history').insert(
          inserted.map((app) => ({
            application_id: app.id,
            from_status:    null,
            to_status:      'submitted' as const,
            changed_by:     profile.id,
          })),
        )
      }

      // Update batch record
      await admin.from('csv_import_batches').update({
        success_count: successCount,
        status:        'done',
        completed_at:  new Date().toISOString(),
      }).eq('id', batch.id)
    }

    revalidatePath('/dashboard/applications')

    return ok({
      batchId:    batch.id,
      totalRows,
      validRows:  valid.length,
      errorCount: errors.length,
      errors,
    })
  } catch (err) {
    return fail(err)
  }
}
