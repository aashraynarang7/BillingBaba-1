"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Info, X } from "lucide-react";

// A reusable component for form fields to keep the code clean
const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="space-y-2">
        <Label>
            {label}
            <span className="text-red-500">*</span>
        </Label>
        {children}
    </div>
);

export function AstrologyDetailsDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
                <DialogTitle className="text-xl font-bold">Your Astrology Details</DialogTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
            </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
            <FormField label="Business Name">
                <Input defaultValue="heloo" />
            </FormField>
            <FormField label="Your Date of Birth">
                <div className="relative">
                    <Input placeholder="Your Date of Birth" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
            </FormField>
             <FormField label="Your Time of Birth">
                 <div className="relative">
                    <Input defaultValue="12:00 AM" />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
            </FormField>
            <FormField label="Birth Location (City, State)">
                <Select>
                    <SelectTrigger><SelectValue placeholder="Select Location" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="delhi">Delhi, India</SelectItem>
                        <SelectItem value="mumbai">Mumbai, India</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>
            <FormField label="Business Registration Date">
                 <div className="relative">
                    <Input placeholder="Business Registration Date" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
            </FormField>
            <FormField label="Business Registration Location (City, State)">
                <Select>
                    <SelectTrigger><SelectValue placeholder="Select Location" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="delhi">Delhi, India</SelectItem>
                        <SelectItem value="mumbai">Mumbai, India</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="text-muted-foreground">No, Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled>Save Details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}