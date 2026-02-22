'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MoreHorizontal, KeyRound, ShieldCheck, UserX, UserCheck, Trash2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  updateUserRole, updateUserStatus, setUserPassword,
  sendPasswordResetEmail, deleteUser,
} from '@/actions/users/manage'
import type { UserRole } from '@/types/app'

const ROLES: UserRole[] = ['admin', 'staff', 'teacher', 'parent', 'student']

interface Props {
  id: string
  role: UserRole
  isActive: boolean
  isSelf: boolean
}

type ActiveDialog = 'role' | 'password' | 'delete' | null

export default function UserRowActions({ id, role, isActive, isSelf }: Props) {
  const [pending, startTransition] = useTransition()
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole>(role)
  const [newPassword, setNewPassword] = useState('')
  const router = useRouter()

  function close() {
    setActiveDialog(null)
    setNewPassword('')
    setSelectedRole(role)
  }

  function handleRoleSave() {
    const fd = new FormData()
    fd.set('user_id', id)
    fd.set('role', selectedRole)
    startTransition(async () => {
      const res = await updateUserRole(fd)
      if (res.success) {
        toast.success(res.message ?? 'Role updated')
        close()
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  function handleToggleActive() {
    const fd = new FormData()
    fd.set('user_id', id)
    fd.set('is_active', String(!isActive))
    startTransition(async () => {
      const res = await updateUserStatus(fd)
      if (res.success) {
        toast.success(res.message ?? 'User updated')
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  function handleSetPassword() {
    const fd = new FormData()
    fd.set('user_id', id)
    fd.set('password', newPassword)
    startTransition(async () => {
      const res = await setUserPassword(fd)
      if (res.success) {
        toast.success(res.message ?? 'Password updated')
        close()
      } else {
        toast.error(res.error)
      }
    })
  }

  function handleSendResetEmail() {
    const fd = new FormData()
    fd.set('user_id', id)
    startTransition(async () => {
      const res = await sendPasswordResetEmail(fd)
      if (res.success) {
        toast.success(res.message ?? 'Reset email sent')
        close()
      } else {
        toast.error(res.error)
      }
    })
  }

  function handleDelete() {
    const fd = new FormData()
    fd.set('user_id', id)
    startTransition(async () => {
      const res = await deleteUser(fd)
      if (res.success) {
        toast.success(res.message ?? 'User deleted')
        close()
        router.refresh()
      } else {
        toast.error(res.error)
        close()
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pending}>
            <MoreHorizontal className="w-4 h-4" />
            <span className="sr-only">User actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Manage User</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => { setSelectedRole(role); setActiveDialog('role') }}
            disabled={isSelf}
          >
            <ShieldCheck className="w-4 h-4 mr-2 text-slate-500" />
            Change Role
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={handleToggleActive} disabled={isSelf || pending}>
            {isActive
              ? <><UserX className="w-4 h-4 mr-2 text-slate-500" />Disable Account</>
              : <><UserCheck className="w-4 h-4 mr-2 text-slate-500" />Enable Account</>
            }
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setActiveDialog('password')} disabled={isSelf}>
            <KeyRound className="w-4 h-4 mr-2 text-slate-500" />
            Set Password
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={handleSendResetEmail} disabled={isSelf || pending}>
            <Mail className="w-4 h-4 mr-2 text-slate-500" />
            Send Password Reset Email
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => setActiveDialog('delete')}
            disabled={isSelf}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Change Role dialog ── */}
      <Dialog open={activeDialog === 'role'} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>Select a new role for this user.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label>Role</Label>
            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)} disabled={pending}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close} disabled={pending}>Cancel</Button>
            <Button
              className="bg-[#1e3a5f] hover:bg-[#16305a]"
              onClick={handleRoleSave}
              disabled={pending || selectedRole === role}
            >
              {pending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Set Password dialog ── */}
      <Dialog open={activeDialog === 'password'} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Set Password</DialogTitle>
            <DialogDescription>Set a new password for this user's account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Min. 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={pending}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close} disabled={pending}>Cancel</Button>
            <Button
              className="bg-[#1e3a5f] hover:bg-[#16305a]"
              onClick={handleSetPassword}
              disabled={pending || newPassword.length < 8}
            >
              {pending ? 'Saving…' : 'Set Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation dialog ── */}
      <Dialog open={activeDialog === 'delete'} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This permanently deletes the user account and cannot be undone.
              If the user has related records, disable the account instead.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={close} disabled={pending}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={pending}>
              {pending ? 'Deleting…' : 'Delete Permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
