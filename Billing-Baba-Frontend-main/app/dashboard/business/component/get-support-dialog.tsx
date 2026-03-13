import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Info } from "lucide-react";
  
  export function GetSupportDialog({ children }: { children: React.ReactNode }) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Support</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="heloo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+91 9310891509" />
            </div>
            <p className="text-xs text-muted-foreground flex items-start gap-1.5">
              <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>You can also reach out to us at <strong>+91-6364-859-275</strong> from your registered number.</span>
            </p>
          </div>
          <DialogFooter className="grid grid-cols-2 gap-2">
            <Button variant="outline">Cancel</Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }