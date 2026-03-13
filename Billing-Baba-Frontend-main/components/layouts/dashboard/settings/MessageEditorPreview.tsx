"use client";

import React, { useState, useEffect } from 'react';
import { Type, Paperclip } from 'lucide-react';
import SettingsSelect from './SettingsSelect';

const transactionTypes = [
    'Sales Transaction', 'Purchase', 'Sales Return', 'Purchase Return', 'Payment In', 'Payment Out',
    'Sale Order', 'Purchase Order', 'Estimate', 'Proforma Invoice', 'Delivery Challan', 'Cancelled Invoice'
];

const messageTemplates: { [key: string]: string } = {
    'Sales Transaction': `Greetings from [Firm_Name],
We are pleased to have you as a valuable customer. Please find the details of your transaction.

[Transaction_Type]:
Invoice Amount: [Invoice_Amount]
Balance: [Transaction_Balance]

Thanks for doing business with us.
Regards,
[Firm_Name]`,
    'Purchase': `Dear Supplier,
This is to confirm our recent purchase.

Purchase Details:
Invoice Amount: [Invoice_Amount]

Regards,
[Firm_Name]`,
    'Sales Return': `Greetings from [Firm_Name],
We have processed your sales return.

Return Details:
Amount: [Invoice_Amount]
Updated Balance: [Transaction_Balance]

Regards,
[Firm_Name]`,
};

const MessageEditorPreview = () => {
    const [selectedType, setSelectedType] = useState(transactionTypes[0]);
    const [template, setTemplate] = useState('');

    useEffect(() => {
        setTemplate(messageTemplates[selectedType] || `Template for ${selectedType}`);
    }, [selectedType]);

    const renderPreview = () => {
        const previewText = template
            .replace(/\[Firm_Name\]/g, 'My Company')
            .replace(/\[Transaction_Type\]/g, selectedType)
            .replace(/\[Invoice_Amount\]/g, '792.00')
            .replace(/\[Transaction_Balance\]/g, '0.00');

        return previewText.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };


    return (
        <div className="bg-white p-5 rounded-lg border border-gray-200 h-full">
            <SettingsSelect 
                label="Transaction Type"
                options={transactionTypes}
                value={selectedType}
                onChange={setSelectedType}
            />
            <div className="mt-6">
                <h3 className="font-semibold text-gray-700">Edit Message</h3>
                <div className="mt-2 p-3 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50/20">
                    <textarea 
                        value={template}
                        onChange={(e) => setTemplate(e.target.value)}
                        className="w-full h-40 bg-transparent text-gray-700 text-sm leading-relaxed focus:outline-none resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <Type className="h-3 w-3 mr-1.5"/> Insert T symbol anywhere to include a variable.
                    </p>
                </div>
            </div>

            <div className="mt-6">
                 <h3 className="font-semibold text-gray-700">Message Preview</h3>
                 <div className="mt-2 p-4 bg-green-50/70 border border-green-200 rounded-lg text-sm text-gray-800 space-y-2">
                    <div className="flex items-center gap-2 text-green-800 font-semibold text-xs">
                        <Paperclip className="h-3 w-3" />
                        <span>Transaction Image Attached</span>
                    </div>
                    <p className="leading-relaxed">{renderPreview()}</p>
                 </div>
            </div>
        </div>
    );
};

export default MessageEditorPreview;