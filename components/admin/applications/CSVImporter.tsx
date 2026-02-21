'use client'

import { useState, useTransition, useRef } from 'react'
import { toast } from 'sonner'
import { importCSV } from '@/actions/applications/import-csv'
import { generateCSVTemplate } from '@/lib/csv/template'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Upload, FileText, Download, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import type { CSVImportResult } from '@/types/app'

export default function CSVImporter() {
  const [file, setFile]           = useState<File | null>(null)
  const [result, setResult]       = useState<CSVImportResult | null>(null)
  const [pending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setResult(null)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f?.name.endsWith('.csv')) {
      setFile(f)
      setResult(null)
    } else {
      toast.error('Please drop a CSV file')
    }
  }

  function downloadTemplate() {
    const csv  = generateCSVTemplate()
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'applications-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport() {
    if (!file) return
    const fd = new FormData()
    fd.set('file', file)

    startTransition(async () => {
      const res = await importCSV(fd)
      if (res.success) {
        setResult(res.data)
        if (res.data.validRows > 0) {
          toast.success(`${res.data.validRows} applications imported successfully`)
        }
      } else {
        toast.error(res.error)
      }
    })
  }

  function reset() {
    setFile(null)
    setResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-6">
      {/* Template download */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Step 1: Download Template</CardTitle>
          <CardDescription>
            Use the sample CSV template to format your data correctly before importing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download CSV Template
          </Button>
        </CardContent>
      </Card>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Step 2: Upload CSV File</CardTitle>
          <CardDescription>Maximum file size: 5 MB</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-slate-300 transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3 text-slate-700">
                <FileText className="w-8 h-8 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ) : (
              <div className="text-slate-500">
                <Upload className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">Drag and drop a CSV file here</p>
                <p className="text-sm">or click to browse</p>
              </div>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />

          {file && !result && (
            <div className="flex gap-2">
              <Button onClick={handleImport} disabled={pending} className="bg-[#1e3a5f] hover:bg-[#16305a]">
                {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {pending ? 'Importing…' : 'Import Applications'}
              </Button>
              <Button variant="outline" onClick={reset} disabled={pending}>
                Clear
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Import Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <Stat label="Total Rows"  value={result.totalRows}  />
              <Stat label="Imported"    value={result.validRows}  color="text-green-600" />
              <Stat label="Errors"      value={result.errorCount} color={result.errorCount > 0 ? 'text-red-600' : undefined} />
            </div>

            {result.validRows > 0 && (
              <Alert>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  {result.validRows} application{result.validRows !== 1 ? 's' : ''} imported successfully.
                </AlertDescription>
              </Alert>
            )}

            {result.errorCount > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-600 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  {result.errorCount} row{result.errorCount !== 1 ? 's' : ''} had errors and were skipped:
                </p>
                <div className="max-h-64 overflow-y-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Row</TableHead>
                        <TableHead>Field</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.errors.map((err) => (
                        <TableRow key={`${err.row}-${err.field}`}>
                          <TableCell>{err.row}</TableCell>
                          <TableCell className="font-mono text-xs">{err.field}</TableCell>
                          <TableCell className="text-xs text-slate-500">{err.value || '—'}</TableCell>
                          <TableCell className="text-red-600 text-xs">{err.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <Button variant="outline" onClick={reset}>
              Import Another File
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="text-center p-4 bg-slate-50 rounded-lg">
      <p className={`text-2xl font-bold ${color ?? 'text-slate-900'}`}>{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}
