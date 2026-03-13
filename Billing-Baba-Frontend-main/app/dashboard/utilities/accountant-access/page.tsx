"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Info, TriangleAlert, Phone } from "lucide-react";

// A simple component for the WhatsApp icon
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);


export default function AccountantAccessPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        {/* Page Header */}
        <header className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Accountant Access</h1>
          <Info className="h-5 w-5 text-muted-foreground" />
        </header>

        {/* Main Content Card */}
        <Card className="shadow-sm">
            <CardContent className="p-0">
                {/* Current Company Section */}
                <div className="p-6 border-b">
                    <p className="text-sm text-muted-foreground mb-1">Current Company</p>
                    <p className="font-bold text-lg text-gray-800">9900196541</p>
                </div>

                {/* Error Message Section */}
                <div className="p-6">
                    <div className="bg-red-50/70 border border-red-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <TriangleAlert className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <h2 className="font-bold text-red-800 text-lg">Code Error!</h2>
                                <p className="text-gray-700 mt-1">
                                    The data sharing code has not been shared on registered ID 93xxxx1509/91xxxxxxxx09@vxxxxxxx.in OR It has expired. Please ask your accountant to reshare the code on the registered email/Phone no. and click on "Retry" to continue.
                                </p>
                                <Button className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 mt-4">
                                    Retry
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-8">
        <div className="bg-gray-200/70 rounded-lg p-3 flex items-center justify-center gap-4 text-sm text-gray-700">
            <span>If You Need Help, Contact us</span>
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <Phone className="h-4 w-4"/>
                <span>(+91) 9333 911 911</span>
            </div>
            <Separator orientation="vertical" className="h-4 bg-gray-400"/>
             <div className="flex items-center gap-2 text-green-600 font-semibold">
                <WhatsAppIcon/>
                <span>(+91) 6366 827 420</span>
            </div>
        </div>
      </footer>
    </div>
  );
}