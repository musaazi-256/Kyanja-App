'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { Users, Send, XCircle } from 'lucide-react'
import type { NewsletterWithSends, SendStatus } from '@/types/app'

const STATUS_COLORS: Record<SendStatus, string> = {
  draft:   'bg-slate-100 text-slate-600',
  queued:  'bg-blue-100 text-blue-700',
  sending: 'bg-amber-100 text-amber-700',
  sent:    'bg-green-100 text-green-700',
  failed:  'bg-red-100 text-red-700',
}

const SEND_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-700',
  sent:    'bg-green-100 text-green-700',
  failed:  'bg-red-100 text-red-700',
}

const FOOTER_HTML = `
  <br/><br/>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
  <p style="font-size:12px;color:#9ca3af;text-align:center">
    Kyanja Junior School · 500 M from West Mall, Kyanja ·
    Plot 43a Katumba Zone-Kyanja Nakawa Division<br/>
    <a href="#" style="color:#9ca3af">Unsubscribe</a>
  </p>
`

function buildPreviewDoc(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body { font-family: Arial, sans-serif; font-size:14px; line-height:1.6;
           color:#1f2937; max-width:600px; margin:0 auto; padding:20px; }
    a { color:#1e3a5f; }
    img { max-width:100%; }
  </style>
</head>
<body>${bodyHtml}${FOOTER_HTML}</body>
</html>`
}

interface Props {
  newsletter: NewsletterWithSends
}

export default function NewsletterDetail({ newsletter: nl }: Props) {
  const previewDoc = buildPreviewDoc(nl.body_html)

  return (
    <div className="space-y-6">

      {/* ── Status + date ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge className={`${STATUS_COLORS[nl.status]} border-0 capitalize text-sm px-3 py-1`}>
          {nl.status}
        </Badge>
        <span className="text-slate-500 text-sm">
          Created {format(new Date(nl.created_at), 'dd MMM yyyy')}
        </span>
        {nl.sent_at && (
          <span className="text-slate-500 text-sm">
            · Sent {format(new Date(nl.sent_at), 'dd MMM yyyy, HH:mm')}
          </span>
        )}
      </div>

      {/* ── Delivery stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <Users className="w-5 h-5 mx-auto mb-1.5 text-slate-400" />
            <p className="text-2xl font-bold text-slate-900">{nl.recipient_count}</p>
            <p className="text-xs text-slate-500 mt-0.5">Recipients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <Send className="w-5 h-5 mx-auto mb-1.5 text-green-500" />
            <p className="text-2xl font-bold text-green-700">{nl.sent_count}</p>
            <p className="text-xs text-slate-500 mt-0.5">Sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <XCircle className="w-5 h-5 mx-auto mb-1.5 text-red-400" />
            <p className={`text-2xl font-bold ${nl.failed_count > 0 ? 'text-red-600' : 'text-slate-300'}`}>
              {nl.failed_count}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Failed</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Email preview ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden rounded-b-lg">
          <iframe
            srcDoc={previewDoc}
            sandbox="allow-same-origin"
            title="Email preview"
            className="w-full border-0"
            style={{ minHeight: '480px' }}
          />
        </CardContent>
      </Card>

      {/* ── Per-recipient send records ──────────────────────────────── */}
      {nl.newsletter_sends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Delivery Records
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({nl.newsletter_sends.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100/90 hover:bg-slate-100/90">
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nl.newsletter_sends.map((send) => {
                  const sub = send.newsletter_subscribers
                  const timestamp = send.sent_at ?? send.failed_at
                  return (
                    <TableRow key={send.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{sub?.email ?? '—'}</p>
                        {sub?.full_name && (
                          <p className="text-xs text-slate-400">{sub.full_name}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${SEND_STATUS_COLORS[send.status] ?? 'bg-slate-100 text-slate-600'} border-0 capitalize`}
                        >
                          {send.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {timestamp ? format(new Date(timestamp), 'dd MMM, HH:mm') : '—'}
                      </TableCell>
                      <TableCell className="text-red-500 text-xs max-w-xs truncate">
                        {send.error_message ?? ''}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
