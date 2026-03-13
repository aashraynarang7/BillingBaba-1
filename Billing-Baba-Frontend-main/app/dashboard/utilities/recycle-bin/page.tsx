"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  Search,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

// Sample data
const deletedItems = [
  {
    id: "1",
    date: "04/09/2025",
    refNo: "1",
    partyName: "adarsh",
    txnType: "Estimate",
    paymentType: "—",
    amount: 165.0,
    deletedOn: "04/09/2025, 5:48 PM",
  },
];

// Reusable header cell with filter icon
const TableHeaderCell = ({ children }: { children: React.ReactNode }) => (
  <TableHead className="font-semibold text-gray-500">
    <div className="flex items-center gap-2">
      <span>{children}</span>
      <ArrowUpDown className="h-3.5 w-3.5" />
    </div>
  </TableHead>
);

export default function RecycleBinPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Recycle Bin</h1>
        <Button variant="outline">
          <Trash2 className="h-4 w-4 mr-2" /> Empty Trash
        </Button>
      </header>

      {/* Main Card */}
      <Card className="shadow-md">
        <CardHeader className="p-4 border-b">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="font-bold">
                    Custom <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Today</DropdownMenuItem>
                  <DropdownMenuItem>This Week</DropdownMenuItem>
                  <DropdownMenuItem>This Month</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="text-sm bg-gray-200 text-gray-600 px-3 py-1.5 rounded-l-md">
                Between
              </span>
              <Input defaultValue="04/09/2025" className="w-32 rounded-none" />
              <span className="text-sm bg-gray-200 text-gray-600 px-3 py-1.5">
                To
              </span>
              <Input
                defaultValue="04/09/2025"
                className="w-32 rounded-l-none rounded-r-md"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    ALL FIRM <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Firm A</DropdownMenuItem>
                  <DropdownMenuItem>Firm B</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHeaderCell>TRANSACTION DATE</TableHeaderCell>
                  <TableHeaderCell>REF. NO.</TableHeaderCell>
                  <TableHeaderCell>PARTY NAME</TableHeaderCell>
                  <TableHeaderCell>TXN TYPE</TableHeaderCell>
                  <TableHeaderCell>PAYMENT TYPE</TableHeaderCell>
                  <TableHeaderCell>AMOUNT</TableHeaderCell>
                  <TableHeaderCell>DELETED ON</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedItems.map((item) => (
                  <TableRow key={item.id} className="border-t">
                    <TableCell>
                      <RadioGroup onValueChange={setSelectedItem}>
                        <RadioGroupItem
                          value={item.id}
                          id={`item-${item.id}`}
                        />
                      </RadioGroup>
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.refNo}</TableCell>
                    <TableCell>{item.partyName}</TableCell>
                    <TableCell>{item.txnType}</TableCell>
                    <TableCell>{item.paymentType}</TableCell>
                    <TableCell>₹ {item.amount.toFixed(2)}</TableCell>
                    <TableCell>{item.deletedOn}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="p-4 flex justify-end gap-2 bg-gray-50/50">
          <Button variant="outline" disabled={!selectedItem}>
            Delete Permanently
          </Button>
          <Button disabled={!selectedItem}>Restore</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
