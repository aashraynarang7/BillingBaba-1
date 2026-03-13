"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function FullBreakupModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader><DialogTitle>Full Bill Breakup</DialogTitle></DialogHeader>
                <div className="space-y-2 py-4 text-sm">
                    <div className="flex justify-between"><span>Sub Total</span><span>: ₹ 200.00</span></div>
                    <div className="flex justify-between text-red-600"><span>Item Discount</span><span>: - ₹ 40.00</span></div>
                    <div className="flex justify-between"><span>Item Tax</span><span>: ₹ 4.80</span></div>
                    <div className="flex justify-between"><span>Round Off</span><span>: ₹ 0.20</span></div>
                    <div className="flex justify-between font-bold border-t pt-2 mt-2 bg-teal-50 p-2 rounded">
                        <span>Total</span><span>: ₹ 165.00</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}