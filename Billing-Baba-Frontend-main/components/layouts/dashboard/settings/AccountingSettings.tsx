"use client";

import React from 'react';
import CheckboxWithLabel from './CheckboxWithLabel';

const AccountingSettings = () => {
    return (
        <div className="max-w-xl text-sm">
            <h3 className="font-bold text-base text-gray-800 mb-1">Accounting</h3>
            <hr className="mb-6"/>

            <div className="space-y-5">
                <CheckboxWithLabel 
                    id="enable-accounting" 
                    label="Enable Accounting module" 
                    checked={false} 
                    onChange={() => {}} 
                    info 
                    tooltipText="Enable this to access accounting features like balance sheets, profit & loss statements, etc."
                />
            </div>
        </div>
    );
};

export default AccountingSettings;