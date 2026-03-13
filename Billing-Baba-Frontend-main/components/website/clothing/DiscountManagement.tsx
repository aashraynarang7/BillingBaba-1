import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from 'lucide-react'

export default function DiscountManagement() {
  return (
    <Card className="overflow-hidden shadow-lg h-full">
      <CardContent className="p-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <Select defaultValue="all-firms"><SelectTrigger className="w-[180px]"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all-firms">All Firms</SelectItem></SelectContent></Select>
            <Button variant="outline"><Calendar className="mr-2 h-4 w-4"/> From: 01/04/2024 To: 29/07/2024</Button>
          </div>
          <div className="border rounded-lg">
            <h5 className="p-2 font-semibold text-center border-b">DISCOUNT REPORT</h5>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Party Name</TableHead><TableHead>Sale Discount</TableHead><TableHead>Purchase / Expense Discount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Arjun</TableCell><TableCell>₹ 2,250.00</TableCell><TableCell>₹ 159.00</TableCell>
                </TableRow>
                 <TableRow className="bg-primary/10">
                  <TableCell className="font-bold">Cash Sale</TableCell><TableCell className="font-bold">₹ 36,000.00</TableCell><TableCell className="font-bold">₹ 0.00</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>Koushik</TableCell><TableCell>₹ 0.00</TableCell><TableCell>₹ 0.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="mt-4 text-center">
            <h4 className="font-semibold text-foreground">Discount Management</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Analyze and manage discount strategies to boost sales.
            </p>
        </div>
      </CardContent>
    </Card>
  )
}