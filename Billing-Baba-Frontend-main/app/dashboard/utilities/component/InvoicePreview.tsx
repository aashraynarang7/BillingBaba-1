import { Check } from "lucide-react";
// 1. Import the new detailed invoice component
import { DetailedInvoice } from "./DetailedInvoice";

export const InvoicePreview = () => (
  <div className="bg-gray-100 p-6 rounded-lg h-full flex flex-col items-center">
    <h3 className="font-semibold mb-4">Sample Tax Invoice</h3>
    
    {/* 2. Replace the blurred image with the new component */}
    <div className="w-full max-w-md scale-[0.7] -translate-y-12">
      <DetailedInvoice />
    </div>

    <div className="flex items-center gap-4 mt-auto">
        <div className="relative text-center">
            <div className="w-24 h-16 border-2 border-blue-600 bg-white rounded-lg flex items-center justify-center"></div>
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center"><Check className="h-3 w-3"/></div>
            <p className="text-xs font-semibold mt-1">Tally Theme</p>
        </div>
        <div className="text-center">
             <div className="w-24 h-16 border bg-white rounded-lg flex items-center justify-center"></div>
            <p className="text-xs text-muted-foreground mt-1">Landscape Theme</p>
        </div>
    </div>
  </div>
);