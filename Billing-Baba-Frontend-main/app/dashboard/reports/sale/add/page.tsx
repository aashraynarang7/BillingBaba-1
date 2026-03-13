"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, X, Printer, Download, MessageCircle } from "lucide-react";
import Link from "next/link";

// Item row ke liye type definition
type Item = {
  id: number;
  name: string;
  qty: number;
  price: number;
  discount: number;
};

export default function AddSalePage() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Sample Item", qty: 10, price: 100, discount: 0 },
  ]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [amountReceived, setAmountReceived] = useState(0);
  const [isFullyReceived, setIsFullyReceived] = useState(false);

  // Totals ko calculate karna
  const calculateTotal = (item: Item) => {
    const totalBeforeDiscount = item.qty * item.price;
    const discountAmount = totalBeforeDiscount * (item.discount / 100);
    return totalBeforeDiscount - discountAmount;
  };

  const subTotal = items.reduce((acc, item) => acc + calculateTotal(item), 0);
  const totalAmount = subTotal;
  const balance = isFullyReceived ? 0 : totalAmount - amountReceived;

  // Items ko handle karne ke functions
  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: "", qty: 1, price: 0, discount: 0 },
    ]);
  };

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string | number
  ) => {
    const newItems = [...items];
    const numericValue =
      typeof value === "string" ? parseFloat(value) || 0 : value;
    // Type assertion to allow dynamic property access
    (newItems[index] as any)[field] = field === "name" ? value : numericValue;
    setItems(newItems);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-text-primary">
            Create Your First Invoice
          </h1>
          <Link href="/dashboard/reports/sale">
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm space-y-8">
            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="customerName">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCustomerName(e.target.value)
                  }
                  placeholder="Enter Name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Customer Phone Number</Label>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +91
                  </span>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCustomerPhone(e.target.value)
                    }
                    placeholder="Enter Number"
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <div className="w-full text-sm text-left">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase pb-2 border-b">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Item</div>
                  <div className="col-span-2">Qty</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Discount(%)</div>
                  <div className="col-span-1 text-right">Total</div>
                </div>
                <div className="space-y-2 mt-2">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-4 items-center"
                    >
                      <div className="col-span-1 text-gray-500">
                        {index + 1}
                      </div>
                      <div className="col-span-4">
                        <Input
                          value={item.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleItemChange(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.qty}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleItemChange(index, "qty", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleItemChange(index, "price", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        {/* ===== YAHAN ERROR THEEK KIYA GAYA HAI ===== */}
                        <Input
                          type="number"
                          value={item.discount}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleItemChange(index, "discount", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-1 text-right font-medium text-gray-700">
                        {calculateTotal(item).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="link"
                className="mt-4 p-0 text-blue-600"
                onClick={handleAddItem}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Row
              </Button>
              <div className="text-right font-semibold text-gray-800 mt-4 border-t pt-4">
                Sub Total: {subTotal.toFixed(2)}
              </div>
            </div>

            {/* Payment Details */}
            <div className="flex justify-between items-center border-t pt-6">
              <div>
                <Label htmlFor="received">Received</Label>
                <Input
                  id="received"
                  type="number"
                  className="w-40 mt-1"
                  value={amountReceived}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAmountReceived(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="fullyReceived"
                  checked={isFullyReceived}
                  onCheckedChange={(checked) => setIsFullyReceived(!!checked)}
                />
                <Label htmlFor="fullyReceived">Fully Received</Label>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Balance</p>
                <p className="font-semibold">{balance.toFixed(2)}</p>
              </div>
            </div>

            {/* Total Amount Footer */}
            <div className="bg-blue-100/60 p-4 rounded-lg flex justify-between items-center mt-6">
              <span className="text-lg font-bold text-blue-800">
                Total Amount (₹)
              </span>
              <span className="text-2xl font-bold text-blue-800">
                {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Right Column: Invoice Preview */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-gray-700 text-white p-4 rounded-t-lg">
                <h3 className="text-xl font-bold text-center">Tax Invoice</h3>
              </CardHeader>
              <CardContent className="p-4 text-xs space-y-4 bg-white">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-bold text-lg">My Company</p>
                    <p>Phone: 9569337844</p>
                  </div>
                  <div className="w-20 h-12 bg-gray-300 flex items-center justify-center text-gray-500">
                    LOGO
                  </div>
                </div>
                <div className="text-right text-gray-600">
                  <p>
                    <strong>Ncc:</strong> 1
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date().toLocaleDateString("en-GB")}
                  </p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>HSN/SAC</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price/Unit</TableHead>
                      <TableHead className="text-right">Amount(₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>--</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell>₹{item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          ₹{(item.qty * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold border-t-2">
                      <TableCell colSpan={5} className="text-right">
                        Total
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{totalAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center pt-6">
                  <Button className="bg-primary-red hover:bg-red-700 w-1/3 font-bold">
                    SAVE
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Printer className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
