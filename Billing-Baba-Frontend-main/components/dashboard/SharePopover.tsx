"use client";

import { Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from 'next/image';

const ShareOption = ({ iconSrc, label, isSelected }: { iconSrc: string, label: string, isSelected?: boolean }) => (
    <button className={`flex flex-col items-center justify-start gap-2 p-2 rounded-lg w-20 h-20 transition-colors ${isSelected ? 'border-2 border-blue-500 bg-blue-50/50' : 'hover:bg-gray-100'}`}>
        <div className="w-9 h-9 relative">
            <Image 
                src={iconSrc}
                alt={`${label} icon`}
                width={36}
                height={36}
              
            />
        </div>
        <span className={`text-xs font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>{label}</span>
    </button>
);


export const SharePopover = () => {
  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
            </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-4">
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">Share</h3>
                <div className="flex items-start justify-around gap-4">
                    <ShareOption iconSrc="/icons/gmailIcon.png" label="Email" isSelected={true} />
                    <ShareOption iconSrc="/icons/whatsappIcon.png" label="WhatsApp" />
                    <ShareOption iconSrc="/icons/messageIcon.png" label="SMS" />
                    <ShareOption iconSrc="/Logo1.png" label="Billing Baba" />
                </div>
            </div>
        </PopoverContent>
    </Popover>
  );
};