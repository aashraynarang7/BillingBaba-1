"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy, Edit, Eye, EyeOff, Filter, Loader2,
  Mail, MessageCircle, MoreVertical, Plus, Search, Share2, X,
} from "lucide-react";
import { fetchItems, updateItem } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { AddCategoryDialog } from "../../component/add-category-dialog";
import { UpdateItemDialog } from "../../component/update-item-dialog";
import { UpdateCategoryDialog } from "../../component/update-category-dialog";

export default function ManageItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchItems({ type: 'product' });
      const flattened = data.map((item: any) => {
        const details = item.product || {};
        return {
          ...details,
          ...item,
          unit: details.unit || item.unit || 'PCS',
          salePrice: details.salePrice || item.salePrice,
          product: item.product,
        };
      });
      setItems(flattened);
    } catch {
      toast({ title: "Failed to load items", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  // Derive categories from inventory items
  const categories = ["All", ...Array.from(
    new Set(items.map((i: any) => i.product?.category || i.category).filter(Boolean))
  ) as string[]];

  const filtered = items.filter((item: any) => {
    if (item.isHiddenFromStore) return false;
    const cat = item.product?.category || item.category || '';
    const matchesCategory = activeCategory === "All" || cat === activeCategory;
    const matchesSearch = !searchTerm ||
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.product?.itemCode || item.itemCode || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Toggle store-specific stock status — does NOT touch isActive (inventory status)
  const handleToggleStock = async (item: any, outOfStock: boolean) => {
    setUpdatingId(item._id);
    try {
      await updateItem(item._id, { isOutOfStockOnStore: outOfStock });
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, isOutOfStockOnStore: outOfStock } : i));
      toast({
        title: outOfStock ? `${item.name} marked Out of Stock on store` : `${item.name} marked In Stock on store`,
        className: "bg-green-600 text-white",
      });
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  // Toggle hide/unhide from online store — does NOT touch isActive (inventory status)
  const handleToggleHide = async (item: any, hide: boolean) => {
    setUpdatingId(item._id);
    try {
      await updateItem(item._id, { isHiddenFromStore: hide });
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, isHiddenFromStore: hide } : i));
      toast({
        title: hide ? `${item.name} hidden from online store` : `${item.name} visible on online store`,
        className: "bg-green-600 text-white",
      });
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const getInventoryPrice = (item: any) =>
    item.salePrice?.amount ?? item.product?.salePrice?.amount ?? 0;

  const getStorePrice = (item: any) => {
    const storePrice = item.product?.onlineStorePrice || item.onlineStorePrice;
    return storePrice || getInventoryPrice(item);
  };

  const getItemCode = (item: any) =>
    item.product?.itemCode || item.itemCode || null;

  const getUnit = (item: any) =>
    `PER ${(item.product?.unit || item.unit || 'PCS').toUpperCase()}`;

  const isHidden = (item: any) => item.isHiddenFromStore === true;

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Items</h1>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem className="flex flex-col items-start p-2">
                <span className="font-semibold">Share Online Store</span>
                <span className="text-xs text-muted-foreground">Share your Online Store with customers.</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-2">
                <span className="font-semibold">Share Multiple Items</span>
                <span className="text-xs text-muted-foreground">Share more than one item with customers.</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/business/online-store')}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <Card>
        <CardContent className="p-4">
          {/* Catalogue header + search */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Catalogue</h2>
              <div className="flex items-center space-x-2 w-full max-w-sm">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items"
                    className="pl-10"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <AddCategoryDialog onSuccess={loadItems}>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Category
                </Button>
              </AddCategoryDialog>
              {categories.map(cat => (
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

          {/* Table */}
          <div className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">No items found</div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>PRODUCT</TableHead>
                    <TableHead>UNIT</TableHead>
                    <TableHead>INVENTORY PRICE</TableHead>
                    <TableHead>STORE PRICE</TableHead>
                    <TableHead>STOCK</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item: any) => (
                    <TableRow key={item._id} className="hover:bg-blue-50/50">
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        {getItemCode(item) && (
                          <div className="text-xs text-muted-foreground">ITEM CODE : {getItemCode(item)}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{getUnit(item)}</TableCell>
                      <TableCell className="text-sm">₹ {getInventoryPrice(item).toFixed(2)}</TableCell>
                      <TableCell className="text-sm">₹ {getStorePrice(item).toFixed(2)}</TableCell>

                      {/* Stock status — store-specific, independent of inventory */}
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {updatingId === item._id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                          ) : (
                            <Switch
                              checked={item.isOutOfStockOnStore !== true}
                              onCheckedChange={(checked) => handleToggleStock(item, !checked)}
                            />
                          )}
                          <span className="text-sm text-gray-500">
                            {item.isOutOfStockOnStore ? "Out of Stock" : "In Stock"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {/* Edit store price / description */}
                          <UpdateItemDialog>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </UpdateItemDialog>

                          {/* Share */}
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <div className="flex items-center">
                                <Button variant="ghost" className="flex flex-col h-auto p-3 space-y-1"><Mail className="h-5 w-5 text-red-500" /><span className="text-xs">EMAIL</span></Button>
                                <Button variant="ghost" className="flex flex-col h-auto p-3 space-y-1"><MessageCircle className="h-5 w-5 text-blue-500" /><span className="text-xs">SMS</span></Button>
                                <Button variant="ghost" className="flex flex-col h-auto p-3 space-y-1"><MessageCircle className="h-5 w-5 text-green-500" /><span className="text-xs">WHATSAPP</span></Button>
                                <Button variant="ghost" className="flex flex-col h-auto p-3 space-y-1"><Copy className="h-5 w-5 text-orange-500" /><span className="text-xs">COPY LINK</span></Button>
                              </div>
                            </PopoverContent>
                          </Popover>

                          {/* Hide / Unhide from online store */}
                          {updatingId === item._id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500 mx-2" />
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              title={isHidden(item) ? "Show on store" : "Hide from store"}
                              onClick={() => handleToggleHide(item, !isHidden(item))}
                            >
                              {isHidden(item)
                                ? <EyeOff className="h-4 w-4 text-gray-400" />
                                : <Eye className="h-4 w-4 text-gray-600" />
                              }
                            </Button>
                          )}

                          <UpdateCategoryDialog item={item} onSuccess={loadItems}>
                            <Button variant="ghost" size="icon" title="Update Category">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </UpdateCategoryDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
