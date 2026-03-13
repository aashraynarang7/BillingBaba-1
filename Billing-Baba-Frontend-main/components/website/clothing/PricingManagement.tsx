"use client"
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PricingManagement() {
  const [activeTab, setActiveTab] = useState("Sale");

  return (
    <Card className="overflow-hidden shadow-lg h-full">
      <CardContent className="p-6">
        <div className="flex border-b">
          {["Items", "Sale", "Purchase"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="bg-muted/50 rounded-lg p-4 mt-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Sale Price</label>
              <div className="flex items-center gap-2 mt-1">
                <Input type="number" placeholder="90" />
                <div className="flex items-center gap-2"><Switch id="with-tax-sale"/> <label htmlFor="with-tax-sale">With Tax</label></div>
                <Select defaultValue="percentage"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="percentage">Percentage</SelectItem></SelectContent></Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Wholesale Price</label>
              <div className="flex items-center gap-2 mt-1">
                <Input type="number" placeholder="90" />
                <div className="flex items-center gap-2"><Switch id="with-tax-wholesale"/> <label htmlFor="with-tax-wholesale">With Tax</label></div>
                <Input type="number" placeholder="Minimum Wholesale Qty"/>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
            <h4 className="font-semibold text-foreground">Set Retail & Wholesale Pricing</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Define separate pricing structures for different customer segments.
            </p>
        </div>
      </CardContent>
    </Card>
  )
}