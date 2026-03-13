"use client";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    note?: string;
}

export function InfoModal({ isOpen, onClose, title, message, note }: InfoModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm text-center">
                <DialogHeader><DialogTitle className="text-center w-full">{title}</DialogTitle></DialogHeader>
                <div className="py-4">
                    <p>{message}</p>
                    {note && <p className="text-xs text-gray-500 mt-4"><strong>Note:</strong> {note}</p>}
                </div>
                <Button onClick={onClose} className="w-full bg-teal-100 text-teal-800 hover:bg-teal-200">Okay</Button>
            </DialogContent>
        </Dialog>
    );
}