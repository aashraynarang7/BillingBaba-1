"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  Edit,
  Filter,
  Mail,
  MessageCircle,
  MoreVertical,
  Plus,
  PlusCircle,
  Search,
  Share2,
  X,
} from "lucide-react";

import { UpdateItemDialog } from "../../component/update-item-dialog";
import { HideItemDialog } from "../../component/hide-item-dialog";
import { AddCategoryDialog } from "../../component/add-category-dialog";

const items = [
    {
      id: 1,
      product: "Sample Item",
      itemCode: null,
      unit: "pcs",
      inventoryPrice: 100.0,
      storePrice: 100.0,
      inStock: true,
      category: "grocery",
    },
    {
      id: 2,
      product: "mask",
      itemCode: "6675",
      unit: "pcs",
      inventoryPrice: 200.0,
      storePrice: 200.0,
      inStock: true,
      category: "sdfghj",
    },
    {
      id: 3,
      product: "Milk Bottle",
      itemCode: "MB-01",
      unit: "pcs",
      inventoryPrice: 50.0,
      storePrice: 55.0,
      inStock: true,
      category: "grocery",
    },
    {
      id: 4,
      product: "T-Shirt",
      itemCode: "TS-BLUE",
      unit: "pcs",
      inventoryPrice: 400.0,
      storePrice: 500.0,
      inStock: true,
      category: "uyfghj",
    },
];

export default function ManageItemsPage() {
  const router = useRouter(); // 2. Initialize the router
  const [isHideConfirmationOpen, setIsHideConfirmationOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [categories, setCategories] = useState(["All", "grocery", "sdfghj", "uyfghj"]);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = items.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  const handleStockChange = (item: any, checked: boolean) => {
    if (!checked) {
      setSelectedItem(item);
      setIsHideConfirmationOpen(true);
    } else {
      console.log(`Item ${item.id} is now in stock.`);
    }
  };

  return (
    // The main container for the page content, designed to fit inside a dashboard layout
    <div className="p-4 md:p-6">
        {/* Page Header */}
        <header className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Manage Items</h1>
            <div className="flex items-center space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem className="flex flex-col items-start p-2">
                    <span className="font-semibold">Edit Items List</span>
                    <span className="text-xs text-muted-foreground">Add or remove items from your Online Store.</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-2">
                    <span className="font-semibold">Share Online Store</span>
                    <span className="text-xs text-muted-foreground">Share your Online Store with customers.</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-2">
                    <span className="font-semibold">Share Multiple Items</span>
                    <span className="text-xs text-muted-foreground">Share more than one items with customers.</span>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {/* 3. Add the onClick event to the cross button */}
            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/business/online-store')}>
                <X className="h-5 w-5" />
            </Button>
            </div>
        </header>

        {/* Main Content Card */}
        <Card>
            <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Catalogue</h2>
                <div className="flex items-center space-x-2 w-full max-w-sm">
                    <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search Items" className="pl-10" />
                    </div>
                    <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    </Button>
                </div>
                </div>
                <div className="flex items-center space-x-2">
                <AddCategoryDialog>
                    <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Category
                    </Button>
                </AddCategoryDialog>
                {categories.map((cat) => (
                    <Button
                    key={cat}
                    variant={activeCategory === cat ? "default" : "secondary"}
                    size="sm"
                    className="rounded-full px-4"
                    onClick={() => setActiveCategory(cat)}
                    >
                    {cat}
                    </Button>
                ))}
                </div>
            </div>

            <div className="mt-4">
                <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>PRODUCT</TableHead>
                    <TableHead>UNIT</TableHead>
                    <TableHead>INVENTORY PRICE</TableHead>
                    <TableHead>STORE PRICE</TableHead>
                    <TableHead>STOCK</TableHead>
                    <TableHead>ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-blue-50/50">
                        <TableCell>
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-blue-50 text-blue-600">
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                        </TableCell>
                        <TableCell>
                        <div className="font-medium">{item.product}</div>
                        {item.itemCode && (
                            <div className="text-sm text-muted-foreground">
                            ITEM CODE: {item.itemCode}
                            </div>
                        )}
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>₹ {item.inventoryPrice.toFixed(2)}</TableCell>
                        <TableCell>₹ {item.storePrice.toFixed(2)}</TableCell>
                        <TableCell>
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={item.inStock}
                                onCheckedChange={(checked) => handleStockChange(item, checked)}
                            />
                            <span>In Stock</span>
                        </div>
                        </TableCell>
                        <TableCell>
                        <div className="flex items-center space-x-2">
                            <UpdateItemDialog>
                            <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                            </Button>
                            </UpdateItemDialog>
                            <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon">
                                <Share2 className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <div className="flex items-center">
                                    <Button variant="ghost" className="flex flex-col h-auto p-3 space-y-1"><Mail className="h-5 w-5 text-red-500"/><span className="text-xs">EMAIL</span></Button>
                                    <Button variant="ghost" className="flex flex-col h-auto p-3 space-y-1"><MessageCircle className="h-5 w-5 text-blue-500"/><span className="text-xs">SMS</span></Button>
                                    <Button variant="ghost" className="flex flex-col h-auto p-3 space-y-1"><MessageCircle className="h-5 w-5 text-green-500"/><span className="text-xs">WHATSAPP</span></Button>
                                    <Button variant="ghost" className="flex flex-col h-auto p-3 space-y-1"><Copy className="h-5 w-5 text-orange-500"/><span className="text-xs">COPY LINK</span></Button>
                                </div>
                            </PopoverContent>
                            </Popover>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Update Category</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            </CardContent>
        </Card>
      
      <HideItemDialog
        open={isHideConfirmationOpen}
        onOpenChange={setIsHideConfirmationOpen}
      />
    </div>
  );
}