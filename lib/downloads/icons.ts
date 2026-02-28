import {
  FileText, Calendar, FileDown, BookOpen, Newspaper,
  ClipboardList, Award, Info, BarChart2, Utensils, File,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface DownloadIcon {
  id:    string
  label: string
  Icon:  LucideIcon
  color: string // tailwind classes for icon container
}

export const DOWNLOAD_ICONS: DownloadIcon[] = [
  { id: 'file-text',      label: 'Document',    Icon: FileText,      color: 'text-blue-600 bg-blue-100'    },
  { id: 'calendar',       label: 'Calendar',    Icon: Calendar,      color: 'text-emerald-600 bg-emerald-100' },
  { id: 'file-down',      label: 'Form',        Icon: FileDown,      color: 'text-amber-600 bg-amber-100'  },
  { id: 'book-open',      label: 'Handbook',    Icon: BookOpen,      color: 'text-indigo-600 bg-indigo-100' },
  { id: 'newspaper',      label: 'Circular',    Icon: Newspaper,     color: 'text-purple-600 bg-purple-100' },
  { id: 'clipboard-list', label: 'Timetable',   Icon: ClipboardList, color: 'text-rose-600 bg-rose-100'    },
  { id: 'award',          label: 'Certificate', Icon: Award,         color: 'text-yellow-600 bg-yellow-100' },
  { id: 'info',           label: 'Policy',      Icon: Info,          color: 'text-slate-600 bg-slate-100'  },
  { id: 'bar-chart-2',    label: 'Report',      Icon: BarChart2,     color: 'text-teal-600 bg-teal-100'    },
  { id: 'utensils',       label: 'Menu',        Icon: Utensils,      color: 'text-orange-600 bg-orange-100' },
  { id: 'file',           label: 'Other',       Icon: File,          color: 'text-gray-600 bg-gray-100'    },
]

export function getDownloadIcon(id: string): DownloadIcon {
  return DOWNLOAD_ICONS.find((i) => i.id === id) ?? DOWNLOAD_ICONS[0]
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
