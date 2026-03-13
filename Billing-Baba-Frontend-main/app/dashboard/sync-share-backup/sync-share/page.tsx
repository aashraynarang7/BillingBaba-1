"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import AddUserModal from '@/components/dashboard/AddUserModal'
import { fetchTeamMembers, removeTeamMember } from '@/lib/api'
import { RefreshCw, Info, UserPlus, MoreVertical, Trash2, Shield, Users } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const ROLE_LABELS: Record<string, string> = {
  'secondary-admin': 'Secondary Admin',
  'biller': 'Biller',
  'biller-salesman': 'Biller and Salesman',
  'ca-accountant': 'CA / Accountant',
  'salesman': 'Salesman',
  'stock-keeper': 'Stock Keeper',
}

const ROLE_COLORS: Record<string, string> = {
  'secondary-admin': 'bg-purple-100 text-purple-700',
  'biller': 'bg-blue-100 text-blue-700',
  'biller-salesman': 'bg-cyan-100 text-cyan-700',
  'ca-accountant': 'bg-green-100 text-green-700',
  'salesman': 'bg-orange-100 text-orange-700',
  'stock-keeper': 'bg-yellow-100 text-yellow-700',
}

interface TeamMember {
  _id: string
  name: string
  contact: string
  role: string
  addedAt?: string
}

const SyncSharePage = () => {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTeamMembers()
      setMembers(data)
    } catch {
      toast({ title: 'Failed to load team members', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleRemove = async (memberId: string, name: string) => {
    if (!confirm(`Remove ${name} from the team?`)) return
    setRemovingId(memberId)
    try {
      await removeTeamMember(memberId)
      toast({ title: `${name} removed successfully` })
      load()
    } catch {
      toast({ title: 'Failed to remove member', variant: 'destructive' })
    } finally {
      setRemovingId(null)
    }
  }

  const loggedInPhone = (() => {
    if (typeof window === 'undefined') return '—'
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      return user.phoneNumber || '—'
    } catch {
      return '—'
    }
  })()

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sync &amp; Share</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your team members and their access roles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={load} title="Refresh">
            <RefreshCw className={`h-5 w-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" className="hidden sm:flex gap-2 text-gray-600">
            <Info className="h-4 w-4" />
            Know More
          </Button>
          <AddUserModal onSuccess={load}>
            <Button className="bg-red-500 hover:bg-red-600 text-white gap-2">
              <UserPlus className="h-4 w-4" />
              + Add Users
            </Button>
          </AddUserModal>
        </div>
      </div>

      {/* Logged-in info card */}
      <div className="bg-white rounded-lg border border-gray-200 px-5 py-4 flex items-center justify-between shadow-sm">
        <p className="text-sm text-gray-600">
          Currently logged in with the following number:{' '}
          <span className="font-semibold text-gray-900 ml-1">{loggedInPhone}</span>
        </p>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </Button>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <h2 className="font-semibold text-gray-800">Team Members</h2>
          {members.length > 0 && (
            <span className="ml-auto text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">
              {members.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
          </div>
        ) : members.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
              <UserPlus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">You have not added any users till now.</h3>
            <p className="text-sm text-gray-500 mb-8 max-w-sm">
              Add users, assign roles and let your employees manage your business
            </p>
            <AddUserModal onSuccess={load}>
              <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white gap-2 rounded-full px-8">
                <UserPlus className="h-5 w-5" />
                + Add Users
              </Button>
            </AddUserModal>
          </div>
        ) : (
          /* Members table */
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-medium uppercase tracking-wide">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Contact</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">Added On</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold text-sm shrink-0">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{m.contact}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[m.role] || 'bg-gray-100 text-gray-600'}`}>
                      <Shield className="h-3 w-3" />
                      {ROLE_LABELS[m.role] || m.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {m.addedAt ? new Date(m.addedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          disabled={removingId === m._id}
                          onClick={() => handleRemove(m._id, m.name)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {removingId === m._id ? 'Removing...' : 'Remove User'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default SyncSharePage
