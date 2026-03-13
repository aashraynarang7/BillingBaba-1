"use client";

import { useState } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogOverlay, DialogTitle, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { X, Zap } from 'lucide-react';
import { cn } from "@/lib/utils"; 

const initialMessage = "Hello!\no!\nNow place orders from your home and get attractive discounts.";

export default function ShareStoreModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [message, setMessage] = useState(initialMessage);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleSaveAndShare = () => {
        console.log("Sharing with message:", message);
        console.log("Don't show again:", dontShowAgain);
        onClose(); 
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogPrimitive.Portal>
                <DialogOverlay />
                <DialogPrimitive.Content
                  className={cn(
                    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 sm:rounded-lg",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                    "data-[state=close]:animate-out data-[state=close]:fade-out-0 data-[state=close]:zoom-out-95"
                  )}
                >
                    <DialogHeader className="p-6 pb-4">
                        <DialogTitle className="text-xl">Preview & Share</DialogTitle>
                    </DialogHeader>

                    <DialogPrimitive.Close 
                      className={cn(
                          "absolute right-4 top-4 rounded-md p-1.5 ring-offset-background transition-colors",
                          "border-2  hover:bg-white text-gray-500", 
                          "hover:bg-accent hover:brightness-90 hover:text-gray-600", 
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      )}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>

                    <div className="px-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="bg-orange-100/70 border border-orange-200 text-orange-900 text-sm rounded-lg p-3 flex items-center gap-3">
                            <Zap className="h-5 w-5 text-[var(--accent-orange)]" />
                            <div>
                                Get your own website for online store now. 
                                <a href="#" className="font-semibold underline ml-1 text-[var(--text-link-active)]">Click here</a>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-2 border">
                            <p>Hello!</p>
                            <p>Now place orders from your home and get attractive discounts.</p>
                            <p>Check out my Online Store now:</p>
                            <a href="https://billingbaba.in/store/helo1" className="text-[var(--text-link-active)] break-all">https://billingbaba.in/store/helo1</a>
                            <p>Call us at: <a href="tel:9310891509" className="text-[var(--text-link-active)]">9310891509</a> for any help</p>
                            <p className="mt-4">heloo</p>
                        </div>

                        <div>
                            <label htmlFor="edit-message" className="text-sm font-semibold text-gray-800 mb-2 block border-l-4 border-[var(--accent-orange)] pl-2">
                                Edit Message
                            </label>
                            <Textarea 
                                id="edit-message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="dont-show" checked={dontShowAgain} onCheckedChange={(checked) => setDontShowAgain(!!checked)} />
                                <label htmlFor="dont-show" className="text-sm font-medium leading-none">
                                    Don't Show this popup again
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">
                                NOTE: Edited messages can't be sent via SMS
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="bg-gray-50 p-4 mt-6">
                        <Button 
                            className="w-full text-white bg-[var(--primary-red)] hover:bg-[var(--primary-red)] hover:brightness-95"
                            onClick={handleSaveAndShare}
                        >
                            Save & Share
                        </Button>
                    </DialogFooter>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </Dialog>
    );
}