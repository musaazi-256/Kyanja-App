import { Resend } from 'resend'

export const FROM_ADDRESS = 'Kyanja Junior School <noreply@kyanjajuniorschool.com>'
export const REPLY_TO     = 'admin@kjsch.com'

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY environment variable is not set')
  return new Resend(key)
}

export interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export async function sendEmail(params: SendEmailParams): Promise<{ messageId: string }> {
  const { to, subject, html, text, replyTo } = params
  const resend = getResend()

  const { data, error } = await resend.emails.send({
    from:     FROM_ADDRESS,
    to:       Array.isArray(to) ? to : [to],
    subject,
    html,
    text:     text ?? '',
    replyTo: replyTo ?? REPLY_TO,
  })

  if (error || !data) {
    throw new Error(`Email send failed: ${error?.message ?? 'Unknown error'}`)
  }

  return { messageId: data.id }
}
