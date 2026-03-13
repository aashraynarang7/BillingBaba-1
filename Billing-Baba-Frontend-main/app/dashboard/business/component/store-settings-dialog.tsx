import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
  import { Button } from "@/components/ui/button";
  import { Label } from "@/components/ui/label";
  import { Switch } from "@/components/ui/switch";
  import { Separator } from "@/components/ui/separator";
  import { ChevronRight, Info } from "lucide-react";
  
  export function StoreSettingsDialog({ children }: { children: React.ReactNode }) {
    return (
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[480px] px-10 ">
          <SheetHeader>
            <SheetTitle className="text-2xl text-left">Store Settings</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-6">
            {/* Accept Online Orders */}
            <div className="flex items-center justify-between">
              <Label htmlFor="accept-orders" className="text-base font-medium">
                Accept Online Orders
              </Label>
              <Switch id="accept-orders" defaultChecked />
            </div>
  
            {/* Minimum Order Amount */}
            <div className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 -m-2 rounded-md">
              <div>
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="min-order" className="text-base font-medium">
                    Set Minimum Order Amount
                  </Label>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Current minimum order value: ₹ 0.00
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <Separator />
            
            {/* Additional Charges */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5">
                <Label className="text-base font-medium">Additional Charges</Label>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="space-y-4 pl-2">
                <div className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 -m-2 rounded-md">
                   <Label>Delivery Charges</Label>
                   <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                   <Label htmlFor="add-taxes">Add Taxes to the final Cart Value</Label>
                   <Switch id="add-taxes" defaultChecked/>
                </div>
                <div className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 -m-2 rounded-md">
                   <Label>Custom Charges</Label>
                   <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <Separator />
            
             {/* Item Discounts & Stock */}
             <div className="space-y-4">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="item-discounts" className="text-base font-medium">Item Discounts</Label>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <Switch id="item-discounts" />
              </div>
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="link-stock" className="text-base font-medium">Link Stock to Online Store</Label>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <Switch id="link-stock" />
              </div>
             </div>
  
          </div>
          <SheetFooter>
            <Button type="submit" className="w-full">Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }