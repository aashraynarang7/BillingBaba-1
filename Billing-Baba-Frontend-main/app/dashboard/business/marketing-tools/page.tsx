"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, User, Calendar, Star, PlayCircle, Building, Sparkles } from 'lucide-react';
import BusinessDetailsPage from '../component/BusinessDetailsPage';
import AccountPage from '../component/AccountPage';


const mockData = {
    forYou: {
        '5': [
            { img: "/marketing/teacheresday1.jpeg", title: "Teachers' Day" },
            { img: "/marketing/teacheresday2.jpeg", title: "Teachers' Day 2" },
        ],
        '10': [
            { img: "/marketing/festive1.jpg", title: "Ganesh Chaturthi" },
            { img: "/marketing/festive2.jpg", title: "Ganesh Chaturthi Offer" },
            { img: "/marketing/festive3.webp", title: "Happy Ganesh" },
        ],
        '11': [
            { img: "/marketing/onam1.webp", title: "Onam Special" },
            { img: "/marketing/onam2.jpeg", title: "Happy Onam" },
        ],
        'default': [ 
             { img: "/marketing/nutrition.jpg", title: "Nutrition Week" },
             { img: "/marketing/Mother-Teresa.webp", title: "Mother Teresa" },
        ]
    },
    festivals: {
        '5': [ { img: "/marketing/teacheresday1.jpeg", title: "Teachers' Day Greeting" } ],
        '10': [ { img: "/marketing/festive1.jpeg", title: "Ganesh Chaturthi Main" } ],
        '11': [ { img: "/marketing/onam2.jpeg", title: "Onam Festival" } ],
    },
    business: [
        { title: "My Business", icon: Building, templates: [ { img: "/marketing/business1.jpg", isVideo: true }, { img: "/marketing/business2.jpeg", isVideo: true }, { img: "/marketing/business1.jpg", isVideo: true } ] },
        { title: "Motivation", icon: Sparkles, templates: [ { img: "/marketing/motivation1.jpeg" }, { img: "/marketing/motivation2.webp" }, { img: "/marketing/motivation3.webp", isVideo: true } ] }
    ],
    product: [
        { title: "Ganesh Chaturthi Offers", icon: Star, templates: [ { img: "/marketing/festive1.jpeg" }, { img: "/marketing/festive2.jpeg" }, { img: "/marketing/festive3.webp" } ] },
        { title: "Product Promotion", icon: Star, templates: [ { img: "/marketing/oppo1.png" }, { img: "/marketing/oppo2.png" }, { img: "/marketing/oppo3.jpeg" } ] }
    ]
};
const festivalDates = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 22].map(day => ({ day, month: 'Sep' }));

const TabButton = ({ children, isActive, onClick }: { children: React.ReactNode; isActive: boolean; onClick: () => void; }) => (
    <Button variant="ghost" onClick={onClick} className={cn("rounded-full px-6", isActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
        {children}
    </Button>
);

const TemplateCard = ({ img, title, isVideo }: { img: string; title?: string; isVideo?: boolean; }) => (
    <div className="flex-shrink-0 w-40 text-center">
        <div className="relative aspect-[4/5] bg-gray-200 rounded-lg overflow-hidden group">
            <img src={img} alt={title || "Template"} className="w-full h-full object-cover" />
            {isVideo && <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><PlayCircle className="h-10 w-10 text-white" /></div>}
        </div>
        {title && <p className="text-sm mt-2 text-gray-700 truncate">{title}</p>}
    </div>
);

const TemplateRow = ({ title, icon: Icon, templates }: { title: string; icon: React.ElementType; templates: any[] }) => (
    <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-800"><Icon className="h-6 w-6" /> {title}</h2>
            <Button variant="link" className="text-red-500">View more</Button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 thin-scrollbar">
            {templates.map((template, index) => <TemplateCard key={index} {...template} />)}
        </div>
    </div>
);

const FestivalCalendar = ({ selectedDate, onDateSelect }: { selectedDate: number; onDateSelect: (day: number) => void; }) => (
    <div className="mb-8 p-4 border rounded-lg bg-white">
        <div className="flex items-center gap-3 mb-4"><Calendar className="h-5 w-5 text-gray-600" /> <h3 className="font-semibold">Festival Calendar 2025</h3></div>
        <div className="flex gap-2 overflow-x-auto pb-2 thin-scrollbar">
            {festivalDates.map(date => (
                <div 
                    key={date.day}
                    onClick={() => onDateSelect(date.day)}
                    className={cn(
                        "flex-shrink-0 w-12 h-14 rounded-lg flex flex-col items-center justify-center font-semibold cursor-pointer transition-colors",
                        selectedDate === date.day ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                >
                    <span className="text-lg">{date.day}</span>
                    <span className="text-xs">{date.month}</span>
                </div>
            ))}
        </div>
    </div>
);


export default function MarketingToolsPage() {
    const [activeTab, setActiveTab] = useState('For you');
    const [selectedDate, setSelectedDate] = useState<number>(festivalDates[0].day);
    
    const [activeView, setActiveView] = useState<'tools' | 'account'>('tools');


    if (activeView === 'account') {
        return <AccountPage onBack={() => setActiveView('tools')} />;
    }



    const getTemplatesForView = () => {
        
        const dateKey = String(selectedDate); 
        
        switch (activeTab) {
            case 'For you':
                return mockData.forYou[dateKey as keyof typeof mockData.forYou] || mockData.forYou.default;
            case 'Festivals':
                 return mockData.festivals[dateKey as keyof typeof mockData.festivals] || [];
            default:
                return [];
        }
    };
    
    const templatesForSelectedDate = getTemplatesForView();

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            
            <header className="mb-6">
                 <h1 className="text-2xl font-bold text-gray-800 mb-4">Marketing Tools</h1>
                <div className="flex items-center gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input placeholder="Search category or media" className="pl-12 h-12 rounded-full bg-gray-100 border-gray-200" />
                    </div>
                    <Button className="h-12 rounded-full bg-red-500 text-white font-bold shadow-lg hover:bg-red-600">
                        <Star size={18} className="mr-2" /> Create
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setActiveView('account')}>
                        <User className="h-6 w-6 text-gray-600" />
                    </Button>
                </div>
            </header>

            
            <div className="mb-6 flex flex-wrap gap-3">
                <TabButton isActive={activeTab === 'For you'} onClick={() => setActiveTab('For you')}>For you</TabButton>
                <TabButton isActive={activeTab === 'Festivals'} onClick={() => setActiveTab('Festivals')}>Festivals</TabButton>
                <TabButton isActive={activeTab === 'Business'} onClick={() => setActiveTab('Business')}>Business</TabButton>
                <TabButton isActive={activeTab === 'Product'} onClick={() => setActiveTab('Product')}>Product</TabButton>
            </div>

            
            <main>
                { (activeTab === 'For you' || activeTab === 'Festivals') && (
                    <>
                        <FestivalCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {templatesForSelectedDate.length > 0 ? (
                                templatesForSelectedDate.map((template, index) => <TemplateCard key={index} {...template} />)
                            ) : (
                                <p className="col-span-full text-center text-gray-500 py-8">No templates available for this date.</p>
                            )}
                        </div>
                    </>
                )}

                 {activeTab === 'Business' && (
                    <div>
                        {mockData.business.map(row => <TemplateRow key={row.title} {...row} />)}
                    </div>
                 )}
                 
                 {activeTab === 'Product' && (
                    <div>
                        {mockData.product.map(row => <TemplateRow key={row.title} {...row} />)}
                    </div>
                 )}
            </main>
        </div>
    );
}