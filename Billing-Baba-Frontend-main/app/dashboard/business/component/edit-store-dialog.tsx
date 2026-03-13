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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from "lucide-react";

export function EditStoreDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* FIX: Added flexbox layout and max-height to the DialogContent */}
      <DialogContent className="sm:max-w-3xl flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Update Store</DialogTitle>
          <DialogDescription>
            Make changes to your store details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {/* FIX: This div is now the scrollable container for the form */}
        <div className="flex-1 overflow-y-auto py-4 pr-6 pl-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pl-5">
            <div className="md:col-span-2 space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" defaultValue="heloo" />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="business-desc">Business Description</Label>
                <Textarea id="business-desc" placeholder="Type your description here." />
                <p className="text-xs text-right text-muted-foreground">0/160</p>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="business-address">Business Address</Label>
                <Input id="business-address" />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="gstin">GSTIN Number (Optional)</Label>
                <Input id="gstin" />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="contact-number">Contact Number</Label>
                <Input id="contact-number" defaultValue="9310891509" />
                <p className="text-xs text-right text-muted-foreground">10/30</p>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email ID</Label>
                <Input id="email" type="email" />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="state">State</Label>
                <Select>
                  <SelectTrigger id="state">
                      <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="dl">Delhi</SelectItem>
                      <SelectItem value="mh">Maharashtra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col items-center justify-start pt-4 space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  {/* Placeholder image for a better look */}
                  <AvatarImage src="https://avatar.vercel.sh/heloo" /> 
                  <AvatarFallback className="text-5xl">H</AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-0 right-0 rounded-full">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer remains fixed at the bottom */}
        <DialogFooter className="pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}