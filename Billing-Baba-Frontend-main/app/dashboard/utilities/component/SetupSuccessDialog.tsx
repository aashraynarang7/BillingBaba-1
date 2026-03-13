import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { ArrowRight } from "lucide-react";
  // 1. Import the new detailed invoice component
  import { DetailedInvoice } from "./DetailedInvoice";
  
  export function SetupSuccessDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl p-0 flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 text-center border-b">
            <DialogTitle className="text-3xl font-bold">Your business has been set up 🎉</DialogTitle>
            <DialogDescription>Take a look at how your invoice will look with the set up details!</DialogDescription>
          </DialogHeader>
          
          {/* 2. Replace the old invoice with the new component */}
          <div className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-8">
              <DetailedInvoice />
          </div>
  
          <DialogFooter className="p-6 bg-white flex justify-center items-center gap-4 border-t">
            <Button variant="secondary" size="lg" className="px-8 py-6 rounded-lg">Make More Changes</Button>
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-lg">
              Proceed To Vyapar <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }