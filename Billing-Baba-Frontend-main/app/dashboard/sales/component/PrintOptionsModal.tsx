"use client";

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function PrintOptionsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-lg text-center font-semibold">Print Options</DialogTitle>
                </DialogHeader>
                <div className="py-6 px-4 space-y-4">
                    <div className="flex items-center space-x-3">
                        <Checkbox id="printItemDetails" />
                        <label htmlFor="printItemDetails" className="text-sm font-medium">Print Item Details</label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Checkbox id="printDescription" />
                        <label htmlFor="printDescription" className="text-sm font-medium">Print Description</label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Checkbox id="printPaymentStatus" />
                        <label htmlFor="printPaymentStatus" className="text-sm font-medium">Print Payment Status</label>
                    </div>
                </div>
                <DialogFooter className="justify-center gap-4">
                    <Button variant="ghost" onClick={onClose}>CANCEL</Button>
                    <Button onClick={onClose}>OK</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}