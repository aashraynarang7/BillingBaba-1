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

export function NoIssueDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* 
        The `sm:max-w-sm` class makes the modal narrower on larger screens.
        The `p-0` and `overflow-hidden` are used to let the header take the full width.
      */}
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
        {/* 
          Custom styling for the header:
          - bg-[#D9E8F5]: The specific light blue background color.
          - text-[#5E5A6A]: The specific dark purple/gray text color.
        */}
        <DialogHeader className="bg-[#D9E8F5] p-4">
          <DialogTitle className="text-[#5E5A6A] text-lg font-bold">
            No Issue
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 text-center text-lg text-gray-700">
          <p>No issues were found while checking your data.</p>
        </div>

        <DialogFooter className="p-4 pt-0">
          <DialogClose asChild>
            {/* 
              Custom styling for the button:
              - bg-[#56A0C8]: The specific button blue.
              - hover:bg-[#4a8ba9]: A slightly darker shade for the hover effect.
              - shadow-md: The drop shadow effect.
            */}
            <Button
              type="button"
              className="bg-[#56A0C8] hover:bg-[#4a8ba9] text-white shadow-md rounded-md"
            >
              OK
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}