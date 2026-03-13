"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

export function BuyCreditsDialog({ children }: { children: React.ReactNode }) {
  const [amount, setAmount] = useState(2000);
  const quickAddAmounts = [500, 1000, 2500, 5000];

  const handleQuickAdd = (addAmount: number) => {
    setAmount(prev => prev + addAmount);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy Credits</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Enter Amount*</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="pl-7"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            The amount used to buy credits is non-refundable.
          </p>
          <div className="flex items-center gap-2">
            {quickAddAmounts.map(val => (
                <Button key={val} variant="outline" size="sm" onClick={() => handleQuickAdd(val)}>
                    +₹{val}
                </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Pay Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}