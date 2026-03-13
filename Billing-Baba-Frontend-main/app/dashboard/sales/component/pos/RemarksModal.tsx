"use client";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export function RemarksModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Remarks</DialogTitle></DialogHeader>
                <div className="py-4">
                    <Textarea placeholder="Remarks" className="min-h-[100px]" />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onClose} className="bg-teal-500 hover:bg-teal-600 text-white">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}