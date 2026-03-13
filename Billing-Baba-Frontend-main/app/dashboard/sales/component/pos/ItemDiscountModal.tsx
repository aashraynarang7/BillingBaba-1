"use client";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function ItemDiscountModal({ isOpen, onClose, item }: { isOpen: boolean, onClose: () => void, item: any }) {
    if (!item) return null;
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Item Discount</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <p><strong>Item Name:</strong> {item.name}</p>
                    <p><strong>Item Value:</strong> ₹ {item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label htmlFor="discount-percent" className="text-sm font-medium">Discount in %</label>
                            <Input id="discount-percent" placeholder="20" />
                        </div>
                        <span className="pt-6">OR</span>
                        <div className="flex-1">
                            <label htmlFor="discount-amount" className="text-sm font-medium">Discount in ₹</label>
                            <Input id="discount-amount" defaultValue={item.discount.toFixed(2)} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onClose} className="bg-teal-500 hover:bg-teal-600 text-white">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}