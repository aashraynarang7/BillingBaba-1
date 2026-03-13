"use client";
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";

const fields = [
    { id: "category", label: "Category", checked: true },
    { id: "hsn", label: "HSN Code", checked: true },
    { id: "mrp", label: "MRP", checked: true },
    { id: "salePrice", label: "Sale Price", checked: true },
    { id: "purchasePrice", label: "Purchase Price", checked: false },
    { id: "saleDiscount", label: "Sale Discount", checked: false },
    { id: "taxRate", label: "Tax Rate", checked: true },
    { id: "incTax", label: "Inc Tax", checked: false },
    { id: "baseUnit", label: "Base Unit", checked: true },
    { id: "openingStock", label: "Opening Stock", checked: true },
    { id: "minStock", label: "Minimum Stock", checked: false },
    { id: "location", label: "Location", checked: false },
];

export function CustomizeTableSheet({ children }: { children: React.ReactNode }) {
  // In a real app, you would lift this state up to the parent page
  // to actually control the table columns.
  const [checkedFields, setCheckedFields] = React.useState(
    fields.reduce((acc, field) => ({ ...acc, [field.id]: field.checked }), {})
  );

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Customize Item Table</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-6">
            <div>
                <h3 className="font-semibold mb-2">Sale Price Handling</h3>
                <div className="flex items-center space-x-2">
                    <Checkbox id="set-sale-price-equal" defaultChecked/>
                    <Label htmlFor="set-sale-price-equal" className="flex items-center gap-1.5">
                        Set Sale Price Equal To MRP
                        <Info className="h-3.5 w-3.5 text-muted-foreground"/>
                    </Label>
                </div>
            </div>
            <Separator />
            <div>
                <h3 className="font-semibold mb-4">Fields</h3>
                <div className="grid grid-cols-2 gap-4">
                    {fields.map(field => (
                        <div key={field.id} className="flex items-center space-x-2">
                            <Checkbox id={field.id} defaultChecked={field.checked} />
                            <Label htmlFor={field.id}>{field.label}</Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}