"use client";

import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { MoreVertical, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface JobWorkOutTableProps {
    transactions: any[];
    onDelete?: (id: string) => void;
    onReceiveGoods?: (id: string) => void;
    onAddNew?: () => void;
}

const JobWorkOutTable = ({ transactions, onDelete, onReceiveGoods, onAddNew }: JobWorkOutTableProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-700">Transactions</h2>
                <Button
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full px-4 h-8 text-sm"
                    onClick={onAddNew}
                >
                    + Job Work Out
                </Button>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                            <TableHead className="font-semibold">
                                <span className="flex items-center gap-1">DATE <span className="text-gray-300">▼</span></span>
                            </TableHead>
                            <TableHead className="font-semibold">
                                <span className="flex items-center gap-1">PARTY <span className="text-gray-300">▼</span></span>
                            </TableHead>
                            <TableHead className="font-semibold">
                                <span className="flex items-center gap-1">JOB ID <span className="text-gray-300">▼</span></span>
                            </TableHead>
                            <TableHead className="font-semibold">
                                <span className="flex items-center gap-1">DELIVERY DATE <span className="text-gray-300">▼</span></span>
                            </TableHead>
                            <TableHead className="font-semibold">
                                <span className="flex items-center gap-1">STATUS <span className="text-gray-300">▼</span></span>
                            </TableHead>
                            <TableHead className="font-semibold">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((t) => {
                            const isClosed = t.status === 'CONVERTED';
                            return (
                                <TableRow key={t.id} className="hover:bg-gray-50 border-b border-gray-100">
                                    <TableCell className="text-sm text-gray-700">{t.date}</TableCell>
                                    <TableCell className="text-sm font-medium text-gray-800">{t.partyName}</TableCell>
                                    <TableCell className="text-sm text-gray-700">{t.jobId}</TableCell>
                                    <TableCell className="text-sm text-gray-700">{t.deliveryDateFormatted}</TableCell>
                                    <TableCell>
                                        {isClosed ? (
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-300 uppercase">
                                                    CLOSED
                                                </span>
                                                {t.convertedAtFormatted && (
                                                    <span className="text-xs text-gray-500">{t.convertedAtFormatted}</span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 uppercase">
                                                OPEN
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {isClosed ? (
                                                <button
                                                    className="text-sm text-blue-600 hover:underline"
                                                    onClick={() => onReceiveGoods?.(t.id)}
                                                >
                                                    Converted to invoice ...
                                                </button>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 h-7 rounded-full text-xs font-semibold px-4 border border-blue-200"
                                                    onClick={() => onReceiveGoods?.(t.id)}
                                                >
                                                    Receive Goods
                                                </Button>
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                                        <MoreVertical className="h-4 w-4 text-gray-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => onReceiveGoods?.(t.id)}>
                                                        <Eye className="mr-2 h-4 w-4" /> View
                                                    </DropdownMenuItem>
                                                    {onDelete && !isClosed && (
                                                        <DropdownMenuItem onClick={() => onDelete(t.id)} className="text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {transactions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-gray-400 text-sm">
                                    No transactions found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default JobWorkOutTable;
