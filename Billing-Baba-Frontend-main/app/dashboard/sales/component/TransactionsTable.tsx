"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Transaction } from '@/lib/types';
import TransactionTableRow from './TransactionTableRow';
import { Search, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OptionsModal, ModalOption } from '@/components/dashboard/OptionsModal';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TransactionsTableProps {
  transactions: Transaction[];
  showToolbar?: boolean;
  onConvert?: (id: string) => void;
  onConvertToOrder?: (id: string) => void;
  onConvertToReturn?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCancel?: (id: string) => void;
  onView?: (id: string) => void;
  onPrint?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onReceivePayment?: (partyId: string, amount: number) => void;
  onMakePayment?: (partyId: string, amount: number, invoiceId?: string) => void;
}

// All possible columns with labels and data accessors
const ALL_COLUMNS: { id: string; label: string; getValue: (t: Transaction) => string | number }[] = [
  { id: 'date',         label: 'Date',               getValue: t => t.date || '' },
  { id: 'invoiceNo',    label: 'Invoice No.',         getValue: t => t.invoiceNo || '' },
  { id: 'partyName',    label: 'Party Name',          getValue: t => t.partyName || '' },
  { id: 'transaction',  label: 'Transaction',         getValue: t => t.transactionType || '' },
  { id: 'paymentType',  label: 'Payment Type',        getValue: t => t.paymentType || '' },
  { id: 'paymentStatus',label: 'Payment Status',      getValue: t => t.status || '' },
  { id: 'total',        label: 'Total',               getValue: t => t.amount || 0 },
  { id: 'receivedPaid', label: 'Received/Paid',       getValue: t => (t as any).receivedOrPaid || 0 },
  { id: 'balanceDue',   label: 'Balance Due',         getValue: t => t.balance || 0 },
  { id: 'orderNumber',  label: 'Order Number',        getValue: t => (t as any).orderNumber || '' },
  { id: 'description',  label: 'Description',         getValue: t => (t as any).description || '' },
  { id: 'partyPhoneNo', label: "Party's Phone No.",   getValue: t => (t as any).partyPhoneNo || '' },
  { id: 'gstin',        label: "Party's GSTIN",       getValue: t => (t as any).gstin || '' },
];

const DEFAULT_CHECKED = new Set([
  'date', 'invoiceNo', 'partyName', 'paymentType', 'total', 'receivedPaid', 'balanceDue',
]);

const buildModalOptions = (): ModalOption[] =>
  ALL_COLUMNS.map(col => ({ id: col.id, label: col.label, checked: DEFAULT_CHECKED.has(col.id) }));

const XlsIcon = () => (
  <div className="bg-green-600 text-white text-[10px] font-bold rounded-sm px-1.5 py-0.5 leading-none">
    xls
  </div>
);

const TransactionsTable = ({ transactions, showToolbar = false, onConvert, onConvertToOrder, onConvertToReturn, onEdit, onDelete, onCancel,
  onView,
  onPrint,
  onDuplicate,
  onReceivePayment,
  onMakePayment,
}: TransactionsTableProps) => {
  const [isPrintModalOpen, setPrintModalOpen] = useState(false);
  const [isExcelModalOpen, setExcelModalOpen] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 10;

  // Filter Logic
  const filteredTransactions = transactions.filter(t => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (t.partyName?.toLowerCase() || "").includes(searchLower) ||
      (String(t.invoiceNo)?.toLowerCase() || "").includes(searchLower) ||
      (String(t.amount) || "").includes(searchLower) ||
      (t.date || "").includes(searchLower)
    );
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleExcelSubmit = async (selectedIds: string[]) => {
    const XLSX = await import('xlsx');
    const selectedCols = ALL_COLUMNS.filter(c => selectedIds.includes(c.id));
    const now = new Date();
    const timestamp = `Generated on ${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    const headerRow = selectedCols.map(c => c.label);
    const dataRows = filteredTransactions.map(t => selectedCols.map(c => c.getValue(t)));
    const aoa = [
      [timestamp], // row 1: timestamp
      [],          // row 2: blank
      headerRow,   // row 3: column headers
      ...dataRows, // row 4+: data
    ];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    const docType = filteredTransactions[0]?.transactionType || 'Transactions';
    XLSX.writeFile(wb, `${docType.replace(/\s+/g, '_')}_${now.toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`);
  };

  const handlePrintSubmit = (selectedIds: string[]) => {
    const selectedCols = ALL_COLUMNS.filter(c => selectedIds.includes(c.id));
    const win = window.open('', '_blank');
    if (!win) return;
    const headers = selectedCols.map(c => `<th>${c.label}</th>`).join('');
    const bodyRows = filteredTransactions.map(t =>
      `<tr>${selectedCols.map(c => `<td>${c.getValue(t)}</td>`).join('')}</tr>`
    ).join('');
    win.document.write(`
      <html><head><title>Transactions</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
        th { background: #f3f4f6; font-weight: 600; }
        tr:nth-child(even) { background: #f9fafb; }
        @media print { body { margin: 0; } }
      </style></head><body>
      <table>
        <thead><tr>${headers}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
      </body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {showToolbar && (
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
            <div className="flex items-center gap-2">

              <AnimatePresence mode="wait">
                {isSearchVisible ? (
                  <motion.div
                    key="search-input"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative flex items-center"
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search Party, Invoice No..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-10 w-56 rounded-full border-2 border-blue-400 pl-10 pr-4 focus-visible:ring-blue-400 focus-visible:ring-offset-0"
                      autoFocus
                      onBlur={() => setSearchVisible(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search-button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button variant="ghost" size="icon" onClick={() => setSearchVisible(true)}>
                      <Search className="h-5 w-5 text-gray-600" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button variant="ghost" size="icon" title="Export to Excel" onClick={() => setExcelModalOpen(true)}>
                <XlsIcon />
              </Button>
              <Button variant="ghost" size="icon" title="Print" onClick={() => setPrintModalOpen(true)}>
                <Printer className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto" ref={tableRef}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Invoice no</TableHead>
                <TableHead>Party Name</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((transaction) => (
                <TransactionTableRow
                  key={transaction.id}
                  transaction={transaction}
                  onConvert={onConvert}
                  onConvertToOrder={onConvertToOrder}
                  onConvertToReturn={onConvertToReturn}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCancel={onCancel}
                  onView={onView}
                  onPrint={onPrint}
                  onDuplicate={onDuplicate}
                  onReceivePayment={onReceivePayment}
                  onMakePayment={onMakePayment}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <OptionsModal
        isOpen={isExcelModalOpen}
        onClose={() => setExcelModalOpen(false)}
        title="Select Excel Columns"
        options={buildModalOptions()}
        buttonText="Export Excel"
        onSubmit={handleExcelSubmit}
      />

      <OptionsModal
        isOpen={isPrintModalOpen}
        onClose={() => setPrintModalOpen(false)}
        title="Select Print Columns"
        options={buildModalOptions()}
        buttonText="Print"
        onSubmit={handlePrintSubmit}
      />
    </>
  );
};

export default TransactionsTable;
