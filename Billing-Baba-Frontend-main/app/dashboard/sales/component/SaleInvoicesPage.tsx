"use client";

import React, { useState } from 'react';
import {
    ChevronDown,
    Check,
    Calendar as CalendarIcon,
    Search,
    BarChart2,
    Printer,
    Settings,
    MoreVertical,
    Share2,
    Plus,
    Filter
} from 'lucide-react';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";

// Custom XLS Icon Component
const XlsIcon = () => <span className="text-xs bg-green-600 text-white font-bold px-1.5 py-0.5 rounded">XLS</span>;

// Data for the main dropdown
const invoiceTypes = [
    "Sale Invoices", "Estimate/Quotation", "Proforma Invoice",
    "Payment-In", "Sale Order", "Delivery Challan", "Sale Return", "Billing Baba POS"
];

// Sample data for the table
const invoices = [
    {
        date: "03/09/2025",
        invoiceNo: 1,
        partyName: "adarsh",
        transaction: "Sale",
        paymentType: "Cash",
        amount: "₹ 1,000",
        balance: "₹ 112"
    },
    // Add more sample invoices here
];

export default function SaleInvoicesPage() {
    const [selectedInvoiceType, setSelectedInvoiceType] = useState("Sale Invoices");
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2025, 8, 1),
        to: addDays(new Date(2025, 8, 30), 0),
    });

    return (
        <div className="bg-gray-50/50 min-h-screen p-4 sm:p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* --- HEADER --- */}
                <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 text-2xl font-bold text-gray-800 p-0 hover:bg-transparent">
                                {selectedInvoiceType} <ChevronDown className="h-6 w-6" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64">
                            <DropdownMenuRadioGroup value={selectedInvoiceType} onValueChange={setSelectedInvoiceType}>
                                {invoiceTypes.map(type => (
                                    <DropdownMenuRadioItem key={type} value={type}>
                                        {type}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center gap-3 mt-4 sm:mt-0">
                        <Button className="bg-[var(--accent-red)] text-white font-bold rounded-full shadow-sm hover:bg-red-600">
                            <Plus size={18} className="mr-2" /> Add Sale
                        </Button>
                        <Button variant="outline" size="icon">
                            <Settings className="h-5 w-5 text-gray-600" />
                        </Button>
                    </div>
                </header>

                {/* --- MAIN CONTENT CARD --- */}
                <Card className="shadow-sm">
                    <CardContent className="p-0">
                        {/* Filter Bar */}
                        <div className="p-4 border-b">
                            <div className="flex flex-wrap items-center gap-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="bg-blue-50/80 border-blue-200 text-blue-800 font-semibold hover:bg-blue-100">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date?.from ? (
                                                date.to ? (
                                                    <>
                                                        {format(date.from, "dd/MM/yy")} - {format(date.to, "dd/MM/yy")}
                                                    </>
                                                ) : (
                                                    format(date.from, "dd/MM/yy")
                                                )
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={date?.from}
                                            selected={date}
                                            onSelect={setDate}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Button variant="outline" className="bg-gray-100 border-gray-200 text-gray-700 font-medium">
                                    heloo <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Summary Section */}
                        <div className="p-4 border-b">
                            <div className="inline-block bg-purple-50 p-3 rounded-lg border border-purple-200">
                                <p className="text-sm text-purple-800 font-semibold">Total Balance: <span className="font-bold">₹ 112</span></p>
                            </div>
                        </div>

                        {/* Table Actions Bar */}
                        <div className="p-4 flex justify-end">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button>
                                <Button variant="ghost" size="icon"><BarChart2 className="h-5 w-5" /></Button>
                                <Button variant="ghost" size="icon"><XlsIcon /></Button>
                                <Button variant="ghost" size="icon"><Printer className="h-5 w-5" /></Button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead><div className="flex items-center gap-1">Date <Filter className="h-3 w-3" /></div></TableHead>
                                    <TableHead><div className="flex items-center gap-1">Invoice no <Filter className="h-3 w-3" /></div></TableHead>
                                    <TableHead><div className="flex items-center gap-1">Party Name <Filter className="h-3 w-3" /></div></TableHead>
                                    <TableHead><div className="flex items-center gap-1">Transaction <Filter className="h-3 w-3" /></div></TableHead>
                                    <TableHead><div className="flex items-center gap-1">Payment Type <Filter className="h-3 w-3" /></div></TableHead>
                                    <TableHead className="text-right"><div className="flex items-center justify-end gap-1">Amount <Filter className="h-3 w-3" /></div></TableHead>
                                    <TableHead className="text-right"><div className="flex items-center justify-end gap-1">Balance <Filter className="h-3 w-3" /></div></TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.invoiceNo}>
                                        <TableCell>{invoice.date}</TableCell>
                                        <TableCell>{invoice.invoiceNo}</TableCell>
                                        <TableCell className="font-medium">{invoice.partyName}</TableCell>
                                        <TableCell>{invoice.transaction}</TableCell>
                                        <TableCell>{invoice.paymentType}</TableCell>
                                        <TableCell className="text-right font-semibold">{invoice.amount}</TableCell>
                                        <TableCell className="text-right font-semibold">{invoice.balance}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-1">
                                                <Button variant="ghost" size="icon"><Printer className="h-5 w-5" /></Button>
                                                <Button variant="ghost" size="icon"><Share2 className="h-5 w-5" /></Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}