"use client";

import React, { useState } from 'react';
import CheckboxWithLabel from './CheckboxWithLabel';
import SettingsSelect from './SettingsSelect';
import SettingsLinkButton from './SettingsLinkButton';

const TransactionSettings = () => {
    const [billingType, setBillingType] = useState('lite');
    const prefixOptions = ['None', 'Yearly Prefix', 'Monthly Prefix'];
    const firmOptions = ['My Company', 'Firm B', 'Firm C'];

    return (
        <div className="max-w-7xl mx-auto text-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">

                {/* Column 1 */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Transaction Header</h3>
                        <div className="space-y-4">
                            <CheckboxWithLabel id="invoice-no" label="Invoice/Bill No." checked={true} onChange={() => {}} />
                            <CheckboxWithLabel id="add-time" label="Add Time on Transactions" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="cash-sale" label="Cash Sale by default" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="billing-name" label="Billing Name of Parties" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="customer-po" label="Customers P.O. Details on Transactions" checked={false} onChange={() => {}} info />
                        </div>
                    </div>
                    
                    <hr />

                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">More Transaction Features</h3>
                        <div className="space-y-4">
                            <CheckboxWithLabel id="eway-bill" label="E-way bill no" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="quick-entry" label="Quick Entry" checked={false} onChange={() => {}} />
                            <CheckboxWithLabel id="no-preview" label="Do not Show Invoice Preview" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="enable-passcode" label="Enable Passcode for transaction edit/delete" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="discount-payments" label="Discount During Payments" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="link-payments" label="Link Payments to Invoices" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="due-dates" label="Due Dates and Payment Terms" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="show-profit" label="Show Profit while making Sale Invoice" checked={false} onChange={() => {}} info />
                        </div>
                        <div className="mt-6 space-y-2">
                           <SettingsLinkButton>Additional Fields</SettingsLinkButton>
                           <SettingsLinkButton>Transportation Details</SettingsLinkButton>
                           <SettingsLinkButton>Additional Charges</SettingsLinkButton>
                        </div>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Items Table</h3>
                        <div className="space-y-4">
                            <CheckboxWithLabel id="inclusive-tax" label="Inclusive/Exclusive Tax on Rate(Price/Unit)" checked={true} onChange={() => {}} />
                            <CheckboxWithLabel id="display-purchase-price" label="Display Purchase Price of Items" checked={true} onChange={() => {}} info />
                            <CheckboxWithLabel id="show-last-5" label="Show last 5 Sale Price of Items" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="free-item" label="Free Item Quantity" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="count" label="Count" checked={false} onChange={() => {}} info >
                                <span className="ml-1 text-xs text-gray-500">(Change Text)</span>
                            </CheckboxWithLabel>
                        </div>
                    </div>

                    <hr />
                    
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Transaction Prefixes</h3>
                        <SettingsSelect label="Firm" options={firmOptions} />
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <SettingsSelect label="Sale" options={prefixOptions} />
                            <SettingsSelect label="Credit Note" options={prefixOptions} />
                            <SettingsSelect label="Sale Order" options={prefixOptions} />
                            <SettingsSelect label="Purchase Order" options={prefixOptions} />
                            <SettingsSelect label="Estimate" options={prefixOptions} />
                            <SettingsSelect label="Proforma Invoice" options={prefixOptions} />
                            <SettingsSelect label="Delivery Challan" options={prefixOptions} />
                            <SettingsSelect label="Payment In" options={prefixOptions} />
                        </div>
                    </div>
                </div>
                
                {/* Column 3 */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Taxes, Discount & Totals</h3>
                        <div className="space-y-4">
                            <CheckboxWithLabel id="txn-wise-tax" label="Transaction wise Tax" checked={false} onChange={() => {}} info />
                            <CheckboxWithLabel id="txn-wise-discount" label="Transaction wise Discount" checked={false} onChange={() => {}} info />
                            <div>
                                <CheckboxWithLabel id="round-off" label="Round Off Total" checked={true} onChange={() => {}} info />
                                <div className="pl-8 mt-2 flex items-center gap-2">
                                    <SettingsSelect options={['Nearest', 'Upward', 'Downward']} className="w-28"/>
                                    <span className="text-gray-600">To</span>
                                    <input type="number" defaultValue="1" className="w-16 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--text-link-active)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <hr />

                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Billing Type</h3>
                        <div className="space-y-3">
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="billingType" value="lite" checked={billingType === 'lite'} onChange={(e) => setBillingType(e.target.value)} className="h-4 w-4 text-[var(--text-link-active)] focus:ring-[var(--text-link-active)]/50" />
                                <span className="ml-3 font-medium text-gray-800">Lite Sale</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="billingType" value="full" checked={billingType === 'full'} onChange={(e) => setBillingType(e.target.value)} className="h-4 w-4 text-[var(--text-link-active)] focus:ring-[var(--text-link-active)]/50" />
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