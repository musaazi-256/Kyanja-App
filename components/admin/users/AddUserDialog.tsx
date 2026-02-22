'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { createUserWithPassword, inviteUser } from '@/actions/users/manage'

const ROLES = ['admin', 'staff', 'teacher', 'parent', 'student'] as const

export default function AddUserDialog() {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  // Create tab state
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<string>('staff')

  // Invite tab state
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteFullName, setInviteFullName] = useState('')
  const [inviteRole, setInviteRole] = useState<string>('staff')

  function resetCreate() {
    setEmail('')
    setFullName('')
    setPassword('')
    setRole('staff')
  }

  function resetInvite() {
    setInviteEmail('')
    setInviteFullName('')
    setInviteRole('staff')
  }

  function handleCreate() {
    const fd = new FormData()
    fd.set('email', email)
    fd.set('full_name', fullName)
    fd.set('password', password)
    fd.set('role', role)

    startTransition(async () => {
      const res = await createUserWithPassword(fd)
      if (res.success) {
        toast.success(res.message ?? 'User created')
        resetCreate()
        setOpen(false)
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  function handleInvite() {
    const fd = new FormData()
    fd.set('email', inviteEmail)
    fd.set('full_name', inviteFullName)
    fd.set('role', inviteRole)

    startTransition(async () => {
      const res = await inviteUser(fd)
      if (res.success) {
        toast.success(res.message ?? 'Invite sent')
        resetInvite()
        setOpen(false)
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[#1e3a5f] hover:bg-[#16305a]">
          <Plus className="w-4 h-4 mr-1.5" />
          Add User
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Create an account with a password, or send an email invite.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="create">
          <TabsList className="w-full">
            <TabsTrigger value="create" className="flex-1">Create Account</TabsTrigger>
            <TabsTrigger value="invite" className="flex-1">Send Invite</TabsTrigger>
          </TabsList>

          {/* ── Create with password ── */}
          <TabsContent value="create" className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-name">Full Name</Label>
              <Input
                id="create-name"
                placeholder="Jane Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={pending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-role">Role</Label>
              <Select value={role} onValueChange={setRole} disabled={pending}>
                <SelectTrigger id="create-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={pending}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
                Cancel
              </Button>
              <Button
                className="bg-[#1e3a5f] hover:bg-[#16305a]"
                onClick={handleCreate}
                disabled={pending || !email || !fullName || !password}
              >
                {pending ? 'Creating…' : 'Create Account'}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* ── Invite by email ── */}
          <TabsContent value="invite" className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={pending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-name">Full Name</Label>
              <Input
                id="invite-name"
                placeholder="Jane Smith"
                value={inviteFullName}
                onChange={(e) => setInviteFullName(e.target.value)}
                disabled={pending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole} disabled={pending}>
                <SelectTrigger id="invite-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-slate-500">
              The user will receive an email with a link to set their own password.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
                Cancel
              </Button>
              <Button
                className="bg-[#1e3a5f] hover:bg-[#16305a]"
                onClick={handleInvite}
                disabled={pending || !inviteEmail || !inviteFullName}
              >
                {pending ? 'Sending…' : 'Send Invite'}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
