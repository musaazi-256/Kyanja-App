import { CSV_HEADERS } from './schema'

const SAMPLE_ROW = {
  student_first_name:  'John',
  student_last_name:   'Doe',
  date_of_birth:       '2018-05-15',
  gender:              'male',
  applying_for_class:  'P1',
  academic_year:       '2025/2026',
  parent_name:         'Jane Doe',
  parent_email:        'jane.doe@example.com',
  parent_phone:        '+256701234567',
  parent_relationship: 'mother',
  address:             'Kampala, Uganda',
  previous_school:     'Sunshine Nursery School',
  special_needs:       '',
  notes:               '',
}

/** Returns a UTF-8 CSV string ready for download */
export function generateCSVTemplate(): string {
  const header = CSV_HEADERS.join(',')
  const sampleRow = CSV_HEADERS.map((h) => `"${SAMPLE_ROW[h] ?? ''}"`).join(',')
  return `${header}\n${sampleRow}\n`
}
