"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Define the props for our controlled dialog
interface StopAddingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function StopAddingDialog({ open, onOpenChange, onConfirm }: StopAddingDialogProps) {
  return (
    // The Dialog is now controlled by the `open` and `onOpenChange` props
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Stop Adding Items</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-2">
            <p className="text-base">Are you sure you want to leave?</p>
            <p className="text-base font-semibold">You can restore your progress later</p>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-2">
            {/* The "Yes, Close" button now calls the onConfirm function passed from the parent */}
            <Button variant="outline" className="rounded-full" onClick={onConfirm}>
                Yes, Close
            </Button>
            {/* The "Cancel" button simply closes the dialog */}
            <Button 
                type="button" 
                className="bg-red-500 hover:bg-red-600 text-white rounded-full" 
                onClick={() => onOpenChange(false)}
            >
                Cancel
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
