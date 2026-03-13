"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ChangeQuantityModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    onSave: (newQty: number) => void;
}

export function ChangeQuantityModal({ isOpen, onClose, item, onSave }: ChangeQuantityModalProps) {
    const [qty, setQty] = useState<string>('');

    useEffect(() => {
        if (isOpen && item) {
            setQty(item.qty?.toString() || '1');
        }
    }, [isOpen, item]);

    if (!item) return null;

    const handleSave = () => {
        const val = parseFloat(qty);
        if (!isNaN(val) && val > 0) {
            onSave(val);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Change Quantity</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <p><strong>Item Name:</strong> {item.name}</p>
                    <div>
                        <label htmlFor="quantity" className="text-sm font-medium">Enter New Quantity</label>
                        <Input
                            id="quantity"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            autoFocus
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} className="bg-teal-500 hover:bg-teal-600 text-white">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}