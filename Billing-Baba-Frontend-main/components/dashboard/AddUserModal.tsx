"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, X, AlertTriangle, ChevronsUpDown } from 'lucide-react'
import { addTeamMember } from '@/lib/api'
import { toast } from '@/components/ui/use-toast'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { cn } from '@/lib/utils'

// ─── Permission value types ──────────────────────────────────────────────────
type Perm = 'yes' | 'no' | 'na' | 'limited';
type PermRow = { label: string; view: Perm; create: Perm; edit: Perm; share: Perm; delete: Perm };

// ─── Role permission definitions ─────────────────────────────────────────────
const ROLE_PERMISSIONS: Record<string, PermRow[]> = {
  'secondary-admin': [
    { label: 'All Transactions', view: 'yes', create: 'yes', edit: 'yes',  share: 'yes', delete: 'yes' },
    { label: 'Settings',         view: 'yes', create: 'na',  edit: 'yes',  share: 'na',  delete: 'na'  },
    { label: 'Sync Settings',    view: 'no',  create: 'no',  edit: 'no',   share: 'na',  delete: 'no'  },
    { label: 'Reports',          view: 'yes', create: 'na',  edit: 'na',   share: 'yes', delete: 'na'  },
    { label: 'Stock Transfer',   view: 'yes', create: 'yes', edit: 'na',   share: 'yes', delete: 'yes' },
    { label: 'Party Smart Connect', view: 'yes', create: 'yes', edit: 'yes', share: 'na', delete: 'na' },
  ],
  'biller': [
    { label: 'Sale',              view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Payment-In',        view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Sale Order',        view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Credit Note',       view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Delivery Challan',  view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Estimate',          view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Purchase',          view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Payment-Out',       view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
  ],
  'biller-salesman': [
    { label: 'Sale',              view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Payment-In',        view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Sale Order',        view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Credit Note',       view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Delivery Challan',  view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Estimate',          view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Purchase',          view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Payment-Out',       view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
  ],
  'ca-accountant': [
    { label: 'All Transactions', view: 'yes', create: 'no',  edit: 'no',  share: 'yes', delete: 'no'  },
    { label: 'Settings',         view: 'no',  create: 'no',  edit: 'no',  share: 'no',  delete: 'no'  },
    { label: 'Sync Settings',    view: 'no',  create: 'no',  edit: 'no',  share: 'no',  delete: 'no'  },
    { label: 'Reports',          view: 'yes', create: 'yes', edit: 'yes', share: 'yes', delete: 'yes' },
    { label: 'Stock Transfer',   view: 'yes', create: 'no',  edit: 'na',  share: 'yes', delete: 'no'  },
  ],
  'salesman': [
    { label: 'Sale',              view: 'limited', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Payment-In',        view: 'limited', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Sale Order',        view: 'limited', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Credit Note',       view: 'limited', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Delivery Challan',  view: 'limited', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Estimate',          view: 'limited', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
  ],
  'stock-keeper': [
    { label: 'Items',            view: 'yes', create: 'yes', edit: 'yes', share: 'yes', delete: 'no'  },
    { label: 'Stock Transfer',   view: 'yes', create: 'yes', edit: 'na',  share: 'yes', delete: 'yes' },
    { label: 'Purchase',         view: 'yes', create: 'yes', edit: 'limited', share: 'yes', delete: 'no' },
    { label: 'Reports',          view: 'yes', create: 'na',  edit: 'na',  share: 'yes', delete: 'na'  },
  ],
};

const ROLE_LABELS: Record<string, string> = {
  'secondary-admin': 'Secondary Admin',
  'biller': 'Biller',
  'biller-salesman': 'Biller and Salesman',
  'ca-accountant': 'CA / Accountant',
  'salesman': 'Salesman',
  'stock-keeper': 'Stock Keeper',
};

// ─── Permission cell renderer ─────────────────────────────────────────────────
const PermCell = ({ value }: { value: Perm }) => {
  if (value === 'yes') return <Check className="h-4 w-4 text-green-500 mx-auto" strokeWidth={3} />;
  if (value === 'no')  return <X className="h-4 w-4 text-red-500 mx-auto" strokeWidth={3} />;
  if (value === 'limited') return <AlertTriangle className="h-4 w-4 text-gray-400 mx-auto" strokeWidth={1.5} />;
  return <span className="text-gray-400 text-xs mx-auto block text-center">NA</span>;
};

// ─── Main Component ───────────────────────────────────────────────────────────
interface AddUserModalProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

const AddUserModal = ({ children, onSuccess }: AddUserModalProps) => {
  const [open, setOpen] = useState(false);
  const [rolePopoverOpen, setRolePopoverOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', contact: '', userRole: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userRole) {
      toast({ title: 'Please choose a user role', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await addTeamMember({ name: formData.fullName, contact: formData.contact, role: formData.userRole });
      toast({ title: `${ROLE_LABELS[formData.userRole] || 'User'} added successfully` });
      setOpen(false);
      setFormData({ fullName: '', contact: '', userRole: '' });
      onSuccess?.();
    } catch (err: any) {
      toast({ title: err.message || 'Failed to add user', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const permissions = formData.userRole ? ROLE_PERMISSIONS[formData.userRole] : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 pt-5 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-800">Add User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {/* Top fields */}
          <div className="px-6 pt-4 pb-3 grid grid-cols-3 gap-4 items-start">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Enter Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                className="mt-1"
                placeholder=""
                value={formData.fullName}
                onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Enter Phone Number or Email <span className="text-red-500">*</span>
              </Label>
              <Input
                className="mt-1"
                placeholder=""
                value={formData.contact}
                onChange={e => setFormData(p => ({ ...p, contact: e.target.value }))}
                required
              />
              <p className="text-xs text-blue-500 mt-1">User will receive an invite on this number or email.</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Choose User Role <span className="text-red-500">*</span>
              </Label>
              <Popover open={rolePopoverOpen} onOpenChange={setRolePopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="mt-1 w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <span className={formData.userRole ? 'text-gray-900' : 'text-gray-400'}>
                      {formData.userRole ? ROLE_LABELS[formData.userRole] : 'Select a role'}
                    </span>
                    <ChevronsUpDown className="h-4 w-4 text-gray-400 shrink-0" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0 bg-white" align="start">
                  <Command className="bg-white text-gray-900">
                    <CommandInput placeholder="Search role..." className="text-gray-900 placeholder:text-gray-400" />
                    <CommandEmpty className="py-3 px-4 text-sm text-gray-500">No role found.</CommandEmpty>
                    <CommandGroup>
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <CommandItem
                          key={value}
                          value={label}
                          onSelect={() => {
                            setFormData(p => ({ ...p, userRole: value }));
                            setRolePopoverOpen(false);
                          }}
                          className="text-gray-900 cursor-pointer"
                        >
                          <Check className={cn('mr-2 h-4 w-4 text-blue-600', formData.userRole === value ? 'opacity-100' : 'opacity-0')} />
                          {label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Permissions table */}
          {permissions && (
            <div className="px-6 pb-4">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                {ROLE_LABELS[formData.userRole]} Permissions
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-5 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide w-2/5">Transactions</th>
                      {['VIEW','CREATE','EDIT','SHARE','DELETE'].map(h => (
                        <th key={h} className="px-4 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wide text-center">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                        <td className="px-5 py-3.5 text-gray-700 font-medium">{row.label}</td>
                        <td className="px-4 py-3.5 text-center"><PermCell value={row.view} /></td>
                        <td className="px-4 py-3.5 text-center"><PermCell value={row.create} /></td>
                        <td className="px-4 py-3.5 text-center"><PermCell value={row.edit} /></td>
                        <td className="px-4 py-3.5 text-center"><PermCell value={row.share} /></td>
                        <td className="px-4 py-3.5 text-center"><PermCell value={row.delete} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 flex justify-end border-t bg-white">
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-semibold px-10 rounded-full"
            >
              {saving ? 'Adding...' : 'Add User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
