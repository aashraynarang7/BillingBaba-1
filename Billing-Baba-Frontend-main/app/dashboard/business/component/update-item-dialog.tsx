import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Eye, ImagePlus, Plus, X } from "lucide-react";
  
  export function UpdateItemDialog({ children }: { children: React.ReactNode }) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Update Item</DialogTitle>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon"><Eye className="h-5 w-5"/></Button>
              <DialogClose asChild>
                  <Button variant="ghost" size="icon"><X className="h-5 w-5"/></Button>
              </DialogClose>
            </div>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {/* Left Side: Image Upload */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full max-w-xs p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-64 bg-gray-50 text-muted-foreground">
                <ImagePlus className="h-16 w-16 mb-4" />
                <Button variant="outline" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12 bg-white">
                  <Plus className="h-4 w-4 mr-2" /> Add Image
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">+ Add Image</p>
            </div>
            {/* Right Side: Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input id="product-name" defaultValue="Sample Item" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="selling-price">Selling Price</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                  <Input id="selling-price" defaultValue="100" className="pl-7" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grocery">grocery</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-description">Product Description</Label>
                <Textarea id="product-description" placeholder="Enter description" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">Save Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }