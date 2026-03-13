"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const defaultShareMessage = `Hello!
Now place orders from your home and get attractive discounts. Check out my Online Store now:
https://vyaparapp.in/store/heloo1
Call us at: 9310891509 for any help`;

export function ShareDialog({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState(defaultShareMessage);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Preview & Share</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 p-3 rounded-md text-center text-sm">
            <span>Get your own website for online store now. </span>
            <Link href="#" className="text-primary font-semibold hover:underline">
              Click here
            </Link>
          </div>

          {/* Message Editor */}
          <div className="space-y-2">
            <Label htmlFor="share-message">Edit Message</Label>
            <Textarea
              id="share-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px] text-sm"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="dont-show-again" />
              <Label htmlFor="dont-show-again" className="font-normal text-sm">
                Don't Show this popup again
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              NOTE: Edited messages can't be sent via SMS
            </p>
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
            </DialogClose>
            <Button type="submit">Save & Share</Button>
            </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}