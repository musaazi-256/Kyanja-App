import { getProfiles, getCurrentProfile } from '@/lib/db/users'
import { requirePermission } from '@/lib/rbac/check'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import type { Profile, UserRole } from '@/types/app'
import AddUserDialog from '@/components/admin/users/AddUserDialog'
import UserRowActions from '@/components/admin/users/UserRowActions'

export const metadata: Metadata = { title: 'Users' }

const ROLE_COLORS: Record<string, string> = {
  admin:   'bg-purple-100 text-purple-700',
  staff:   'bg-blue-100 text-blue-700',
  teacher: 'bg-green-100 text-green-700',
}

export default async function UsersPage() {
  await requirePermission('users:read')
  const profiles: Profile[] = await getProfiles()
  const me = await getCurrentProfile()

  const counts = {
    all:      profiles.length,
    active:   profiles.filter((p: Profile) => p.is_active).length,
    disabled: profiles.filter((p: Profile) => !p.is_active).length,
    admin:    profiles.filter((p: Profile) => p.role === 'admin').length,
    staff:    profiles.filter((p: Profile) => p.role === 'staff').length,
    teacher:  profiles.filter((p: Profile) => p.role === 'teacher').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 text-sm mt-0.5">{profiles.length} users</p>
        </div>
        <AddUserDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="px-4 pt-2 pb-0 border-b bg-slate-50/70 overflow-x-auto">
            <div className="flex items-center text-sm min-w-max">
              {[
                ['All', counts.all],
                ['Active', counts.active],
                ['Disabled', counts.disabled],
                ['Admins', counts.admin],
                ['Staff', counts.staff],
                ['Teachers', counts.teacher],
              ].map(([label, count]) => (
                <span
                  key={label as string}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 whitespace-nowrap text-slate-700 font-medium"
                >
                  <span>{label}</span>
                  <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs px-1.5">
                    {count as number}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100/90 hover:bg-slate-100/90">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Last Login</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile: Profile) => {
                const initials = profile.full_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() ?? 'U'
                return (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
                          <AvatarImage src={profile.avatar_url ?? undefined} />
                          <AvatarFallback className="text-xs bg-blue-900 text-white">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{profile.full_name}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[140px] sm:max-w-none">{profile.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${ROLE_COLORS[profile.role] ?? 'bg-slate-100 text-slate-600'} border-0 capitalize`}>
                        {profile.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className={profile.is_active
                        ? 'bg-green-100 text-green-700 border-0'
                        : 'bg-red-100 text-red-700 border-0'
                      }>
                        {profile.is_active ? 'Active' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500 text-sm">
                      {profile.last_login_at ? format(new Date(profile.last_login_at), 'dd MMM yyyy') : '—'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-500 text-sm">
                      {format(new Date(profile.created_at), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      <UserRowActions
                        id={profile.id}
                        role={profile.role as UserRole}
                        isActive={profile.is_active ?? true}
                        isSelf={me?.id === profile.id}
                      />
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
