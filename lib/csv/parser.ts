import Papa from 'papaparse'
import { csvRowSchema, CSV_HEADERS, type CSVRowInput } from './schema'
import type { CSVImportError } from '@/types/app'

export interface ParseResult {
  valid: CSVRowInput[]
  errors: CSVImportError[]
  totalRows: number
}

/** Characters that indicate a potential CSV-injection attack */
const INJECTION_CHARS = /^[=+\-@\t\r]/

function sanitizeCell(value: string): string {
  // Strip injection prefixes
  return INJECTION_CHARS.test(value.trim()) ? value.replace(INJECTION_CHARS, '') : value
}

export async function parseCSV(file: File): Promise<ParseResult> {
  const text = await file.text()

  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
      transform: (value) => sanitizeCell(value.trim()),
      complete(results) {
        const valid: CSVRowInput[] = []
        const errors: CSVImportError[] = []

        // Check required headers are present
        const missingHeaders = CSV_HEADERS.filter(
          (h) => !results.meta.fields?.includes(h),
        )
        if (missingHeaders.length > 0) {
          resolve({
            valid: [],
            errors: [{
              row: 0,
              field: 'headers',
              value: '',
              message: `Missing required columns: ${missingHeaders.join(', ')}`,
            }],
            totalRows: 0,
          })
          return
        }

        results.data.forEach((row, index) => {
          const rowNum = index + 2 // 1-based + header row
          const result = csvRowSchema.safeParse(row)

          if (result.success) {
            valid.push(result.data)
          } else {
            result.error.issues.forEach((issue) => {
              errors.push({
                row: rowNum,
                field: issue.path.join('.'),
                value: String(row[issue.path[0] as string] ?? ''),
                message: issue.message,
              })
            })
          }
        })

        resolve({ valid, errors, totalRows: results.data.length })
      },
      error(err: Error) {
        resolve({
          valid: [],
          errors: [{ row: 0, field: 'file', value: '', message: err.message }],
          totalRows: 0,
        })
      },
    })
  })
}
