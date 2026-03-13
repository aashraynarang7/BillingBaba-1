import React from 'react';
import { Search } from 'lucide-react';

const menuItems = [
    'GENERAL',
    'TRANSACTION',
    'PRINT',
    'TAXES & GST',
    'TRANSACTION MESSAGE',
    'PARTY',
    'ITEM',
    'SERVICE REMINDERS',
    'ACCOUNTING',
];

interface SettingsSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, setActiveTab }) => {
    return (
        <aside className="w-64 bg-[var(--settings-sidebar-bg)] text-[var(--settings-sidebar-text)] flex flex-col flex-shrink-0">
            <div className="flex justify-between items-center p-4 border-b border-gray-500/30">
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <nav className="flex-1 py-2">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item} className="px-2">
                            <button
                                onClick={() => setActiveTab(item)}
                                className={`w-full text-left px-4 py-2.5 my-1 rounded-md text-sm font-semibold transition-colors duration-200
                                    ${
                                        activeTab === item
                                            ? 'bg-[var(--settings-sidebar-active-bg)] text-[var(--settings-sidebar-active-text)]'
                                            : 'hover:bg-gray-500/20'
                                    }`
                                }
                            >
                                {item}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default SettingsSidebar;