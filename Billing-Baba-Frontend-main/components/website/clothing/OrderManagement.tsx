import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Plus } from 'lucide-react'

export default function OrderManagement() {
  return (
    <Card className="overflow-hidden shadow-lg h-full">
      <CardContent className="p-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Payment In <ChevronDown className="ml-2 h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Sale Order</DropdownMenuItem>
                <DropdownMenuItem>Delivery Challan</DropdownMenuItem>
                <DropdownMenuItem>Sale Return/ Cr. Note</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add Sale Order
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>AMOUNT</TableHead><TableHead>STATUS</TableHead>
                <TableHead>TYPE</TableHead><TableHead>ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>₹ 116.00</TableCell>
                <TableCell><Badge variant="destructive">Order Overdue</Badge></TableCell>
                <TableCell>Sale Order</TableCell>
                <TableCell><Button variant="outline" size="sm">Convert to Sale</Button></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>₹ 644.00</TableCell>
                <TableCell><Badge variant="outline" className="text-orange-500 border-orange-500">Order Open</Badge></TableCell>
                <TableCell>Sale Order</TableCell>
                <TableCell><Button variant="outline" size="sm">Convert to Sale</Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-center">
          <h4 className="font-semibold text-foreground">Order Management</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Efficiently handle different order stages to improve accuracy.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}