// app/dashboard/reports/party-statement/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, Printer, FileText, Filter } from "lucide-react";

export default function PartyStatementPage() {
  const [view, setView] = useState<"vyapar" | "accounting">("vyapar");

  return (
    <div className="flex flex-col h-full">
      {/* Main Content Area */}
      <div className="flex-grow space-y-4">
        {/* Filters Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-xl font-bold p-1">
                      This Month <ChevronDown className="w-5 h-5 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Today</DropdownMenuItem>
                    <DropdownMenuItem>This Week</DropdownMenuItem>
                    <DropdownMenuItem>This Month</DropdownMenuItem>
                    <DropdownMenuItem>This Year</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-2 rounded-md border p-1 text-sm bg-gray-100 dark:bg-gray-800">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white dark:bg-gray-700"
                  >
                    Between
                  </Button>
                  <Input
                    type="text"
                    defaultValue="01/09/2025"
                    className="w-28 h-8 border-none bg-transparent focus-visible:ring-0"
                  />
                  <span>To</span>
                  <Input
                    type="text"
                    defaultValue="30/09/2025"
                    className="w-28 h-8 border-none bg-transparent focus-visible:ring-0"
                  />
                </div>
                <Input
                  placeholder="Select Party"
                  className="w-full sm:w-auto"
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <FileText className="w-5 h-5" /> Excel Report
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Printer className="w-5 h-5" /> Print
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <Label>View :</Label>
              <RadioGroup
                value={view}
                onValueChange={(value) => setView(value as any)}
                className="flex items-center"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vyapar" id="vyapar" />
                  <Label htmlFor="vyapar">Vyapar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="accounting" id="accounting" />
                  <Label htmlFor="accounting">Accounting</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center">
                        DATE <Filter className="h-3 w-3 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        TXN... <Filter className="h-3 w-3 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        REF ... <Filter className="h-3 w-3 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        PAY... <Filter className="h-3 w-3 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        TOTAL <Filter className="h-3 w-3 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        REC... <Filter className="h-3 w-3 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        TXN... <Filter className="h-3 w-3 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        RECEIVABLE BA... <Filter className="h-3 w-3 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        PAYABLE BALA... <Filter className="h-3 w-3 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>PRIN...</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-48 text-center text-muted-foreground"
                    >
                      No transactions to show
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Bottom Summary */}
      <div className="mt-auto pt-4">
        <Accordion type="single" collapsible defaultValue="summary">
          <AccordionItem value="summary" className="border-t border-b-0">
            <AccordionTrigger className="font-semibold bg-white p-4 shadow-sm rounded-t-md">
              Party Statement Summary
            </AccordionTrigger>
            <AccordionContent className="bg-white p-6 shadow-sm rounded-b-md">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <div className="font-semibold">Total Sale: ₹ 0.00</div>
                    <div className="text-xs text-muted-foreground">
                      (Sale - Sale Return)
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Total Purchase: ₹ 0.00</div>
                    <div className="text-xs text-muted-foreground">
                      (Purchase - Purchase Return)
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Total Expense: ₹ 0.00</div>
                  </div>
                  <div>
                    <div className="font-semibold">Total Money-in: ₹ 0.00</div>
                  </div>
                  <div>
                    <div className="font-semibold">Total Money-out: ₹ 0.00</div>
                  </div>
                </div>
                <div className="border-l pl-6 ml-6 text-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Receivable
                  </div>
                  <div className="text-2xl font-bold text-teal-600">₹ 0.00</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
