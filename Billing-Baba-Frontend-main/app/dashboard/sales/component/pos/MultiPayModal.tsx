"use client";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function MultiPayModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Multi Pay</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-semibold">Cash</label>
                        <div className="relative mt-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span><Input className="pl-7" defaultValue="165.00" /></div>
                    </div>
                    <div className="space-y-1 text-right font-medium">
                        <p>Total: ₹ 165.00</p>
                        <p>Balance: ₹ 0.00</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button className="flex-1 bg-teal-100 text-teal-800 hover:bg-teal-200">Save & Print Bill [Ctrl+P]</Button>
                    <Button variant="outline" className="flex-1">Save & New Bill [Ctrl+N]</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}