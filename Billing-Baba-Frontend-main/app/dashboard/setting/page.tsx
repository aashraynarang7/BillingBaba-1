"use client";

import React from 'react';
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

const SettingsPage = () => {
    const [activeTab, setActiveTab] = React.useState('GENERAL');
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    const renderActiveTab = () => {
        const commonPadding = "p-6 md:p-8";

        switch(activeTab) {
            case 'GENERAL':
                return <div className={commonPadding}><GeneralSettings /></div>;
            case 'TRANSACTION':
                return <div className={commonPadding}><TransactionSettings /></div>;
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
                    {renderActiveTab()}
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;