import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/client'

// ── Brand colours ──────────────────────────────────────────────────────────────
const B = {
  navy:  '#000099',
  gold:  '#efb600',
  deep:  '#0a0a2e',
  sky:   '#5aa5ff',
  ice:   '#e8f0ff',
  white: '#ffffff',
  slate: '#1e293b',
  muted: '#64748b',
  light: '#f1f5f9',
  border:'#e2e8f0',
}

// ── Notify recipients ──────────────────────────────────────────────────────────
const NOTIFY_EMAILS = (
  process.env.DEPLOY_NOTIFY_EMAIL ??
  'muwulya@gmail.com,mitijulius24@gmail.com,admin@kjsch.com,director@kjsch.com'
).split(',').map(e => e.trim()).filter(Boolean)


// ── Conventional commit parser ─────────────────────────────────────────────────
interface CommitParts {
  type:     string
  scope:    string
  title:    string
  body:     string
  badge:    { label: string; bg: string; color: string }
}

function parseCommit(raw: string): CommitParts {
  const lines    = raw.trim().split('\n')
  const firstLine = lines[0].trim()
  const bodyLines = lines.slice(1).filter(l => l.trim()).map(l => l.trim())
  const body      = bodyLines.join('<br>')

  const match = firstLine.match(/^(\w+)(?:\(([^)]+)\))?!?:\s*(.+)$/)

  if (!match) {
    return {
      type: '', scope: '', title: firstLine, body,
      badge: { label: 'UPDATE', bg: B.ice, color: B.navy },
    }
  }

  const [, type, scope = '', title] = match

  const BADGES: Record<string, { label: string; bg: string; color: string }> = {
    feat:     { label: 'NEW FEATURE',    bg: B.ice,     color: B.navy    },
    fix:      { label: 'BUG FIX',        bg: '#f0fdf4', color: '#166534' },
    perf:     { label: 'PERFORMANCE',    bg: '#fff7ed', color: '#9a3412' },
    style:    { label: 'DESIGN UPDATE',  bg: '#faf5ff', color: '#6b21a8' },
    refactor: { label: 'IMPROVEMENT',    bg: '#eff6ff', color: '#1d4ed8' },
    docs:     { label: 'DOCUMENTATION',  bg: '#f0fdfa', color: '#0f766e' },
    chore:    { label: 'MAINTENANCE',    bg: B.light,   color: B.muted   },
    test:     { label: 'TESTS',          bg: '#fff7ed', color: '#c2410c' },
    build:    { label: 'BUILD',          bg: B.light,   color: B.muted   },
    ci:       { label: 'CI / CD',        bg: B.light,   color: B.muted   },
    revert:   { label: 'REVERT',         bg: '#fef2f2', color: '#991b1b' },
  }

  return {
    type,
    scope,
    title,
    body,
    badge: BADGES[type] ?? { label: type.toUpperCase(), bg: B.ice, color: B.navy },
  }
}

// ── Email HTML builder ─────────────────────────────────────────────────────────
function buildEmailHtml(opts: {
  isSuccess:     boolean
  projectName:   string
  target:        string
  branch:        string
  commitMessage: string
  commitAuthor:  string
  commitSha:     string
  deploymentUrl: string
  dashboardUrl:  string
  buildDuration: string
  readyAt:       string
  reportNo:      string
}): string {
  const {
    isSuccess, projectName, target, branch,
    commitMessage, commitAuthor, commitSha,
    deploymentUrl, dashboardUrl, buildDuration, readyAt, reportNo,
  } = opts

  const isProd   = target === 'production'
  const commit   = parseCommit(commitMessage)

  const STATUS_BG    = isSuccess ? '#f0fdf4' : '#fef2f2'
  const STATUS_COLOR = isSuccess ? '#15803d' : '#dc2626'
  const STATUS_LABEL = isSuccess ? 'Deployment Successful' : 'Deployment Failed'
  const STATUS_ICON  = isSuccess ? '✅' : '❌'

  const ENV_BADGE = isProd
    ? `<span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:800;letter-spacing:1px;background:#fef3c7;color:#92400e;">🚀&nbsp;PRODUCTION</span>`
    : `<span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:800;letter-spacing:1px;background:#ede9fe;color:#5b21b6;">🔍&nbsp;PREVIEW</span>`

  /* ── Metadata rows helper ── */
  function row(label: string, value: string) {
    return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid ${B.border};font-size:11px;font-weight:700;color:${B.muted};text-transform:uppercase;letter-spacing:0.5px;width:130px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;border-bottom:1px solid ${B.border};font-size:13px;color:${B.slate};vertical-align:top;">${value}</td>
    </tr>`
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Deployment Report · Kyanja Junior School</title>
</head>
<body style="margin:0;padding:0;background:${B.light};font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
  style="background:${B.light};padding:32px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
  style="max-width:600px;">

  <!-- ── Gold top bar ─────────────────────────────────────────────── -->
  <tr><td style="background:${B.gold};height:5px;border-radius:8px 8px 0 0;font-size:0;">&nbsp;</td></tr>

  <!-- ── Header ───────────────────────────────────────────────────── -->
  <tr><td style="background:${B.deep};padding:32px 36px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td>
          <!-- School name -->
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:4px;color:${B.gold};text-transform:uppercase;">Kyanja Junior School</p>
          <p style="margin:0 0 2px;font-size:22px;font-weight:700;color:${B.white};line-height:1.2;">Website Deployment Report</p>
          <p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.45);letter-spacing:0.3px;">Report&nbsp;#${reportNo} &nbsp;·&nbsp; kyanjajuniorschool.com</p>
        </td>
        <td style="text-align:right;vertical-align:top;padding-top:4px;">
          <!-- Decorative gold dot cluster -->
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${B.gold};margin-right:4px;"></span>
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:rgba(239,182,0,0.45);"></span>
        </td>
      </tr>
    </table>
    <!-- Gold divider line -->
    <div style="margin-top:20px;height:1px;background:linear-gradient(to right,${B.gold},transparent);"></div>
  </td></tr>

  <!-- ── Status banner ─────────────────────────────────────────────── -->
  <tr><td style="background:${STATUS_BG};border-left:4px solid ${STATUS_COLOR};padding:16px 36px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td>
          <p style="margin:0;font-size:15px;font-weight:700;color:${STATUS_COLOR};">${STATUS_ICON}&nbsp;&nbsp;${STATUS_LABEL}</p>
          <p style="margin:3px 0 0;font-size:12px;color:${B.muted};">${readyAt} &nbsp;·&nbsp; East Africa Time</p>
        </td>
        <td style="text-align:right;">${ENV_BADGE}</td>
      </tr>
    </table>
  </td></tr>

  <!-- ── Body ──────────────────────────────────────────────────────── -->
  <tr><td style="background:${B.white};border:1px solid ${B.border};border-top:none;padding:32px 36px;">

    <!-- Section: Deployment Summary -->
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:2px;color:${B.navy};text-transform:uppercase;border-bottom:2px solid ${B.navy};padding-bottom:6px;display:inline-block;">Deployment Summary</p>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
      ${row('Project',     `<strong>${projectName}</strong>`)}
      ${row('Environment', ENV_BADGE)}
      ${row('Branch',      `<code style="background:${B.ice};color:${B.navy};padding:2px 7px;border-radius:4px;font-size:12px;">${branch}</code>`)}
      ${row('Deployed by', commitAuthor)}
      ${row('Build time',  buildDuration)}
      ${row('Commit',      `<code style="background:${B.ice};color:${B.navy};padding:2px 7px;border-radius:4px;font-size:12px;">${commitSha}</code>`)}
      ${row('Live URL',    `<a href="${deploymentUrl}" style="color:${B.navy};font-weight:600;text-decoration:none;">${deploymentUrl.replace('https://', '')}</a>`)}
    </table>

    <!-- Section: Changes & Improvements -->
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:2px;color:${B.navy};text-transform:uppercase;border-bottom:2px solid ${B.navy};padding-bottom:6px;display:inline-block;">Changes &amp; Improvements</p>

    <div style="border-left:4px solid ${B.gold};background:${B.ice};border-radius:0 8px 8px 0;padding:18px 20px;margin-bottom:${commit.body ? '0' : '28px'};">

      ${commit.badge.label ? `
      <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:800;letter-spacing:1px;background:${commit.badge.bg};color:${commit.badge.color};margin-bottom:10px;">${commit.badge.label}${commit.scope ? `&nbsp;·&nbsp;${commit.scope}` : ''}</span>
      ` : ''}

      <p style="margin:0;font-size:15px;font-weight:700;color:${B.deep};line-height:1.4;">${commit.title}</p>
    </div>

    ${commit.body ? `
    <div style="border-left:4px solid ${B.border};background:#fafafa;border-radius:0 8px 8px 0;padding:14px 20px;margin-bottom:28px;border-top:none;">
      <p style="margin:0;font-size:13px;color:${B.muted};line-height:1.7;">${commit.body}</p>
    </div>
    ` : ''}

    ${isSuccess ? `
    <!-- CTA buttons -->
    <table cellpadding="0" cellspacing="0" role="presentation" style="margin-top:28px;">
      <tr>
        <td style="padding-right:10px;">
          <table cellpadding="0" cellspacing="0" role="presentation">
            <tr><td style="border-radius:6px;background:${B.navy};">
              <a href="${deploymentUrl}"
                style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:700;color:${B.white};text-decoration:none;letter-spacing:0.5px;">
                View Live Site &rarr;
              </a>
            </td></tr>
          </table>
        </td>
        <td>
          <table cellpadding="0" cellspacing="0" role="presentation">
            <tr><td style="border-radius:6px;border:1.5px solid ${B.navy};">
              <a href="${dashboardUrl}"
                style="display:inline-block;padding:11px 20px;font-size:13px;font-weight:600;color:${B.navy};text-decoration:none;letter-spacing:0.3px;">
                Vercel Dashboard
              </a>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
    ` : `
    <!-- Failure: dashboard link only -->
    <table cellpadding="0" cellspacing="0" role="presentation" style="margin-top:28px;">
      <tr><td style="border-radius:6px;background:#dc2626;">
        <a href="${dashboardUrl}"
          style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:700;color:${B.white};text-decoration:none;">
          View Build Logs &rarr;
        </a>
      </td></tr>
    </table>
    `}

  </td></tr>

  <!-- ── Footer ────────────────────────────────────────────────────── -->
  <tr><td style="background:${B.ice};border:1px solid ${B.border};border-top:none;border-radius:0 0 8px 8px;padding:22px 36px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="vertical-align:top;">
          <p style="margin:0 0 2px;font-size:12px;font-weight:700;color:${B.navy};">Kyanja Junior School</p>
          <p style="margin:0;font-size:11px;color:${B.muted};">Kyanja, Kisaasi · Nakawa Division · Kampala, Uganda</p>
          <p style="margin:4px 0 0;font-size:11px;color:${B.muted};">
            <a href="mailto:admin@kjsch.com" style="color:${B.navy};text-decoration:none;">admin@kjsch.com</a>
            &nbsp;·&nbsp;
            <a href="https://kyanjajuniorschool.com" style="color:${B.navy};text-decoration:none;">kyanjajuniorschool.com</a>
          </p>
        </td>
        <td style="text-align:right;vertical-align:top;">
          <p style="margin:0;font-size:10px;color:${B.muted};font-style:italic;">Automated deployment report</p>
          <p style="margin:2px 0 0;font-size:10px;color:${B.muted};">Do not reply to this email</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ── Bottom gold bar ───────────────────────────────────────────── -->
  <tr><td style="background:${B.gold};height:3px;border-radius:0 0 8px 8px;font-size:0;">&nbsp;</td></tr>

</table>
</td></tr>
</table>

</body>
</html>`
}

// ── Timing-safe string equality (for Bearer token check) ──────────────────────
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// ── Route handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  const bearerToken = process.env.DEPLOY_HOOK_TOKEN
  if (!bearerToken) {
    return NextResponse.json({ error: 'DEPLOY_HOOK_TOKEN not configured' }, { status: 500 })
  }
  const auth  = req.headers.get('authorization') ?? ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!safeEqual(token, bearerToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let event: Record<string, unknown>
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const type = event.type as string
  if (type !== 'deployment.succeeded' && type !== 'deployment.error') {
    return NextResponse.json({ ignored: true })
  }

  const isSuccess  = type === 'deployment.succeeded'
  const payload    = event.payload as Record<string, unknown>
  const deployment = payload.deployment as Record<string, unknown>
  const meta       = (deployment.meta  ?? {}) as Record<string, string>
  const links      = (payload.links    ?? {}) as Record<string, string>

  const projectName   = (deployment.name   as string) ?? 'kyanjajuniorschool.com'
  const target        = (deployment.target as string) ?? 'preview'
  const branch        = meta.githubBranch             ?? 'main'
  const commitMessage = meta.githubCommitMessage      ?? '(no commit message)'
  const commitAuthor  = meta.githubCommitAuthorName   ?? 'Unknown'
  const commitSha     = (meta.githubCommitSha ?? '').slice(0, 7) || 'unknown'
  const deploymentUrl = `https://${deployment.url as string}`
  const dashboardUrl  = (links.deployment as string)  ?? 'https://vercel.com'

  // Build duration
  const buildingAt = deployment.buildingAt as number | undefined
  const readyAtMs  = deployment.readyAt    as number | undefined
  const buildDuration = (buildingAt && readyAtMs)
    ? `${Math.round((readyAtMs - buildingAt) / 1000)}s`
    : '—'

  const readyAt = new Date(readyAtMs ?? Date.now()).toLocaleString('en-GB', {
    timeZone: 'Africa/Nairobi',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  // Short report number from event id or timestamp
  const reportNo = ((event.id as string) ?? '').slice(-6).toUpperCase() ||
    Date.now().toString(36).toUpperCase().slice(-6)

  const firstLine    = commitMessage.split('\n')[0].slice(0, 60)
  const subject      = isSuccess
    ? `✅ Deployed: ${firstLine} — ${projectName}`
    : `❌ Build failed on ${branch} — ${projectName}`

  try {
    await sendEmail({
      to:   NOTIFY_EMAILS,
      subject,
      html: buildEmailHtml({
        isSuccess, projectName, target, branch,
        commitMessage, commitAuthor, commitSha,
        deploymentUrl, dashboardUrl, buildDuration, readyAt, reportNo,
      }),
    })
  } catch (err) {
    console.error('[deploy-hook] email failed', err)
    return NextResponse.json({ ok: true, emailError: String(err) })
  }

  return NextResponse.json({ ok: true })
}
