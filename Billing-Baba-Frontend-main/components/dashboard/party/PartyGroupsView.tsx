"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Plus, MoreVertical, Search, Users, Pencil, Trash2, MoveRight } from 'lucide-react';
import {
    fetchPartyGroups,
    createPartyGroup,
    updatePartyGroup,
    deletePartyGroup,
    fetchPartiesByGroup,
    movePartyToGroup,
} from '@/lib/api';

interface GroupItem {
    _id: string;
    name: string;
    description?: string;
    count: number;
    balance: number;
}

interface PartyItem {
    _id: string;
    name: string;
    phone?: string;
    currentBalance?: number;
    partyType?: string;
}

interface MoveModalState {
    partyId: string;
    partyName: string;
    groups: GroupItem[];
}

export default function PartyGroupsView() {
    const [groups, setGroups] = useState<GroupItem[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<GroupItem | null>(null);
    const [parties, setParties] = useState<PartyItem[]>([]);
    const [search, setSearch] = useState('');
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    const [isLoadingParties, setIsLoadingParties] = useState(false);

    // Add/Edit group modal
    const [groupModal, setGroupModal] = useState<{ open: boolean; mode: 'add' | 'edit'; group?: GroupItem }>({ open: false, mode: 'add' });
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [groupError, setGroupError] = useState('');

    // Three-dot menu
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Move party modal
    const [moveModal, setMoveModal] = useState<MoveModalState | null>(null);

    useEffect(() => {
        loadGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) loadParties(selectedGroup.name);
    }, [selectedGroup]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const loadGroups = async () => {
        setIsLoadingGroups(true);
        try {
            const data = await fetchPartyGroups();
            setGroups(data);
            if (data.length > 0 && !selectedGroup) setSelectedGroup(data[0]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingGroups(false);
        }
    };

    const loadParties = async (groupName: string) => {
        setIsLoadingParties(true);
        setParties([]);
        try {
            const data = await fetchPartiesByGroup(groupName);
            setParties(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingParties(false);
        }
    };

    const openAddModal = () => {
        setGroupName('');
        setGroupDesc('');
        setGroupError('');
        setGroupModal({ open: true, mode: 'add' });
    };

    const openEditModal = (g: GroupItem) => {
        setGroupName(g.name);
        setGroupDesc(g.description || '');
        setGroupError('');
        setGroupModal({ open: true, mode: 'edit', group: g });
        setMenuOpen(null);
    };

    const handleGroupSave = async () => {
        if (!groupName.trim()) { setGroupError('Group name is required'); return; }
        try {
            if (groupModal.mode === 'add') {
                await createPartyGroup(groupName.trim(), groupDesc.trim() || undefined);
            } else if (groupModal.group && groupModal.group._id !== 'general') {
                await updatePartyGroup(groupModal.group._id, groupName.trim(), groupDesc.trim() || undefined);
            }
            await loadGroups();
            setGroupModal({ open: false, mode: 'add' });
        } catch (e: any) {
            setGroupError(e.message || 'Failed to save group');
        }
    };

    const handleDeleteGroup = async (g: GroupItem) => {
        if (g._id === 'general') return;
        if (!confirm(`Delete group "${g.name}"? All parties will be moved to General.`)) return;
        try {
            await deletePartyGroup(g._id);
            await loadGroups();
            setMenuOpen(null);
            if (selectedGroup?._id === g._id) setSelectedGroup(null);
        } catch (e) {
            console.error(e);
        }
    };

    const handleMoveParty = async (toGroupName: string) => {
        if (!moveModal) return;
        try {
            await movePartyToGroup(moveModal.partyId, toGroupName);
            setMoveModal(null);
            if (selectedGroup) loadParties(selectedGroup.name);
            loadGroups();
        } catch (e) {
            console.error(e);
        }
    };

    const filteredParties = parties.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.phone || '').includes(search)
    );

    const formatBalance = (b: number) => {
        if (b === 0) return <span className="text-gray-400">₹0</span>;
        return b > 0
            ? <span className="text-green-600">₹{b.toLocaleString()}</span>
            : <span className="text-red-500">-₹{Math.abs(b).toLocaleString()}</span>;
    };

    return (
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* LEFT: Groups List */}
            <div className="w-full md:w-72 border-r border-gray-200 bg-white flex flex-col shrink-0">
                {/* Groups header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <div className="grid grid-cols-2 flex-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <span>GROUP</span>
                        <span className="text-right">PARTIES</span>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="ml-3 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md"
                        title="Add Group"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                {/* Groups */}
                <div className="flex-1 overflow-y-auto">
                    {isLoadingGroups ? (
                        <div className="py-10 text-center text-sm text-gray-400">Loading...</div>
                    ) : groups.length === 0 ? (
                        <div className="py-10 text-center text-sm text-gray-400">No groups yet</div>
                    ) : (
                        groups.map(g => (
                            <div
                                key={g._id}
                                onClick={() => setSelectedGroup(g)}
                                className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${selectedGroup?._id === g._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                        <Users className="h-4 w-4 text-indigo-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{g.name}</p>
                                        <p className="text-xs text-gray-400">{g.count} {g.count === 1 ? 'party' : 'parties'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0" ref={g._id === menuOpen ? menuRef : undefined}>
                                    <span className="text-xs text-gray-500">{formatBalance(g.balance)}</span>
                                    {g._id !== 'general' && (
                                        <div className="relative">
                                            <button
                                                onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === g._id ? null : g._id); }}
                                                className="p-1 hover:bg-gray-200 rounded-full"
                                            >
                                                <MoreVertical className="h-4 w-4 text-gray-400" />
                                            </button>
                                            {menuOpen === g._id && (
                                                <div className="absolute right-0 top-7 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-36">
                                                    <button
                                                        onClick={e => { e.stopPropagation(); openEditModal(g); }}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" /> Rename
                                                    </button>
                                                    <button
                                                        onClick={e => { e.stopPropagation(); handleDeleteGroup(g); }}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT: Parties in selected group */}
            <div className="flex-1 bg-white flex flex-col overflow-hidden">
                {!selectedGroup ? (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                        Select a group to view parties
                    </div>
                ) : (
                    <>
                        {/* Group detail header */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
                            <div>
                                <h2 className="text-base font-semibold text-gray-800">{selectedGroup.name}</h2>
                                <p className="text-xs text-gray-500">{selectedGroup.count} {selectedGroup.count === 1 ? 'party' : 'parties'} · Balance: {formatBalance(selectedGroup.balance)}</p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="px-4 py-2 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search parties..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                                />
                            </div>
                        </div>

                        {/* Parties table */}
                        <div className="flex-1 overflow-y-auto">
                            {isLoadingParties ? (
                                <div className="py-10 text-center text-sm text-gray-400">Loading parties...</div>
                            ) : filteredParties.length === 0 ? (
                                <div className="py-10 text-center text-sm text-gray-400">
                                    {search ? 'No parties match your search' : 'No parties in this group'}
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="text-left px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Party Name</th>
                                            <th className="text-left px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Phone</th>
                                            <th className="text-right px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Balance</th>
                                            <th className="text-right px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Move</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredParties.map(p => (
                                            <tr key={p._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
                                                            {p.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-gray-800">{p.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2.5 text-gray-500">{p.phone || '-'}</td>
                                                <td className="px-4 py-2.5 text-right">{formatBalance(p.currentBalance || 0)}</td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <button
                                                        onClick={() => setMoveModal({ partyId: p._id, partyName: p.name, groups })}
                                                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                                                        title="Move to another group"
                                                    >
                                                        <MoveRight className="h-3.5 w-3.5" /> Move
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Add/Edit Group Modal */}
            {groupModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
                        <h3 className="text-base font-semibold text-gray-800 mb-4">
                            {groupModal.mode === 'add' ? 'Add Group' : 'Rename Group'}
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Group Name *</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={groupName}
                                    onChange={e => setGroupName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleGroupSave()}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="e.g. Retail Customers"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Description (optional)</label>
                                <input
                                    type="text"
                                    value={groupDesc}
                                    onChange={e => setGroupDesc(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Brief description"
                                />
                            </div>
                            {groupError && <p className="text-xs text-red-500">{groupError}</p>}
                        </div>
                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                onClick={() => setGroupModal({ open: false, mode: 'add' })}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGroupSave}
                                className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                            >
                                {groupModal.mode === 'add' ? 'Create' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Move Party Modal */}
            {moveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
                        <h3 className="text-base font-semibold text-gray-800 mb-1">Move Party</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Move <span className="font-medium text-gray-800">{moveModal.partyName}</span> to:
                        </p>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {moveModal.groups
                                .filter(g => g.name !== selectedGroup?.name)
                                .map(g => (
                                    <button
                                        key={g._id}
                                        onClick={() => handleMoveParty(g.name)}
                                        className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-indigo-400" />
                                            <span className="font-medium text-gray-800">{g.name}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">{g.count} parties</span>
                                    </button>
                                ))}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setMoveModal(null)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
