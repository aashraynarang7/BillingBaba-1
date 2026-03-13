"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
    Heart, 
    TrendingUp, 
    Briefcase, 
    BadgePercent, 
    Search, 
    X,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ShareDownloadTemplateModal from '../component/ShareDownloadTemplateModal'; 

const mockData = {
    greetings: {
        subCategories: ["All", "Ganesh Chaturthi", "Paryushana", "Jod Mela Sri Goindwal Sahib", "Nutrition Week", "Pitru Paksha", "Good Morning", "Good Thoughts ( Suvichar )"],
        templates: [
            { img: "/marketing/festive1.jpg", category: "Good Thoughts ( Suvichar )" }, { img: "/marketing/festive1.jpg", category: "Good Thoughts ( Suvichar )" },
            { img: "/marketing/festive2.jpg", category: "Ganesh Chaturthi" }, { img: "/marketing/festive2.jpg", category: "Ganesh Chaturthi" },
            { img: "/marketing/festive3.webp", category: "Good Morning" }, { img: "/marketing/festive3.jpg", category: "Good Morning" },
            { img: "/marketing/festive1.jpg", category: "All" }, { img: "/marketing/festive1.jpg2", category: "All" },
        ]
    },
    trending: {
        subCategories: ["All", "Latest Update", "Ram Mandir Info", "Characteristics of Ram mandir"],
        templates: [
            { img: "/marketing/ram-mandir1.webp", category: "Ram Mandir Info" }, { img: "/marketing/ram-mandir1.webp", category: "Ram Mandir Info" },
            { img: "/marketing/ram-mandir2.jpg", category: "Latest Update" }, { img: "/marketing/ram-mandir2.jpg", category: "Latest Update" },
        ]
    },
    business: {
        subCategories: ["All", "My Business", "Business Ethics", "We Are Open", "Get In Touch", "Payment Due", "Support 24/7", "Thanks for Payment", "Price Hike"],
        templates: [
            { img: "/placeholder-image.png", category: "My Business" }, { img: "/placeholder-image.png", category: "My Business" },
            { img: "/placeholder-image.png", category: "Business Ethics" }, { img: "/placeholder-image.png", category: "Business Ethics" },
        ]
    },
    offers: {
        subCategories: ["All", "Ram Navami Offers", "Eid Mubarak Sale", "Akshaya Tritiya Offers", "Month End Offer", "Weekend Offers"],
        templates: [
            { img: "/marketing/business1.jpg", category: "Month End Offer" }, { img: "/placeholder-image.png", category: "Month End Offer" },
            { img: "/marketing/business2.jpg", category: "Month End Offer" }, { img: "/placeholder-image.png", category: "Weekend Offers" },
        ]
    }
};

type PrimaryTab = keyof typeof mockData;
type Template = typeof mockData.greetings.templates[0];

const PrimaryTabButton = ({ children, icon: Icon, isActive, onClick }: any) => (
    <button onClick={onClick} className={cn("flex items-center gap-2 px-4 py-2 font-semibold border-b-2 transition-colors", isActive ? "border-red-500 text-red-500" : "border-transparent text-gray-500 hover:text-gray-800")}>
        <Icon size={18} /> {children}
    </button>
);

const SubCategoryButton = ({ children, isActive, onClick }: any) => (
    <button onClick={onClick} className={cn("px-4 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap", isActive ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>
        {children}
    </button>
);

const TemplateCard = ({ template, onClick }: { template: Template, onClick: () => void }) => (
    <div className="relative aspect-[9/16] bg-gray-200 rounded-lg overflow-hidden group">
        <img src={template.img} alt="Marketing Template" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="secondary" className="bg-gray-800/70 text-white hover:bg-gray-700/80 rounded-full" onClick={onClick}>
                View <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    </div>
);

const LanguageFilterPopover = () => (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full border-gray-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.25 12.0711C2.25 6.49593 6.81433 2 12.3789 2C17.9434 2 22.5077 6.49593 22.5077 12.0711C22.5077 17.6462 17.9434 22.1422 12.3789 22.1422C8.71188 22.1422 5.51371 20.4432 3.82375 17.8924M12.3789 2L12.3789 22.1422M3.82375 6.49593H20.9339M2.25 12.0711H22.5077" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
            <div className="p-4 border-b"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Search" className="pl-9" /></div></div>
            <div className="p-4 space-y-3">
                <div className="flex items-center space-x-2"><Checkbox id="lang-en" defaultChecked /><label htmlFor="lang-en" className="text-sm">English (ENGLISH)</label></div>
                <div className="flex items-center space-x-2"><Checkbox id="lang-hi" defaultChecked /><label htmlFor="lang-hi" className="text-sm">Hindi (हिंदी)</label></div>
                <div className="flex items-center space-x-2"><Checkbox id="lang-gu" /><label htmlFor="lang-gu" className="text-sm">Gujarati (ગુજરાતી)</label></div>
                <div className="flex items-center space-x-2"><Checkbox id="lang-mr" /><label htmlFor="lang-mr" className="text-sm">Marathi (मराठी)</label></div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex gap-2"><Button variant="outline" className="w-full">Clear</Button><Button className="w-full bg-red-500 hover:bg-red-600 text-white">Apply</Button></div>
        </PopoverContent>
    </Popover>
);


export default function WhatsAppMarketingPage() {
    const [activePrimaryTab, setActivePrimaryTab] = useState<PrimaryTab>('greetings');
    const [activeSubCategory, setActiveSubCategory] = useState('All');
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    const handlePrimaryTabClick = (tab: PrimaryTab) => {
        setActivePrimaryTab(tab);
        setActiveSubCategory('All');
    };

    const currentData = mockData[activePrimaryTab];
    
    const filteredTemplates = useMemo(() => {
        if (activeSubCategory === 'All') {
            return currentData.templates;
        }
        return currentData.templates.filter(t => t.category === activeSubCategory);
    }, [activeSubCategory, currentData]);

    const handleViewClick = (template: Template) => {
        setSelectedTemplate(template);
        setShareModalOpen(true);
    };

    return (
        <>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">WhatsApp Marketing</h1>

                <div className="flex justify-between items-center border-b">
                    <div className="flex items-center">
                        <PrimaryTabButton icon={Heart} isActive={activePrimaryTab === 'greetings'} onClick={() => handlePrimaryTabClick('greetings')}>Greetings</PrimaryTabButton>
                        <PrimaryTabButton icon={TrendingUp} isActive={activePrimaryTab === 'trending'} onClick={() => handlePrimaryTabClick('trending')}>Trending</PrimaryTabButton>
                        <PrimaryTabButton icon={Briefcase} isActive={activePrimaryTab === 'business'} onClick={() => handlePrimaryTabClick('business')}>Business</PrimaryTabButton>
                        <PrimaryTabButton icon={BadgePercent} isActive={activePrimaryTab === 'offers'} onClick={() => handlePrimaryTabClick('offers')}>Offers</PrimaryTabButton>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search" className="pl-9 rounded-full bg-gray-100 border-transparent focus:border-gray-300 focus:bg-white" />
                            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full"><X size={16} /></Button>
                        </div>
                        <LanguageFilterPopover />
                    </div>
                </div>
                
               
                <div className="py-4 flex items-center gap-2 overflow-x-auto thin-scrollbar">
                    {currentData.subCategories.map(cat => (
                        <SubCategoryButton key={cat} isActive={activeSubCategory === cat} onClick={() => setActiveSubCategory(cat)}>
                            {cat}
                        </SubCategoryButton>
                    ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredTemplates.map((template, index) => (
                        <TemplateCard key={index} template={template} onClick={() => handleViewClick(template)} />
                    ))}
                </div>
            </div>

            <ShareDownloadTemplateModal 
                isOpen={isShareModalOpen} 
                onClose={() => setShareModalOpen(false)} 
                template={selectedTemplate}
            />
        </>
    );
}