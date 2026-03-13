import React from 'react';

interface SettingsSectionProps {
    title: string;
    children?: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
    return (
        <div>
            <h3 className="font-bold text-base text-gray-800 mb-1">{title}</h3>
            <hr className="mb-4"/>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

export default SettingsSection;