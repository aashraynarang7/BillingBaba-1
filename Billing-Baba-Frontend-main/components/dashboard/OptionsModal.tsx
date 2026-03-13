"use client";

import { useState } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogOverlay, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface ModalOption {
  id: string;
  label: string;
  checked: boolean;
}

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: ModalOption[];
  buttonText: string;
  onSubmit: (selectedOptions: string[]) => void;
}

export const OptionsModal = ({
  isOpen,
  onClose,
  title,
  options: initialOptions,
  buttonText,
  onSubmit
}: OptionsModalProps) => {
  const [options, setOptions] = useState<ModalOption[]>(initialOptions);

  const handleCheckboxChange = (id: string) => {
    setOptions(prevOptions =>
      prevOptions.map(option =>
        option.id === id ? { ...option, checked: !option.checked } : option
      )
    );
  };

  const handleSubmit = () => {
    const selected = options.filter(opt => opt.checked).map(opt => opt.id);
    onSubmit(selected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "data-[state=close]:animate-out data-[state=close]:fade-out-0 data-[state=close]:zoom-out-95 data-[state=close]:slide-out-to-left-1/2 data-[state=close]:slide-out-to-top-[48%]"
          )}
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800">{title}</DialogTitle>
            
            <DialogPrimitive.Close 
              className={cn(
                  "rounded-md p-1.5 ring-offset-background transition-colors",
                  "border-2 border-gray-400 text-gray-500", 
                  "hover:bg-accent hover:border-gray-600 hover:text-gray-600", 
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
                <Checkbox
                  id={option.id}
                  checked={option.checked}
                  onCheckedChange={() => handleCheckboxChange(option.id)}
                  className="h-5 w-5 rounded-[4px] border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label
                  htmlFor={option.id}
                  className="text-sm font-medium leading-none"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          
          {/* फुटर सेक्शन */}
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold text-base py-2 px-6 rounded-md"
            >
              {buttonText}
            </Button>
          </DialogFooter>

        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};