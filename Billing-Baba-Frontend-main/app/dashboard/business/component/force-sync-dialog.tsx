import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  
  export function ForceSyncDialog({ children }: { children: React.ReactNode }) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Force Syncup</DialogTitle>
            <DialogDescription>
              Take a backup before initiating this request
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-sm text-destructive">
              There will be only 3 force syncup allowed per day
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="destructive">Send OTP</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }