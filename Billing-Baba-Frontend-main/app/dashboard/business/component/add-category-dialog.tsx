"use client"
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
  
  export function AddCategoryDialog({ children }: { children: React.ReactNode }) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Enter Category Name</Label>
              <Input
                id="category-name"
                placeholder="e.g., Grocery"
              />
            </div>
          </div>
          <DialogFooter>
            {/* The red 'Create' button */}
            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full text-lg py-6"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }