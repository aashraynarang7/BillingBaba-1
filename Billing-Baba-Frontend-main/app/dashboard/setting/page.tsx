"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SettingsSidebar from '@/components/layouts/dashboard/settings/SettingsSidebar';
import GeneralSettings from '@/components/layouts/dashboard/settings/GeneralSettings';
import TransactionSettings from '@/components/layouts/dashboard/settings/TransactionSettings';
import TaxesGstSettings from '@/components/layouts/dashboard/settings/TaxesGstSettings';
import TransactionMessageSettings from '@/components/layouts/dashboard/settings/TransactionMessageSettings';
import PartySettings from '@/components/layouts/dashboard/settings/PartySettings';
import ItemSettings from '@/components/layouts/dashboard/settings/ItemSettings';
import ServiceRemindersSettings from '@/components/layouts/dashboard/settings/ServiceRemindersSettings';
import AccountingSettings from '@/components/layouts/dashboard/settings/AccountingSettings';
import PrintSettings from '@/components/layouts/dashboard/settings/PrintSettings';
import SettingsHeader from '@/components/layouts/dashboard/settings/SettingsHeader';
import { fetchSettings, updateSettings } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

// Default values mirror the backend model defaults
const DEFAULT_SETTINGS = {
    enablePasscode: false,
    businessCurrency: '₹',
    amountDecimalPlaces: 2,
    showGSTIN: true,
    stopSaleOnNegativeStock: false,
    blockNewItemsFromTxn: false,
    blockNewPartiesFromTxn: false,
    showEstimate: true,
    showProformaInvoice: true,
    showSalePurchaseOrder: true,
    showOtherIncome: true,
    showFixedAssets: true,
    showDeliveryChallan: true,
    goodsReturnOnDeliveryChallan: true,
    printAmountInDeliveryChallan: false,
    enableGodownManagement: false,
    autoBackup: false,
    lastBackupAt: null as string | null,
    auditTrail: true,
    zoomLevel: 100,
    multiFirmEnabled: false,

    // Transaction Header
    txnInvoiceBillNo: true,
    txnAddTime: false,
    txnPrintTime: false,
    txnCashSaleDefault: false,
    txnBillingNameOfParties: false,
    txnCustomerPODetails: false,

    // Items Table
    txnInclusiveExclusiveTax: true,
    txnDisplayPurchasePrice: true,
    txnShowLast5SalePrice: false,
    txnFreeItemQuantity: false,
    txnCount: false,

    // Taxes, Discount & Totals
    txnTransactionWiseTax: false,
    txnTransactionWiseDiscount: false,
    txnRoundOffTotal: true,
    txnRoundOffDirection: 'Nearest',
    txnRoundOffTo: 1,

    // More Transaction Features
    txnEwayBillNo: false,
    txnQuickEntry: false,
    txnNoInvoicePreview: false,
    txnPasscodeForEditDelete: false,
    txnDiscountDuringPayments: false,
    txnLinkPayments: false,
    txnDueDatesPaymentTerms: false,
    txnShowProfitOnSale: false,

    // Transaction Prefixes
    txnPrefixSale: 'None',
    txnPrefixCreditNote: 'None',
    txnPrefixSaleOrder: 'None',
    txnPrefixPurchaseOrder: 'None',
    txnPrefixEstimate: 'None',
    txnPrefixProformaInvoice: 'None',
    txnPrefixDeliveryChallan: 'None',
    txnPrefixPaymentIn: 'None',
    txnPrefixSaleFixedAsset: 'None',
    txnCustomPrefixes: [] as string[],

    // Billing Type
    txnBillingType: 'full',
};

export type AppSettings = typeof DEFAULT_SETTINGS;

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('GENERAL');
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchSettings()
            .then(data => setSettings({ ...DEFAULT_SETTINGS, ...data }))
            .catch(() => {/* use defaults silently */})
            .finally(() => setLoading(false));
    }, []);

    // Called by child components on any change — persists immediately
    const handleChange = useCallback(async (key: keyof AppSettings, value: any) => {
        const updated = { ...settings, [key]: value };
        setSettings(updated);
        try {
            await updateSettings({ [key]: value });
        } catch {
            toast({ title: 'Failed to save setting', variant: 'destructive' });
            // Revert on failure
            setSettings(settings);
        }
    }, [settings]);

    const handleClose = () => router.back();

    const commonPadding = "p-6 md:p-8";
    const props = { settings, onChange: handleChange };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'GENERAL':
                return <div className={commonPadding}><GeneralSettings {...props} /></div>;
            case 'TRANSACTION':
                return <div className={commonPadding}><TransactionSettings {...props} /></div>;
            case 'TAXES & GST':
                return <div className={commonPadding}><TaxesGstSettings /></div>;
            case 'TRANSACTION MESSAGE':
                return <div className={commonPadding}><TransactionMessageSettings /></div>;
            case 'PARTY':
                return <div className={commonPadding}><PartySettings /></div>;
            case 'ITEM':
                return <div className={commonPadding}><ItemSettings /></div>;
            case 'SERVICE REMINDERS':
                return <ServiceRemindersSettings />;
            case 'ACCOUNTING':
                return <div className={commonPadding}><AccountingSettings /></div>;
            case 'PRINT':
                return <div className={commonPadding}><PrintSettings /></div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-full w-full bg-white">
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 flex flex-col h-full bg-[var(--settings-content-bg)]">
                <SettingsHeader onClose={handleClose} />
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                        </div>
                    ) : renderActiveTab()}
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
