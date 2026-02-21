import { requirePermission } from '@/lib/rbac/check'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Shield, Bell, Globe, Database } from 'lucide-react'

export const metadata = { title: 'Settings — Kyanja Junior Admin' }

export default async function SettingsPage() {
  const profile = await requirePermission('users:read')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          System configuration and preferences.
        </p>
      </div>

      {/* Account info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="w-4 h-4" />
            Your Account
          </CardTitle>
          <CardDescription>Current session details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Name</span>
            <span className="text-sm font-medium">{profile.full_name ?? '—'}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Email</span>
            <span className="text-sm font-medium">{profile.email}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Role</span>
            <Badge variant="outline" className="capitalize">{profile.role}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Environment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="w-4 h-4" />
            Environment
          </CardTitle>
          <CardDescription>Runtime configuration overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Supabase URL</span>
            <span className="text-sm font-mono text-gray-500 truncate max-w-64">
              {process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').split('.')[0]}…
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Email service</span>
            <Badge variant="secondary">Resend</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Newsletter delivery</span>
            <Badge variant="secondary">Supabase Edge Functions</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Placeholders for future settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="w-4 h-4" />
              Notifications
            </CardTitle>
            <CardDescription>Email alert preferences — coming soon</CardDescription>
          </CardHeader>
        </Card>
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="w-4 h-4" />
              Public Site
            </CardTitle>
            <CardDescription>Additional homepage settings — coming soon</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
