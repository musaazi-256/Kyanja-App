import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BATCH_SIZE = 50
const MAX_RETRIES = 3
const FROM_ADDRESS = 'Kyanja Junior School <noreply@kyanjajuniorschool.com>'

serve(async (req: Request) => {
  // Validate auth header
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { newsletter_id } = await req.json()
  if (!newsletter_id) {
    return new Response('Missing newsletter_id', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const resendApiKey = Deno.env.get('RESEND_API_KEY')!

  // Fetch newsletter
  const { data: newsletter, error: nlError } = await supabase
    .from('newsletters')
    .select('*')
    .eq('id', newsletter_id)
    .single()

  if (nlError || !newsletter) {
    return new Response('Newsletter not found', { status: 404 })
  }

  // Mark as sending
  await supabase
    .from('newsletters')
    .update({ status: 'sending' })
    .eq('id', newsletter_id)

  let totalSent   = 0
  let totalFailed = 0
  let offset      = 0

  // Process in batches
  while (true) {
    const { data: sends } = await supabase
      .from('newsletter_sends')
      .select('id, subscriber_id, retry_count, newsletter_subscribers(email, full_name, unsubscribe_token)')
      .eq('newsletter_id', newsletter_id)
      .eq('status', 'pending')
      .lt('retry_count', MAX_RETRIES)
      .range(offset, offset + BATCH_SIZE - 1)

    if (!sends || sends.length === 0) break

    for (const send of sends) {
      const subscriber = send.newsletter_subscribers as { email: string; full_name: string | null; unsubscribe_token: string }

      const unsubscribeUrl = `${Deno.env.get('SITE_URL')}/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`

      const html = `
        ${newsletter.body_html}
        <br/><br/>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="font-size:12px;color:#9ca3af;text-align:center">
          Kyanja Junior School · 500 M from West Mall, Kyanja · Plot 43a Katumba Zone-Kyanja Nakawa Division<br/>
          <a href="${unsubscribeUrl}" style="color:#9ca3af">Unsubscribe</a>
        </p>
      `

      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method:  'POST',
          headers: {
            Authorization:  `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from:    FROM_ADDRESS,
            to:      [subscriber.email],
            subject: newsletter.subject,
            html,
          }),
        })

        const emailData = await emailRes.json()

        if (emailRes.ok) {
          await supabase
            .from('newsletter_sends')
            .update({
              status:          'sent',
              sent_at:         new Date().toISOString(),
              provider_msg_id: emailData.id,
            })
            .eq('id', send.id)
          totalSent++
        } else {
          throw new Error(emailData.message ?? 'Send failed')
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        await supabase
          .from('newsletter_sends')
          .update({
            status:        send.retry_count + 1 >= MAX_RETRIES ? 'failed' : 'pending',
            failed_at:     new Date().toISOString(),
            error_message: message,
            retry_count:   send.retry_count + 1,
          })
          .eq('id', send.id)
        totalFailed++
      }
    }

    offset += BATCH_SIZE
  }

  // Mark newsletter as sent
  await supabase
    .from('newsletters')
    .update({
      status:       'sent',
      sent_at:      new Date().toISOString(),
      sent_count:   totalSent,
      failed_count: totalFailed,
    })
    .eq('id', newsletter_id)

  return new Response(
    JSON.stringify({ ok: true, sent: totalSent, failed: totalFailed }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
