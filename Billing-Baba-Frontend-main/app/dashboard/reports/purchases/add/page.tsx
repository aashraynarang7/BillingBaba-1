// app/dashboard/reports/purchases/add/page.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  X,
  Printer,
  Calculator,
  Calendar as CalendarIcon, // <-- Renamed to avoid conflict
  ChevronDown,
  Upload,
} from "lucide-react";
import Link from "next/link";

type Item = {
  id: number;
  name: string;
  qty: number;
  unit: string;
  price: number;
  tax: string;
};

export default function AddPurchasePage() {
  const [billDate, setBillDate] = useState<Date | undefined>(new Date());
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "", qty: 1, unit: "NONE", price: 0, tax: "NONE" },
    { id: 2, name: "", qty: 1, unit: "NONE", price: 0, tax: "NONE" },
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: "", qty: 1, unit: "NONE", price: 0, tax: "NONE" },
    ]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const totalAmount = items.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  return (
    <div className="bg-slate-100 p-4 min-h-screen">
      <Card className="max-w-7xl mx-auto shadow-lg">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex justify-between items-center bg-gray-50 p-4 border-b">
            <h1 className="text-xl font-semibold text-gray-800">Purchase</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Printer className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Calculator className="w-5 h-5" />
              </Button>
              {/* --- 👇 मैंने इस लिंक को ठीक कर दिया है --- */}
              <Link href="/dashboard/reports">
                <Button variant="ghost" size="icon">
                  <X className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-6">
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">
                  Party *
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Party" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="party1">Party 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">
                  Phone No.
                </Label>
                <Input placeholder="Phone No." />
              </div>
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">
                  Bill Number
                </Label>
                <Input placeholder="Bill Number" />
              </div>
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">
                  Bill Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {billDate ? (
                        format(billDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={billDate}
                      onSelect={setBillDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Items Table */}
            <div className="border rounded-md overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-xs font-medium text-gray-500 uppercase">
                    <th className="p-2 text-left w-12">#</th>
                    <th className="p-2 text-left">Item</th>
                    <th className="p-2 text-left w-24">Qty</th>
                    <th className="p-2 text-left w-28">Unit</th>
                    <th className="p-2 text-left w-40">Price/Unit</th>
                    <th className="p-2 text-left w-40">Tax</th>
                    <th className="p-2 text-right w-32">Amount</th>
                    <th className="p-2 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2 text-center text-gray-500">
                        {index + 1}
                      </td>
                      <td className="p-1">
                        <Input
                          placeholder="Item Name"
                          className="border-none"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          defaultValue={1}
                          className="border-none"
                        />
                      </td>
                      <td className="p-1">
                        <Select defaultValue="NONE">
                          <SelectTrigger className="border-none text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NONE">NONE</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          placeholder="Without Tax"
                          className="border-none"
                        />
                      </td>
                      <td className="p-1">
                        <Select defaultValue="NONE">
                          <SelectTrigger className="border-none text-xs">
                            <SelectValue placeholder="Select Tax" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NONE">NONE</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2 text-right font-medium">0.00</td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 border-t">
                <Button
                  variant="link"
                  className="p-0 text-blue-600 font-semibold"
                  onClick={handleAddItem}
                >
                  ADD ROW
                </Button>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-end">
              <div>
                <Label className="text-xs">Payment Type</Label>
                <Select defaultValue="cash">
                  <SelectTrigger className="w-40 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="link"
                  className="p-0 text-blue-600 text-xs mt-1 block"
                >
                  + Add Payment type
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="roundOff" />
                  <Label htmlFor="roundOff">Round Off</Label>
                </div>
                <div className="text-right">
                  <Label className="text-xs">Total</Label>
                  <Input
                    readOnly
                    className="w-32 text-right font-bold text-lg"
                    value={totalAmount.toFixed(2)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center bg-gray-50 p-4 border-t">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" /> Upload Bill
            </Button>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Share <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Share via WhatsApp</DropdownMenuItem>
                  <DropdownMenuItem>Share via Email</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
