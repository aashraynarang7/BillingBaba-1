"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const themes = ["GST Theme 1", "GST Theme 2", "GST Theme 3", "GST Theme 4", "GST Theme 5"];
const colors = ["#4A90E2", "#50E3C2", "#9013FE", "#F5A623", "#F8E71C", "#8B572A", "#7ED321", "#E94E77", "#D0021B", "#417505", "#BD10E0", "#9B9B9B", "#000000", "#FFFFFF"];

export default function CustomizeBilling() {
  const [activeTheme, setActiveTheme] = useState("GST Theme 1");
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <Card className="overflow-hidden shadow-lg h-full">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="w-1/3 space-y-2">
            {themes.map(theme => (
              <Button 
                key={theme} 
                variant={activeTheme === theme ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTheme(theme)}
              >
                {theme}
              </Button>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between mt-4">
                  <span>Select Color</span>
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: selectedColor }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="grid grid-cols-7 gap-1">
                  {colors.map(color => (
                    <button 
                      key={color} 
                      className={`w-6 h-6 rounded-full border ${selectedColor === color ? 'ring-2 ring-primary' : ''}`} 
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="w-2/3 bg-muted/50 rounded-lg p-4 text-xs">
            <p className="font-bold">Invoice Details</p>
            <p className="text-muted-foreground">Invoice No: 1 / Date: 01-04-2024</p>
            <div className="mt-4 bg-card p-2 rounded">
              <div className="grid grid-cols-5 font-bold border-b pb-1">
                <span>Item</span><span>Qty</span><span>Price</span><span>Tax</span><span>Amount</span>
              </div>
              <div className="grid grid-cols-5 mt-2">
                <span>T-Shirt</span><span>1</span><span>₹1,100</span><span>12%</span><span>₹1,232.00</span>
              </div>
               <div className="grid grid-cols-5 mt-2">
                <span>Jeans</span><span>1</span><span>₹1,500</span><span>18%</span><span>₹1,770.00</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <div className="w-1/2 space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹2,832.00</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total Tax</span><span>₹370.00</span></div>
                <div className="flex justify-between font-bold"><span >Total</span><span>₹3,202.00</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
            <h4 className="font-semibold text-foreground">Customize Billing</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Automate tasks for billing processes for your business.
            </p>
        </div>
      </CardContent>
    </Card>
  )
}