"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { X, Download, MessageSquare, Image as ImageIcon, User, Phone, Sparkles } from 'lucide-react';

interface Template {
    img: string;
    category?: string; 
}

export default function ShareDownloadTemplateModal({ isOpen, onClose, template }: { isOpen: boolean, onClose: () => void, template: Template | null }) {
    if (!template) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Share & Download Template</DialogTitle>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Business logo</label>
                            <div className="mt-1 flex items-center gap-3 p-2 border rounded-md bg-gray-50">
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-700">Firm Logo</span>
                            </div>
                        </div>
                        <div><label className="text-sm font-medium text-gray-500">Business Name</label><Input defaultValue="heloo" /></div>
                        <div><label className="text-sm font-medium text-gray-500">Contact person</label><Input /></div>
                        <div><label className="text-sm font-medium text-gray-500">Contact number</label><Input defaultValue="9310891509" /></div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Additional text</label>
                            <div className="relative mt-1">
                                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                                <Input className="pl-9" defaultValue="Flat 10% discount on Sundays" />
                            </div>
                        </div>
                        <div><label className="text-sm font-medium text-gray-500">Whatsapp text</label><Input defaultValue="Motivation" /></div>
                    </div>

                    <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
                        <div className="relative w-full max-w-sm aspect-[9/16] rounded-md overflow-hidden shadow-lg">
                            <img src={template.img} alt="Template Preview" className="w-full h-full object-cover" />
                            <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/50 to-transparent">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-white bg-black/30 px-2 py-1 rounded">Company Logo</span>
                                    <span className="text-sm font-bold text-white">heloo</span>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
                                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-md">
                                    <p className="text-xs font-semibold flex items-center"><Sparkles className="h-3 w-3 mr-1.5 text-yellow-300" /> Flat 10% discount on Sundays</p>
                                </div>
                                <div className="flex justify-between items-center mt-2 text-xs">
                                    <p className="flex items-center"><User className="h-3 w-3 mr-1" /> {template.category || 'Category'}</p>
                                    <p className="flex items-center"><Phone className="h-3 w-3 mr-1" /> 9310891509</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 bg-gray-50 border-t justify-center">
                    <Button variant="outline" className="gap-2"><Download size={16} /> Download Image</Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white gap-2"><MessageSquare size={16} /> Share On WhatsApp</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}