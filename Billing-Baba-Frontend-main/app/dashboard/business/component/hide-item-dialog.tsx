import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  
  interface HideItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }
  
  export function HideItemDialog({ open, onOpenChange }: HideItemDialogProps) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Changes</DialogTitle>
            <DialogDescription className="pt-4 text-base text-foreground">
              Do you really want to hide this item ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>NO, LEAVE</Button>
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                console.log("Item hidden!");
                onOpenChange(false);
              }}
            >
              YES
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }