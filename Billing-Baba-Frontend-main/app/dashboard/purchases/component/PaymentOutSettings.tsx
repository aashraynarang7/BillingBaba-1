"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Info, ExternalLink } from "lucide-react";

export default function PaymentOutSettings({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:w-[400px] px-4">
                <SheetHeader>
                    <SheetTitle className="text-lg">Payment-Out Settings</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-3">GENERAL</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label htmlFor="discount" className="text-sm font-medium">Discount during Payments</label>
                                <div className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                                    <Checkbox id="discount" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="linkPayments" className="text-sm font-medium">Link Payments to Invoices</label>
                                <div className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                                    <Checkbox id="linkPayments" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 <SheetFooter>
                    <Button variant="link" className="w-full justify-center">
                        More Settings <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}