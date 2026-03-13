import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { ImageOff, Phone, Search } from "lucide-react";
  import { Card, CardContent } from "@/components/ui/card";
  
  export function PreviewDialog({ children }: { children: React.ReactNode }) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        {/* Changed SheetContent to DialogContent */}
        <DialogContent className="sm:max-w-lg p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Store Preview</DialogTitle>
          </DialogHeader>
          {/* Added a scrollable container for the content */}
          <div className="max-h-[70vh] overflow-y-auto px-6 pb-6 space-y-6">
            <div className="bg-primary/10 p-3 rounded-lg flex items-center justify-between">
              <p className="text-sm">
                <span className="font-semibold">Do you own a business?</span> Make
                your business online with Vyapar app
              </p>
              <Button size="sm">Download Vyapar App</Button>
            </div>
  
            <div className="text-center space-y-2">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src="https://via.placeholder.com/150" />
                <AvatarFallback className="text-3xl">H</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">heloo</h2>
              <div className="flex items-center justify-center text-muted-foreground">
                <Phone className="w-4 h-4 mr-2" />
                <span>9310891509</span>
              </div>
            </div>
  
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for an item" className="pl-10" />
            </div>
  
            <div className="flex space-x-2">
              <Button variant="default" size="sm" className="rounded-full">All</Button>
              <Button variant="secondary" size="sm" className="rounded-full">sdfghj</Button>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-3">
                  <div className="bg-muted aspect-square rounded-md flex items-center justify-center mb-2">
                    <ImageOff className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm">Sample Item</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-sm">₹ 100</span>
                    <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/10 hover:text-primary rounded-full">+Add</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="bg-muted aspect-square rounded-md flex items-center justify-center mb-2">
                    <ImageOff className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm">mask</h3>
                  <p className="text-xs text-muted-foreground">ITEM CODE: 6675</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-bold text-sm">₹ 200</span>
                    <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/10 hover:text-primary rounded-full">+Add</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }