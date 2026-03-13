"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Plus, Download, RefreshCw, Languages, Star, Image as ImageIcon, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChangeCategoryModal from './ChangeCategoryModal'; 
import PreferredLanguageModal from './PreferredLanguageModal';

const AccountSidebarLink = ({ children, icon: Icon, isActive, onClick }: any) => (
    <button onClick={onClick} className={cn("w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors font-semibold", isActive ? "bg-red-50 text-red-600" : "hover:bg-gray-100 text-gray-700")}>
        <Icon className="h-5 w-5" /> {children}
    </button>
);
const DownloadsIllustration = () => (
    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
        <g opacity="0.1"><rect x="50" y="55" width="80" height="60" rx="5" fill="#DC2626"/></g>
        <rect x="25" y="30" width="100" height="80" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
        <path d="M75 55L75 85" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
        <path d="M60 70H90" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="100" cy="90" r="15" fill="#DC2626" stroke="white" strokeWidth="3"/>
        <path d="M96 90L100 94L105 86" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const BusinessDetailsContent = () => (
    <main className="md:col-span-3">
        
        <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-800">Business Details</h2><div className="flex items-center gap-2 text-sm"><span>Selected Category:</span><span className="bg-red-500 text-white font-semibold px-3 py-1 rounded-full">Electrical</span></div></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-1 space-y-4"><p className="font-semibold">My Company</p><div className="w-32 h-32 bg-gray-100 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400">Logo</div><Button variant="outline">Change Logo</Button><Button variant="outline">Create Logo</Button></div><div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"><div><label className="text-sm font-medium">Email Id</label><Input value="Z2NWO6...trial@vyaparapp.in" disabled /></div><div><label className="text-sm font-medium">Business Name*</label><Input placeholder="My Company" /></div><div><label className="text-sm font-medium">Website</label><Input placeholder="Website" /></div><div><label className="text-sm font-medium">Phone Number*</label><Input placeholder="Mobile Number" /></div><div className="sm:col-span-2"><label className="text-sm font-medium">Address</label><Textarea placeholder="Address" /></div></div></div>
        <div className="mt-8"><Button className="bg-red-500 text-white font-bold px-8 hover:bg-red-600">Save</Button></div>
    </main>
);

const DownloadsContent = () => {
    const [activeTab, setActiveTab] = useState('image');
    return (
        <main className="md:col-span-3">
            <div className="flex border-b">
                <button onClick={() => setActiveTab('image')} className={cn("py-2 px-4 flex items-center gap-2 font-semibold", activeTab === 'image' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500')}> <ImageIcon size={18}/> Image</button>
                <button onClick={() => setActiveTab('video')} className={cn("py-2 px-4 flex items-center gap-2 font-semibold", activeTab === 'video' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500')}> <Video size={18}/> Video</button>
            </div>
            <div className="flex flex-col items-center justify-center text-center py-20">
                <DownloadsIllustration />
                <h3 className="text-xl font-bold text-gray-800">Your downloads will show up here</h3>
                <p className="text-gray-500 mt-1">We'd love to see your posts. Create it now!</p>
            </div>
        </main>
    )
};


export default function AccountPage({ onBack }: { onBack: () => void }) {
    const [activeView, setActiveView] = useState<'business' | 'downloads' | null>('business');
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

    const handleOpenCategoryModal = () => {
        setActiveView(null); 
        setIsCategoryModalOpen(true);
    };

    const handleOpenLanguageModal = () => {
        setActiveView(null);
        setIsLanguageModalOpen(true);
    };

    const handleViewChange = (view: 'business' | 'downloads') => {
        setActiveView(view);
        setIsCategoryModalOpen(false);
        setIsLanguageModalOpen(false);
    };


    return (
        <>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <header className="flex items-center justify-between pb-4 border-b mb-6">
                    <Button variant="ghost" onClick={onBack}><ChevronLeft className="h-5 w-5 mr-2" /> Back</Button>
                    <div className="flex items-center gap-6 text-sm font-semibold"><span className="text-gray-500">Dashboard</span><span className="text-red-500 border-b-2 border-red-500 pb-4 -mb-4">Account</span></div>
                    <Button className="bg-red-500 text-white font-bold rounded-md hover:bg-red-600"><Plus size={18} className="mr-2" /> Create Design</Button>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside className="md:col-span-1">
                        <nav className="space-y-1">
                            <AccountSidebarLink icon={Star} isActive={activeView === 'business'} onClick={() => handleViewChange('business')}>Business</AccountSidebarLink>
                            <AccountSidebarLink icon={Download} isActive={activeView === 'downloads'} onClick={() => handleViewChange('downloads')}>Downloads</AccountSidebarLink>
                            <AccountSidebarLink icon={RefreshCw} isActive={isCategoryModalOpen} onClick={handleOpenCategoryModal}>Change business category</AccountSidebarLink>
                            <AccountSidebarLink icon={Languages} isActive={isLanguageModalOpen} onClick={handleOpenLanguageModal}>Preferred Language</AccountSidebarLink>
                        </nav>
                    </aside>
                    
                    {activeView === 'business' && <BusinessDetailsContent />}
                    {activeView === 'downloads' && <DownloadsContent />}
                </div>
            </div>

            <ChangeCategoryModal isOpen={isCategoryModalOpen} onClose={() => { setIsCategoryModalOpen(false); setActiveView('business'); }} />
            <PreferredLanguageModal isOpen={isLanguageModalOpen} onClose={() => { setIsLanguageModalOpen(false); setActiveView('business'); }} />
        </>
    );
}