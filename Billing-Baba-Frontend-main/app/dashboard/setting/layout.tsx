import React from 'react';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="absolute inset-0 z-50 h-full w-full bg-white">
            {children}
        </div>
    );
}