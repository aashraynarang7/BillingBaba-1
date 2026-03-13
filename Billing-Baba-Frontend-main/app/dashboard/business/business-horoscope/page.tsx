"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import Image from "next/image";
import { AstrologyDetailsDialog } from "../component/astrology-details-dialog";


const MetricCard = ({ title, value }: { title: string, value: string }) => (
    <div className="flex-1 text-center px-4">
        <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
            <span>{title}</span>
            <Info className="h-3.5 w-3.5" />
        </div>
        <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
    </div>
);

// UPDATED: HoroscopeDetailCard with gradient and border
const HoroscopeDetailCard = ({ title, description, imgSrc, imgAlt, reverse = false }: {
    title: string;
    description: string;
    imgSrc: string;
    imgAlt: string;
    reverse?: boolean;
}) => (
    <Card className="shadow-sm border border-blue-100 bg-gradient-to-b from-blue-50/30 to-white">
        <CardContent className={`p-6 flex items-center justify-between gap-6 ${reverse ? 'flex-row-reverse' : ''}`}>
            <Image src={imgSrc} alt={imgAlt} width={120} height={100} />
            <div className={`text-center ${reverse ? 'pr-4' : 'pl-4'}`}>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <p className="text-muted-foreground mt-2">{description}</p>
            </div>
        </CardContent>
    </Card>
);

export default function BusinessHoroscopePage() {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Daily Business Horoscope</h1>
            
            <div className="relative p-8 rounded-lg" style={{ 
                backgroundImage: 'url(/images/horoscope/zodiac-bg.png)',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
                <Card className="bg-white/80 backdrop-blur-sm shadow-md">
                    <CardContent className="p-6 flex items-center justify-around">
                        <MetricCard title="Best time for Business" value="Shubh Muhurat" />
                        <Separator orientation="vertical" className="h-16" />
                        <MetricCard title="Number for Good Luck" value="Lucky Number" />
                        <Separator orientation="vertical" className="h-16" />
                        <MetricCard title="Color of the Day" value="Lucky Color" />
                        <Separator orientation="vertical" className="h-16" />
                        <MetricCard title="Avoid This Hour" value="Rahu-Kaal" />
                    </CardContent>
                </Card>

                <div className="relative mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <HoroscopeDetailCard 
                            title="Business Performance"
                            description="Want to know how your business will perform today? Add your details to get personalised insights."
                            imgSrc="/marketing/growthImage.png" 
                            imgAlt="Business Performance Chart"
                        />
                         <HoroscopeDetailCard 
                            title="Opportunities"
                            description="Every day brings new chances for your business! Find out where your biggest opportunity lies today."
                            imgSrc="/marketing/growthImage.png"
                            imgAlt="Opportunities Chart"
                            reverse={true}
                        />
                         <HoroscopeDetailCard 
                            title="Challenges"
                            description="Business comes with hurdles. Get your daily challenge prediction and prepare ahead."
                            imgSrc="/marketing/challengeImage.png"
                            imgAlt="Challenges Maze"
                        />
                         <HoroscopeDetailCard 
                            title="Personal Health"
                            description="Your health affects your business! Enter your details to get your personal wellness horoscope."
                            imgSrc="/marketing/personImage.png"
                            imgAlt="Personal Health Running"
                            reverse={true}
                        />
                    </div>
                    
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="p-2 bg-gray-50 rounded-full shadow-lg">
                             <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 py-6 text-base font-bold">
                                Add Your Details
                            </Button>
                        </div>
                    </div>
                    <AstrologyDetailsDialog>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="p-2 bg-gray-50 rounded-full shadow-lg">
                                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 py-6 text-base font-bold">
                                    Add Your Details
                                </Button>
                            </div>
                        </div>
                    </AstrologyDetailsDialog>
                </div>
            </div>
        </div>
    );
}