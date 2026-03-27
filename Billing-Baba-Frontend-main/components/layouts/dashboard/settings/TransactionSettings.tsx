"use client";

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CheckboxWithLabel from './CheckboxWithLabel';
import SettingsSelect from './SettingsSelect';
import SettingsLinkButton from './SettingsLinkButton';
import type { AppSettings } from '@/app/dashboard/setting/page';
import { fetchCompany } from '@/lib/api';

interface Props {
    settings: AppSettings;
    onChange: (key: keyof AppSettings, value: any) => void;
}

const TransactionSettings = ({ settings, onChange }: Props) => {
    const [newPrefix, setNewPrefix] = useState('');
    const [businessName, setBusinessName] = useState('');

    useEffect(() => {
        fetchCompany()
            .then(c => setBusinessName(c.name || 'My Company'))
            .catch(() => setBusinessName('My Company'));
    }, []);

    // Build prefix options from defaults + user custom prefixes
    const basePrefixes = ['None', '2025-26', 'INV'];
    const allPrefixes = [...basePrefixes, ...(settings.txnCustomPrefixes || [])];

    const handleAddPrefix = () => {
        const trimmed = newPrefix.trim();
        if (!trimmed || allPrefixes.includes(trimmed)) return;
        onChange('txnCustomPrefixes', [...(settings.txnCustomPrefixes || []), trimmed]);
        setNewPrefix('');
    };

    return (
        <div className="max-w-7xl mx-auto text-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">

                {/* ── Column 1: Transaction Header + More Features ─── */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Transaction Header</h3>
                        <div className="space-y-4">
                            <CheckboxWithLabel id="invoice-no" label="Invoice/Bill No." checked={settings.txnInvoiceBillNo} onChange={v => onChange('txnInvoiceBillNo', v)} info />
                            <CheckboxWithLabel id="add-time" label="Add Time on Transactions" checked={settings.txnAddTime} onChange={v => onChange('txnAddTime', v)} info />
                            <CheckboxWithLabel id="print-time" label="Print Time on Invoices" checked={settings.txnPrintTime} onChange={v => onChange('txnPrintTime', v)} info />
                            <CheckboxWithLabel id="cash-sale" label="Cash Sale by default" checked={settings.txnCashSaleDefault} onChange={v => onChange('txnCashSaleDefault', v)} info />
                            <CheckboxWithLabel id="billing-name" label="Billing Name of Parties" checked={settings.txnBillingNameOfParties} onChange={v => onChange('txnBillingNameOfParties', v)} info />
                            <CheckboxWithLabel id="customer-po" label="Customers P.O. Details on Transactions" checked={settings.txnCustomerPODetails} onChange={v => onChange('txnCustomerPODetails', v)} info />
                        </div>
                    </div>

                    <hr />

                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">More Transaction Features</h3>
                        <div className="space-y-4">
                            <CheckboxWithLabel id="eway-bill" label="E-way bill no" checked={settings.txnEwayBillNo} onChange={v => onChange('txnEwayBillNo', v)} info />
                            <CheckboxWithLabel id="quick-entry" label="Quick Entry" checked={settings.txnQuickEntry} onChange={v => onChange('txnQuickEntry', v)} info />
                            <CheckboxWithLabel id="no-preview" label="Do not Show Invoice Preview" checked={settings.txnNoInvoicePreview} onChange={v => onChange('txnNoInvoicePreview', v)} info />
                            <CheckboxWithLabel id="passcode-edit" label="Enable Passcode for transaction edit/delete" checked={settings.txnPasscodeForEditDelete} onChange={v => onChange('txnPasscodeForEditDelete', v)} info />
                            <CheckboxWithLabel id="discount-payments" label="Discount During Payments" checked={settings.txnDiscountDuringPayments} onChange={v => onChange('txnDiscountDuringPayments', v)} info />
                            <CheckboxWithLabel id="link-payments" label="Link Payments to Invoices" checked={settings.txnLinkPayments} onChange={v => onChange('txnLinkPayments', v)} info />
                            <div>
                                <CheckboxWithLabel id="due-dates" label="Due Dates and Payment Terms" checked={settings.txnDueDatesPaymentTerms} onChange={v => onChange('txnDueDatesPaymentTerms', v)} info />
                                {settings.txnDueDatesPaymentTerms && (
                                    <div className="pl-8 mt-2">
                                        <SettingsLinkButton>Set Payment Terms</SettingsLinkButton>
                                    </div>
                                )}
                            </div>
                            <CheckboxWithLabel id="show-profit" label="Show Profit while making Sale Invoice" checked={settings.txnShowProfitOnSale} onChange={v => onChange('txnShowProfitOnSale', v)} info />
                        </div>
                        <div className="mt-6 space-y-2">
                            <SettingsLinkButton>Additional Fields</SettingsLinkButton>
                            <SettingsLinkButton>Transportation Details</SettingsLinkButton>
                            <SettingsLinkButton>Additional Charges</SettingsLinkButton>
                        </div>
                    </div>
                </div>

                {/* ── Column 2: Items Table + Transaction Prefixes ─── */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Items Table</h3>
                        <div className="space-y-4">
                            <CheckboxWithLabel id="inclusive-tax" label="Inclusive/Exclusive Tax on Rate(Price/Unit)" checked={settings.txnInclusiveExclusiveTax} onChange={v => onChange('txnInclusiveExclusiveTax', v)} info />
                            <CheckboxWithLabel id="display-purchase-price" label="Display Purchase Price of Items" checked={settings.txnDisplayPurchasePrice} onChange={v => onChange('txnDisplayPurchasePrice', v)} info />
                            <CheckboxWithLabel id="show-last-5" label="Show last 5 Sale Price of Items" checked={settings.txnShowLast5SalePrice} onChange={v => onChange('txnShowLast5SalePrice', v)} info />
                            <CheckboxWithLabel id="free-item" label="Free Item Quantity" checked={settings.txnFreeItemQuantity} onChange={v => onChange('txnFreeItemQuantity', v)} info />
                            <CheckboxWithLabel id="count" label="Count" checked={settings.txnCount} onChange={v => onChange('txnCount', v)} info>
                                <span className="ml-1 text-xs text-gray-400 italic">Change Text</span>
                            </CheckboxWithLabel>
                        </div>
                    </div>

                    <hr />

                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Transaction Prefixes</h3>
                        <SettingsSelect label="Firm" options={[businessName]} value={businessName} />
                        <div className="mt-4 border border-gray-200 rounded-lg p-4 space-y-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Prefixes</p>
                            <div className="grid grid-cols-2 gap-4">
                                <SettingsSelect label="Sale" options={allPrefixes} value={settings.txnPrefixSale} onChange={v => onChange('txnPrefixSale', v)} />
                                <SettingsSelect label="Credit Note" options={allPrefixes} value={settings.txnPrefixCreditNote} onChange={v => onChange('txnPrefixCreditNote', v)} />
                                <SettingsSelect label="Sale Order" options={allPrefixes} value={settings.txnPrefixSaleOrder} onChange={v => onChange('txnPrefixSaleOrder', v)} />
                                <SettingsSelect label="Purchase Order" options={allPrefixes} value={settings.txnPrefixPurchaseOrder} onChange={v => onChange('txnPrefixPurchaseOrder', v)} />
                                <SettingsSelect label="Estimate" options={allPrefixes} value={settings.txnPrefixEstimate} onChange={v => onChange('txnPrefixEstimate', v)} />
                                <SettingsSelect label="Proforma Invoice" options={allPrefixes} value={settings.txnPrefixProformaInvoice} onChange={v => onChange('txnPrefixProformaInvoice', v)} />
                                <SettingsSelect label="Delivery Challan" options={allPrefixes} value={settings.txnPrefixDeliveryChallan} onChange={v => onChange('txnPrefixDeliveryChallan', v)} />
                                <SettingsSelect label="Payment In" options={allPrefixes} value={settings.txnPrefixPaymentIn} onChange={v => onChange('txnPrefixPaymentIn', v)} />
                                <SettingsSelect label="Sale Fixed Asset" options={allPrefixes} value={settings.txnPrefixSaleFixedAsset} onChange={v => onChange('txnPrefixSaleFixedAsset', v)} />
                            </div>
                            {/* Custom prefix input */}
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                <input
                                    type="text"
                                    placeholder="Custom prefix..."
                                    value={newPrefix}
                                    onChange={e => setNewPrefix(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddPrefix()}
                                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    onClick={handleAddPrefix}
                                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                                >
                                    ADD
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Column 3: Taxes & Totals + Billing Type ─── */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Taxes, Discount & Totals</h3>
                        <div className="space-y-4">
                            <CheckboxWithLabel id="txn-wise-tax" label="Transaction wise Tax" checked={settings.txnTransactionWiseTax} onChange={v => onChange('txnTransactionWiseTax', v)} info />
                            <CheckboxWithLabel id="txn-wise-discount" label="Transaction wise Discount" checked={settings.txnTransactionWiseDiscount} onChange={v => onChange('txnTransactionWiseDiscount', v)} info />
                            <div>
                                <CheckboxWithLabel id="round-off" label="Round Off Total" checked={settings.txnRoundOffTotal} onChange={v => onChange('txnRoundOffTotal', v)} info />
                                {settings.txnRoundOffTotal && (
                                    <div className="pl-8 mt-2 flex items-center gap-2">
                                        <SettingsSelect
                                            options={['Nearest', 'Upward', 'Downward']}
                                            value={settings.txnRoundOffDirection}
                                            onChange={v => onChange('txnRoundOffDirection', v)}
                                            className="w-28"
                                        />
                                        <span className="text-gray-600">To</span>
                                        <select
                                            value={settings.txnRoundOffTo}
                                            onChange={e => onChange('txnRoundOffTo', Number(e.target.value))}
                                            className="w-16 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            <option value={1}>1</option>
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Billing Type</h3>
                        <div className="space-y-3">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="billingType"
                                    value="lite"
                                    checked={settings.txnBillingType === 'lite'}
                                    onChange={() => onChange('txnBillingType', 'lite')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500/50"
                                />
                                <span className="ml-3 font-medium text-gray-800">Lite Sale</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="billingType"
                                    value="full"
                                    checked={settings.txnBillingType === 'full'}
                                    onChange={() => onChange('txnBillingType', 'full')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500/50"
                                />
                                <span className="ml-3 font-medium text-gray-800">Full Sale</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionSettings;
