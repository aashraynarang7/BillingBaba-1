import React from 'react';
import Image from 'next/image';
import { Play, Clock, Users, TrendingUp, Sparkles } from 'lucide-react';

interface ServiceReminderIntroProps {
    onEnable: () => void;
}

const ServiceReminderIntro: React.FC<ServiceReminderIntroProps> = ({ onEnable }) => {
    return (
        <div className="p-6 md:p-8 h-full flex flex-col items-center">
             <h2 className="text-xl font-semibold text-gray-800 w-full">Service Reminders</h2>
             
             {/* Video Banner */}
             <div className="w-full bg-blue-500 text-white rounded-lg p-4 mt-4 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg">How does Service Reminders feature work in Vyapar?</h3>
                    <p className="text-sm opacity-90">Watch the video and see how you can grow your business using Service Reminders.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-16 rounded-md bg-black overflow-hidden relative">
                         {/* <Image src="/Logo1.png" alt="Video Thumbnail" layout="fill" objectFit="cover" /> */}
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="h-8 w-8 text-white fill-white/50"/>
                         </div>
                    </div>
                    <button className="bg-[var(--primary-red)] text-white font-semibold py-2.5 px-6 rounded-md flex items-center gap-2 hover:bg-[var(--primary-dark-red)] transition-colors">
                        <Play className="h-4 w-4 fill-white"/> Play Video
                    </button>
                </div>
             </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <div className="w-full max-w-lg h-64 relative mb-6">
                    <Image src="/Logo1.png" alt="Service Reminder Illustration" layout="fill" objectFit="contain" />
                 </div>
                 
                 <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                     Service Reminders
                     <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">New</span>
                 </h3>
                 
                 <div className="mt-3 text-gray-500 flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Remind your parties</span>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Don't lose customers</span>
                     <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1.5"><TrendingUp className="h-4 w-4" /> Grow your Business</span>
                 </div>
                 
                 <button 
                    onClick={onEnable}
                    className="mt-8 bg-[var(--primary-red)] text-white font-semibold py-2.5 px-6 rounded-full flex items-center gap-2 hover:bg-[var(--primary-dark-red)] transition-colors shadow-lg hover:shadow-xl"
                 >
                    <Sparkles className="h-4 w-4" /> Enable Service Reminders
                 </button>
            </div>
        </div>
    );
};

export default ServiceReminderIntro;