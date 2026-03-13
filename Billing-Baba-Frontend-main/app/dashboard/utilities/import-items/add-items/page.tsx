"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. Import useRouter
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Trash2, Settings2, Wifi, PlayCircle, X } from 'lucide-react';

// Correct the import paths to be relative to the current file
import { StopAddingDialog } from '../../component/stop-adding-dialog';
import { CustomizeTableSheet } from '../../component/customize-table-sheet';

const initialItems = [
  { id: 1, itemCode: '8901058895773', itemName: 'MAGGI H&S TCS Bottle 1kg', category: 'Food', hsnCode: '10006837', mrp: 170, salePrice: 170, tax: null, baseUnit: 'Kilograms', openingStock: null },
  { id: 2, itemCode: '', itemName: '', category: '', hsnCode: '', mrp: null, salePrice: null, tax: null, baseUnit: '', openingStock: null },
  ...Array.from({ length: 8 }, (_, i) => ({ id: i + 3, itemCode: '', itemName: '', category: '', hsnCode: '', mrp: null, salePrice: null, tax: null, baseUnit: '', openingStock: null })),
];

export default function AddItemsPage() {
  const router = useRouter(); // 2. Initialize the router
  const [items, setItems] = useState(initialItems);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false); // 3. Add state to control the dialog

  // 4. Create a function to handle navigating back
  const handleNavigateBack = () => {
    router.push('/dashboard/utilities/import-items');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 flex flex-col p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-sm flex flex-col flex-1">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold">Add Items</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                <Wifi className="h-4 w-4" /> ONLINE: FETCHING FROM LIBRARY
              </div>
              {/* 5. The "X" button now just sets the state to open the dialog */}
              <Button variant="ghost" size="icon" onClick={() => setIsStopDialogOpen(true)}>
                <X className="h-5 w-5"/>
              </Button>
            </div>
          </header>

          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search in sheet" className="pl-10" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">[Ctrl+F]</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline"><Trash2 className="h-4 w-4 mr-2" />Remove All</Button>
               <CustomizeTableSheet>
                  <Button variant="outline"><Settings2 className="h-4 w-4 mr-2" />Customize Table</Button>
               </CustomizeTableSheet>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50 z-10">
                <TableRow>
                  <TableHead className="w-12"><Checkbox /></TableHead>
                  <TableHead>#</TableHead>
                  <TableHead>ITEM CODE</TableHead>
                  <TableHead className="w-64">ITEM NAME*</TableHead>
                  <TableHead>CATEGORY</TableHead>
                  <TableHead>HSN CODE</TableHead>
                  <TableHead>DEFAULT MRP(₹)</TableHead>
                  <TableHead>SALE PRICE(₹)</TableHead>
                  <TableHead>TAX(%)</TableHead>
                  <TableHead>BASE UNIT</TableHead>
                  <TableHead>OPENING STOCK</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell><Checkbox /></TableCell>
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell><Input defaultValue={item.itemCode} placeholder="Enter Barcode" className="border-none"/></TableCell>
                    <TableCell><Input defaultValue={item.itemName} placeholder={index === 1 ? "E.g. India Gate Basmati Rice, 10Kg" : ""} className="border-none" /></TableCell>
                    <TableCell><Select><SelectTrigger className="border-none"><SelectValue placeholder="Select" defaultValue={item.category}/></SelectTrigger></Select></TableCell>
                    <TableCell><Input defaultValue={item.hsnCode} className="border-none"/></TableCell>
                    <TableCell><Input type="number" defaultValue={item.mrp || ''} className="border-none"/></TableCell>
                    <TableCell><Input type="number" defaultValue={item.salePrice || ''} className="border-none"/></TableCell>
                    <TableCell><Select><SelectTrigger className="border-none"><SelectValue placeholder="Select"/></SelectTrigger></Select></TableCell>
                    <TableCell><Select><SelectTrigger className="border-none"><SelectValue placeholder="Select" defaultValue={item.baseUnit}/></SelectTrigger></Select></TableCell>
                    <TableCell><Input type="number" className="border-none"/></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white border-t p-4 flex items-center justify-between shadow-top z-20">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
            <PlayCircle className="h-5 w-5"/>
            <span>Learn how to automatically add items using barcode</span>
            <Button variant="link" className="p-0 h-auto text-sm">Watch Video</Button>
        </div>
        <div className="flex items-center space-x-2">
            {/* 6. Footer buttons now navigate back */}
            <Button variant="outline" className="rounded-full" onClick={handleNavigateBack}>Save & New [Ctrl+N]</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white rounded-full" onClick={handleNavigateBack}>Save [Ctrl+S]</Button>
        </div>
      </footer>

      {/* 7. The dialog is now here, controlled by state and with all required props */}
      <StopAddingDialog 
        open={isStopDialogOpen}
        onOpenChange={setIsStopDialogOpen}
        onConfirm={handleNavigateBack}
      />
    </div>
  );
}