"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, X, Info, ChevronDown } from 'lucide-react';
import { createParty, updateParty } from '@/lib/api';

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
    "Jammu & Kashmir", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep", "Puducherry", "Andaman & Nicobar Islands", "Ladakh"
].sort();

const GST_STATE_CODES: Record<string, string> = {
    '01': 'Jammu & Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab', '04': 'Chandigarh',
    '05': 'Uttarakhand', '06': 'Haryana', '07': 'Delhi', '08': 'Rajasthan',
    '09': 'Uttar Pradesh', '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh',
    '13': 'Nagaland', '14': 'Manipur', '15': 'Mizoram', '16': 'Tripura',
    '17': 'Meghalaya', '18': 'Assam', '19': 'West Bengal', '20': 'Jharkhand',
    '21': 'Odisha', '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
    '26': 'Dadra and Nagar Haveli and Daman and Diu', '27': 'Maharashtra', '29': 'Karnataka',
    '30': 'Goa', '31': 'Lakshadweep', '32': 'Kerala', '33': 'Tamil Nadu',
    '34': 'Puducherry', '35': 'Andaman & Nicobar Islands', '36': 'Telangana',
    '37': 'Andhra Pradesh', '38': 'Ladakh'
};

interface EditPartyModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'add' | 'edit';
    party?: any;
    onSuccess?: () => void;
}

export const EditPartyModal = ({ isOpen, onClose, mode = 'add', party, onSuccess }: EditPartyModalProps) => {
    const [activeTab, setActiveTab] = useState('GST & Address');
    const tabs = ['GST & Address', 'Credit & Balance', 'Additional Fields'];

    // Form Constants
    const [isShippingEnabled, setIsShippingEnabled] = useState(false);
    const [gstError, setGstError] = useState('');
    const [isGstVerified, setIsGstVerified] = useState(false);

    const initialFormState = {
        name: '',
        gstin: '',
        phone: '',
        partyGroup: 'General',
        gstType: 'Unregistered/Consumer',
        state: 'Andhra Pradesh', // Default
        email: '',
        billingAddress: '',
        shippingAddress: '',
        openingBalance: 0,
        balanceType: 'To Receive',
        asOfDate: new Date().toISOString().split('T')[0],
        loyaltyPoints: 0,
        isCreditLimitEnabled: false,
        creditLimit: 0,
        // Additional field place holders
    };

    const [formData, setFormData] = useState(initialFormState);

    // Additional Fields State
    const [additionalFields, setAdditionalFields] = useState([
        { id: 1, label: '', value: '', enabled: false, type: 'text' },
        { id: 2, label: '', value: '', enabled: false, type: 'text' },
        { id: 3, label: '', value: '', enabled: false, type: 'text' },
        { id: 4, label: '', value: '', enabled: false, type: 'text' },
    ]);

    // Initialize/Reset form data
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && party) {
                setFormData({
                    ...initialFormState,
                    ...party,
                    openingBalance: party.openingBalance ? Math.abs(party.openingBalance) : 0,
                    balanceType: party.openingBalance < 0 ? 'To Pay' : 'To Receive',
                    // Handle date format if needed
                    asOfDate: party.asOfDate ? new Date(party.asOfDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                });
                setIsShippingEnabled(!!party.shippingAddress);

                // Populate Additional Fields
                if (party.additionalFields) {
                    const keys = Object.keys(party.additionalFields);
                    const newFields = [
                        { id: 1, label: '', value: '', enabled: false, type: 'text' },
                        { id: 2, label: '', value: '', enabled: false, type: 'text' },
                        { id: 3, label: '', value: '', enabled: false, type: 'text' },
                        { id: 4, label: '', value: '', enabled: false, type: 'text' },
                    ];

                    keys.forEach((key, index) => {
                        if (index < 4) {
                            newFields[index] = {
                                ...newFields[index],
                                label: key,
                                value: party.additionalFields[key],
                                enabled: true
                            };
                        }
                    });
                    setAdditionalFields(newFields);
                }
            } else {
                setFormData(initialFormState);
                setIsShippingEnabled(false);
                setAdditionalFields([
                    { id: 1, label: '', value: '', enabled: false, type: 'text' },
                    { id: 2, label: '', value: '', enabled: false, type: 'text' },
                    { id: 3, label: '', value: '', enabled: false, type: 'text' },
                    { id: 4, label: '', value: '', enabled: false, type: 'text' },
                ]);
            }
        }
    }, [isOpen, mode, party]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let finalValue = value;
        let updates: any = { [name]: finalValue };

        if (name === 'gstin') {
            finalValue = value.toUpperCase();
            updates[name] = finalValue;

            // Auto-fill state and adjust gstType
            if (finalValue.length >= 2) {
                const stateCode = finalValue.substring(0, 2);
                if (GST_STATE_CODES[stateCode]) {
                    updates.state = GST_STATE_CODES[stateCode];
                    if (formData.gstType === 'Unregistered/Consumer') {
                        updates.gstType = 'Registered Regular';
                    }
                }
            } else if (finalValue.length === 0) {
                updates.gstType = 'Unregistered/Consumer';
            }

            // Verify GST Format
            const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
            if (finalValue.length > 0 && finalValue.length < 15) {
                setGstError('');
                setIsGstVerified(false);
            } else if (finalValue.length === 15) {
                if (gstRegex.test(finalValue)) {
                    setGstError('');
                    setIsGstVerified(true);
                } else {
                    setGstError('Invalid GSTIN format');
                    setIsGstVerified(false);
                }
            } else {
                setGstError('');
                setIsGstVerified(false);
            }
        }

        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleSave = async (shouldClose: boolean) => {
        try {
            if (!formData.name) {
                alert("Party Name is required");
                return;
            }

            const additionalFieldsPayload: any = {};
            additionalFields.forEach(field => {
                if (field.enabled && field.label) {
                    additionalFieldsPayload[field.label] = field.value;
                }
            });

            const payload = {
                ...formData,
                openingBalance: formData.balanceType === 'To Pay' ? -Math.abs(Number(formData.openingBalance)) : Math.abs(Number(formData.openingBalance)),
                shippingAddress: isShippingEnabled ? formData.shippingAddress : formData.billingAddress,
                additionalFields: additionalFieldsPayload
            };

            if (mode === 'add') {
                await createParty(payload);
                alert("Party Created Successfully");
            } else {
                if (party && party._id) {
                    await updateParty(party._id, payload);
                    alert("Party Updated Successfully");
                }
            }

            if (onSuccess) onSuccess();

            if (shouldClose) {
                onClose();
            } else {
                // Reset for new
                setFormData(initialFormState);
                setIsShippingEnabled(false);
                setActiveTab('GST & Address');
                setAdditionalFields([
                    { id: 1, label: '', value: '', enabled: false, type: 'text' },
                    { id: 2, label: '', value: '', enabled: false, type: 'text' },
                    { id: 3, label: '', value: '', enabled: false, type: 'text' },
                    { id: 4, label: '', value: '', enabled: false, type: 'text' },
                ]);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to save party");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col"
                >
                    <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
                        <h2 className="text-lg font-semibold text-gray-800">{mode === 'add' ? 'Add Party' : 'Edit Party'}</h2>
                        <div className="flex items-center gap-4">
                            <Settings className="h-5 w-5 text-gray-500 cursor-pointer" />
                            <X className="h-5 w-5 text-gray-500 cursor-pointer" onClick={onClose} />
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto flex-grow">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="text-xs text-gray-600 block mb-1">Party Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-[var(--text-link-active)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--text-link-active)]/50"
                                    autoFocus
                                />
                            </div>
                            <div className="relative">
                                <label className="text-xs text-gray-600 block mb-1">GSTIN</label>
                                <input
                                    type="text"
                                    name="gstin"
                                    value={formData.gstin}
                                    onChange={handleInputChange}
                                    className={`w-full p-2 border ${gstError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[var(--text-link-active)]/50'} rounded-md focus:outline-none focus:ring-2 uppercase`}
                                    maxLength={15}
                                />
                                {isGstVerified && <span className="absolute right-8 top-8 h-4 w-4 text-green-500 text-sm font-bold">✓</span>}
                                <Info className="absolute right-3 top-8 h-4 w-4 text-gray-400" />
                                {gstError && <p className="text-[10px] text-red-500 mt-1">{gstError}</p>}
                            </div>
                            <div>
                                <label className="text-xs text-gray-600 block mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--text-link-active)]/50"
                                />
                            </div>
                        </div>

                        <div className="flex items-center border-b mb-6">
                            {['GST & Address', 'Credit & Balance', 'Additional Fields'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'text-[var(--text-link-active)] border-b-2 border-[var(--text-link-active)]' : 'text-gray-500 hover:bg-gray-50'}`}>
                                    {tab} {tab === 'Credit & Balance' && <span className="text-xs bg-red-500 text-white rounded-sm px-1.5 py-0.5 ml-1">New</span>}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'GST & Address' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-600 block mb-1">GST Type</label>
                                        <select name="gstType" value={formData.gstType} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm">
                                            <option value="Unregistered/Consumer">Unregistered/Consumer</option>
                                            <option value="Registered Regular">Registered Regular</option>
                                            <option value="Registered Composition">Registered Composition</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 block mb-1">State</label>
                                        <select name="state" value={formData.state} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm">
                                            <option value="">Select State</option>
                                            {indianStates.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 block mb-1">Email ID</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold mb-2 text-gray-700">Billing Address</h3>
                                    <textarea name="billingAddress" value={formData.billingAddress} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"></textarea>

                                    <div className="mt-4 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-700">Shipping Address</h3>
                                        <button type="button" onClick={() => setIsShippingEnabled(!isShippingEnabled)} className="text-[var(--text-link-active)] text-xs font-medium flex items-center gap-1">
                                            <Plus className="h-3 w-3" /> {isShippingEnabled ? 'Disable' : 'Enable'} Shipping Address
                                        </button>
                                    </div>
                                    {isShippingEnabled && (
                                        <textarea name="shippingAddress" value={formData.shippingAddress} onChange={handleInputChange} rows={3} className="w-full mt-2 p-2 border border-gray-300 rounded-md text-sm resize-none" placeholder="Same as billing address if left empty"></textarea>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Credit & Balance' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-600 block mb-1">Opening Balance</label>
                                        <input type="number" name="openingBalance" value={formData.openingBalance} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />

                                        <div className="flex items-center gap-4 mt-3">
                                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.balanceType === 'To Pay' ? 'border-red-500' : 'border-gray-300'}`}>
                                                    {formData.balanceType === 'To Pay' && <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="balanceType"
                                                    value="To Pay"
                                                    checked={formData.balanceType === 'To Pay'}
                                                    onChange={handleInputChange}
                                                    className="hidden"
                                                />
                                                <span className={formData.balanceType === 'To Pay' ? 'text-red-500 font-medium' : 'text-gray-600'}>To Pay</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.balanceType === 'To Receive' ? 'border-green-500' : 'border-gray-300'}`}>
                                                    {formData.balanceType === 'To Receive' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="balanceType"
                                                    value="To Receive"
                                                    checked={formData.balanceType === 'To Receive'}
                                                    onChange={handleInputChange}
                                                    className="hidden"
                                                />
                                                <span className={formData.balanceType === 'To Receive' ? 'text-green-500 font-medium' : 'text-gray-600'}>To Receive</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2"><label className="text-xs text-gray-600">Credit Limit</label><Info className="h-4 w-4 text-gray-400" /></div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-medium ${!formData.isCreditLimitEnabled ? 'text-[var(--text-link-active)]' : 'text-gray-500'}`}>No Limit</span>
                                            <button
                                                onClick={() => setFormData(prev => ({ ...prev, isCreditLimitEnabled: !prev.isCreditLimitEnabled }))}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isCreditLimitEnabled ? 'bg-[var(--text-link-active)]' : 'bg-gray-300'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.isCreditLimitEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </button>
                                            <span className={`text-sm font-medium ${formData.isCreditLimitEnabled ? 'text-[var(--text-link-active)]' : 'text-gray-500'}`}>Custom Limit</span>
                                        </div>
                                        {formData.isCreditLimitEnabled && (
                                            <input type="number" name="creditLimit" value={formData.creditLimit} onChange={handleInputChange} className="w-full mt-2 p-2 border border-gray-300 rounded-md" placeholder="Enter Limit" />
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-600 block mb-1">As Of Date</label>
                                        <input type="date" name="asOfDate" value={formData.asOfDate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 block mb-1">Loyalty Points Opening Balance</label>
                                        <input type="number" name="loyaltyPoints" value={formData.loyaltyPoints} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Additional Fields' && (
                            <div className="space-y-4">
                                <p className="text-xs text-gray-500 mb-2">Add custom fields for this party (e.g. Birthday, Anniversary, License No.)</p>
                                {additionalFields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={field.enabled}
                                            onChange={(e) => {
                                                const newFields = [...additionalFields];
                                                newFields[index].enabled = e.target.checked;
                                                setAdditionalFields(newFields);
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder={`Field ${index + 1} Name`}
                                                value={field.label}
                                                onChange={(e) => {
                                                    const newFields = [...additionalFields];
                                                    newFields[index].label = e.target.value;
                                                    setAdditionalFields(newFields);
                                                }}
                                                disabled={!field.enabled}
                                                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!field.enabled ? 'bg-gray-100 text-gray-400' : ''}`}
                                            />
                                            <input
                                                type="text"
                                                placeholder={`Value`}
                                                value={field.value}
                                                onChange={(e) => {
                                                    const newFields = [...additionalFields];
                                                    newFields[index].value = e.target.value;
                                                    setAdditionalFields(newFields);
                                                }}
                                                disabled={!field.enabled}
                                                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!field.enabled ? 'bg-gray-100 text-gray-400' : ''}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end items-center p-4 bg-gray-50 rounded-b-lg gap-3 flex-shrink-0">
                        {mode === 'add' && <button onClick={() => handleSave(false)} className="bg-white border border-blue-600 text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition">Save & New</button>}
                        <button onClick={() => handleSave(true)} className="bg-[var(--text-link-active)] text-white font-semibold px-6 py-2 rounded-lg hover:brightness-110 transition">Save</button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};