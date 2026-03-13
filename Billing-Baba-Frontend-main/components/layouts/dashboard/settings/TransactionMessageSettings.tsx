"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import CheckboxWithLabel from './CheckboxWithLabel';
import MessageTypeSelector from './MessageTypeSelector';
import MessageEditorPreview from './MessageEditorPreview';

const automaticSmsOptions = [
    'Sales', 'Purchase', 'Sales Return', 'Purchase Return', 'Payment In', 'Payment Out',
    'Sale Order', 'Purchase Order', 'Estimate', 'Proforma Invoice', 'Delivery Challan', 'Cancelled Invoice'
];

const TransactionMessageSettings = () => {
    const [selectedMessageType, setSelectedMessageType] = useState('whatsapp');
    
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800">Transaction Message</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-5 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-3">Select Message Type</h3>
                        <div className="flex gap-4">
                            <MessageTypeSelector
                                icon="/icons/whatsappIcon.png"
                                title="Send via Vyapar"
                                isActive={selectedMessageType === 'vyapar'}
                                onClick={() => setSelectedMessageType('vyapar')}
                            />
                            <MessageTypeSelector
                                icon="/icons/whatsappIcon.png"
                                title="Send via Personal WhatsApp"
                                subtitle="Logged out through Mobile"
                                hasLogin
                                isActive={selectedMessageType === 'whatsapp'}
                                onClick={() => setSelectedMessageType('whatsapp')}
                            />
                        </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-3">Message Recipient Settings</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CheckboxWithLabel id="sms-party" label="Send SMS to Party" checked={true} onChange={()=>{}} info tooltipText="Vyapar will send an automatic message (SMS/WhatsApp) to your party immediately after the transaction has been recorded." />
                            <CheckboxWithLabel id="update-sms" label="Send Transaction Update SMS" checked={false} onChange={()=>{}} info tooltipText="Vyapar will send an automatic SMS to your party immediately after you have updated a transaction." />
                            <CheckboxWithLabel id="sms-self" label="Send SMS Copy to Self" checked={false} onChange={()=>{}} info tooltipText="Vyapar will send an automatic SMS to you immediately after the transaction has been recorded." />
                            <CheckboxWithLabel id="auto-share" label="Auto Share Invoices on Vyapar Network" checked={false} onChange={()=>{}} info tooltipText="Vyapar will automatically share invoices on Vyapar Network." />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-gray-200">
                         <h3 className="font-semibold text-gray-700 mb-3">Message Content</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <CheckboxWithLabel id="party-balance" label="Party Current Balance in SMS" checked={false} onChange={()=>{}} info />
                             <CheckboxWithLabel id="web-invoice-link" label="Web invoice link in SMS" checked={true} onChange={()=>{}} info />
                         </div>
                         <hr className="my-5" />
                         <h3 className="font-semibold text-gray-700 mb-3">Send Automatic SMS for:</h3>
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {automaticSmsOptions.map(opt => (
                                <CheckboxWithLabel key={opt} id={opt.toLowerCase().replace(' ', '-')} label={opt} checked={['Sales', 'Purchase', 'Sales Return', 'Purchase Return', 'Payment In', 'Payment Out', 'Sale Order'].includes(opt)} onChange={()=>{}} />
                            ))}
                         </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1">
                    <MessageEditorPreview />
                </div>

            </div>
        </div>
    );
};

export default TransactionMessageSettings;