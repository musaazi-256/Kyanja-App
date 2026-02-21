import { getProfiles } from '@/lib/db/users'
import { requirePermission } from '@/lib/rbac/check'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Users' }

const ROLE_COLORS: Record<string, string> = {
  admin:   'bg-purple-100 text-purple-700',
  staff:   'bg-blue-100 text-blue-700',
  teacher: 'bg-green-100 text-green-700',
}

export default async function UsersPage() {
  await requirePermission('users:read')
  const profiles = await getProfiles()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="text-slate-500 text-sm mt-0.5">{profiles.length} users</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => {
                const initials = profile.full_name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? 'U'
                return (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={profile.avatar_url ?? undefined} />
                          <AvatarFallback className="text-xs bg-[#1e3a5f] text-white">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{profile.full_name}</p>
                          <p className="text-xs text-slate-500">{profile.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${ROLE_COLORS[profile.role] ?? 'bg-slate-100 text-slate-600'} border-0 capitalize`}>
                        {profile.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={profile.is_active
                        ? 'bg-green-100 text-green-700 border-0'
                        : 'bg-red-100 text-red-700 border-0'
                      }>
                        {profile.is_active ? 'Active' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {profile.last_login_at ? format(new Date(profile.last_login_at), 'dd MMM yyyy') : '—'}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {format(new Date(profile.created_at), 'dd MMM yyyy')}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
