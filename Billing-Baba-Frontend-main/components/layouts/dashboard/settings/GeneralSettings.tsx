"use client";

import React, { useState, useEffect } from 'react';
import { Info, ChevronUp, ChevronDown, Pencil } from 'lucide-react';
import CheckboxWithLabel from './CheckboxWithLabel';
import { fetchCompany } from '@/lib/api';
import type { AppSettings } from '@/app/dashboard/setting/page';

interface Props {
    settings: AppSettings;
    onChange: (key: keyof AppSettings, value: any) => void;
}

const GeneralSettings = ({ settings, onChange }: Props) => {
    const [zoomTemp, setZoomTemp] = useState(settings.zoomLevel);
    const [businessName, setBusinessName] = useState('');

    useEffect(() => { setZoomTemp(settings.zoomLevel); }, [settings.zoomLevel]);

    useEffect(() => {
        fetchCompany()
            .then(c => setBusinessName(c.name || ''))
            .catch(() => {});
    }, []);

    const lastBackup = settings.lastBackupAt
        ? new Date(settings.lastBackupAt).toLocaleString('en-IN', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
          })
        : 'Never';

    return (
        <div className="max-w-7xl mx-auto text-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12">

                {/* Column 1: Application & More Transactions */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Application</h3>
                        <div className="space-y-4">
                            <CheckboxWithLabel
                                id="enable-passcode"
                                label="Enable Passcode"
                                checked={settings.enablePasscode}
                                onChange={v => onChange('enablePasscode', v)}
                                info
                            />

                            <div className="flex justify-between items-center">
                                <label className="flex items-center text-gray-700 font-medium">
                                    Business Currency
                                    <Info className="h-3.5 w-3.5 text-gray-400 ml-1.5" />
                                </label>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={settings.businessCurrency}
                                        onChange={e => onChange('businessCurrency', e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="₹">₹ (INR)</option>
                                        <option value="$">$ (USD)</option>
                                        <option value="€">€ (EUR)</option>
                                        <option value="£">£ (GBP)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-gray-700 font-medium mb-1">
                                    Amount <span className="text-xs text-gray-500 ml-1">(upto Decimal Places)</span>
                                    <Info className="h-3.5 w-3.5 text-gray-400 ml-1.5" />
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min={0}
                                            max={4}
                                            value={settings.amountDecimalPlaces}
                                            onChange={e => onChange('amountDecimalPlaces', Number(e.target.value))}
                                            className="w-20 p-2 pr-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                                            <ChevronUp
                                                className="h-3.5 w-3.5 text-gray-500 cursor-pointer"
                                                onClick={() => onChange('amountDecimalPlaces', Math.min(4, settings.amountDecimalPlaces + 1))}
                                            />
                                            <ChevronDown
                                                className="h-3.5 w-3.5 text-gray-500 cursor-pointer"
                                                onClick={() => onChange('amountDecimalPlaces', Math.max(0, settings.amountDecimalPlaces - 1))}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-gray-500">e.g. {(0).toFixed(settings.amountDecimalPlaces)}</span>
                                </div>
                            </div>

                            <CheckboxWithLabel id="gstin" label="GSTIN Number" checked={settings.showGSTIN} onChange={v => onChange('showGSTIN', v)} info />
                            <CheckboxWithLabel id="neg-stock" label="Stop Sale on Negative Stock" checked={settings.stopSaleOnNegativeStock} onChange={v => onChange('stopSaleOnNegativeStock', v)} info />
                            <CheckboxWithLabel id="block-items" label="Block New Items from Txn Form" checked={settings.blockNewItemsFromTxn} onChange={v => onChange('blockNewItemsFromTxn', v)} info />
                            <CheckboxWithLabel id="block-parties" label="Block New Parties from Txn Form" checked={settings.blockNewPartiesFromTxn} onChange={v => onChange('blockNewPartiesFromTxn', v)} info />
                        </div>
                    </div>

                    <hr />

                    <div className="space-y-4">
                        <h3 className="font-bold text-base text-gray-800">More Transactions</h3>
                        <CheckboxWithLabel id="estimate" label="Estimate/Quotation" checked={settings.showEstimate} onChange={v => onChange('showEstimate', v)} info />
                        <CheckboxWithLabel id="proforma" label="Proforma Invoice" checked={settings.showProformaInvoice} onChange={v => onChange('showProformaInvoice', v)} info />
                        <CheckboxWithLabel id="sale-order" label="Sale/Purchase Order" checked={settings.showSalePurchaseOrder} onChange={v => onChange('showSalePurchaseOrder', v)} info />
                        <CheckboxWithLabel id="other-income" label="Other Income" checked={settings.showOtherIncome} onChange={v => onChange('showOtherIncome', v)} info />
                        <CheckboxWithLabel id="fixed-assets" label="Fixed Assets (FA)" checked={settings.showFixedAssets} onChange={v => onChange('showFixedAssets', v)} info />
                        <div>
                            <CheckboxWithLabel id="delivery-challan" label="Delivery Challan" checked={settings.showDeliveryChallan} onChange={v => onChange('showDeliveryChallan', v)} info />
                            {settings.showDeliveryChallan && (
                                <div className="pl-8 mt-3 space-y-3">
                                    <CheckboxWithLabel id="goods-return" label="Goods return on Delivery Challan" checked={settings.goodsReturnOnDeliveryChallan} onChange={v => onChange('goodsReturnOnDeliveryChallan', v)} />
                                    <CheckboxWithLabel id="print-amount" label="Print amount in Delivery Challan" checked={settings.printAmountInDeliveryChallan} onChange={v => onChange('printAmountInDeliveryChallan', v)} info />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 2: Multi Firm & Stock Transfer */}
                <div className="space-y-6 mt-6 lg:mt-0">
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Multi Firm</h3>
                        <CheckboxWithLabel id="multi-firm" label="Multi Firm" checked={settings.multiFirmEnabled} onChange={v => onChange('multiFirmEnabled', v)} />
                        <div className="mt-4 p-3 border border-gray-300 rounded-md flex justify-between items-center bg-white">
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="firm" defaultChecked className="h-4 w-4 accent-blue-600" />
                                <span className="ml-3 font-medium text-gray-800">{businessName || 'My Company'}</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-500">DEFAULT</span>
                                <Pencil className="h-4 w-4 text-blue-600 cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div>
                        <h3 className="font-bold text-base text-gray-800">Stock Transfer Between Godowns</h3>
                        <p className="text-gray-500 mt-1 mb-4 text-xs leading-relaxed">
                            Manage all your stores/godowns and transfer stock seamlessly between them. Using this feature, you can transfer stock between stores/godowns and manage your inventory more efficiently.
                        </p>
                        <CheckboxWithLabel
                            id="godown-mgmt"
                            label="Godown management & Stock transfer"
                            checked={settings.enableGodownManagement}
                            onChange={v => onChange('enableGodownManagement', v)}
                            info
                        />
                    </div>
                </div>

                {/* Column 3: Backup & History + Customize View */}
                <div className="space-y-6 mt-6 lg:mt-0">
                    <div>
                        <h3 className="font-bold text-base text-gray-800 mb-4">Backup & History</h3>
                        <div className="space-y-4">
                            <CheckboxWithLabel id="auto-backup" label="Auto Backup" checked={settings.autoBackup} onChange={v => onChange('autoBackup', v)} info />
                            <div className="flex items-center text-gray-600 font-medium text-sm">
                                Last Backup {lastBackup}
                                <Info className="h-3.5 w-3.5 text-gray-400 ml-1.5" />
                            </div>
                            <CheckboxWithLabel id="audit-trail" label="Audit Trail" checked={settings.auditTrail} onChange={v => onChange('auditTrail', v)} info />
                        </div>
                    </div>

                    <hr />

                    <div>
                        <h3 className="font-bold text-base text-gray-800">Customize Your View</h3>
                        <p className="text-gray-500 mt-1 mb-4 text-xs leading-relaxed">
                            You can use this setting to resize the screen, making it larger or smaller to fit your preferences.
                        </p>
                        <div className="bg-white p-4 rounded-lg border">
                            <label className="font-medium text-gray-700 text-sm">Choose Your Screen Zoom/Scale</label>
                            <input
                                type="range"
                                min="70"
                                max="130"
                                step="5"
                                value={zoomTemp}
                                onChange={e => setZoomTemp(Number(e.target.value))}
                                className="w-full mt-4 accent-blue-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1 px-0.5">
                                {['70%','80%','90%','100%','110%','115%','120%','130%'].map(v => (
                                    <span key={v}>{v}</span>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-xs text-gray-500">Current: {zoomTemp}%</span>
                                <button
                                    onClick={() => {
                                        document.body.style.zoom = `${zoomTemp}%`;
                                        onChange('zoomLevel', zoomTemp);
                                    }}
                                    className="bg-blue-100 text-blue-700 font-semibold px-6 py-1.5 rounded-full hover:bg-blue-200 transition-colors text-sm"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
