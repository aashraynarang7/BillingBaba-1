"use client";

import { useState, useEffect } from 'react';
import TransactionsTable from '../component/TransactionsTable';
import { Transaction } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, Plus } from 'lucide-react';
import FilterBar from '../component/FilterBar';
import { fetchSaleInvoices } from '@/lib/api';
import PaymentInModal from '../component/PaymentInModal';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import CreateSaleInvoicePage from './CreateSaleInvoicePage';
import { InvoicePreview } from '../component/InvoicePreview';
import { toast } from '@/components/ui/use-toast';

const SaleInvoices = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isPaymentInOpen, setIsPaymentInOpen] = useState(false);
  const [paymentPartyId, setPaymentPartyId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [paymentInvoiceId, setPaymentInvoiceId] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Transaction | null>(null);
  const [printInvoiceData, setPrintInvoiceData] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const invoicesData = await fetchSaleInvoices(filters);

      const mappedInvoices: Transaction[] = invoicesData.map((inv: any) => ({
        id: inv._id,
        ...inv,
        date: inv.invoiceDate ? format(new Date(inv.invoiceDate), "dd/MM/yyyy") : "-",
        invoiceNo: inv.invoiceNumber || "-",
        partyName: inv.partyName || "Unknown",
        partyId: inv.partyId?._id || inv.partyId || undefined,
        transactionType: 'Sale',
        paymentType: inv.paymentType || "Cash",
        amount: Number(inv.grandTotal) || 0,
        balance: Number(inv.balanceDue) || 0,
        isPaid: inv.isPaid !== undefined ? inv.isPaid : (Number(inv.balanceDue || 0) <= 0),
        status: inv.status,
        dueDate: inv.dueDate ? format(new Date(inv.dueDate), "dd/MM/yyyy") : undefined,
        paymentHistory: inv.paymentHistory ? inv.paymentHistory.map((h: any) => ({
          ...h,
          date: h.date ? format(new Date(h.date), "dd/MM/yyyy") : "-",
        })) : []
      }));

      // Sort by date descending
      mappedInvoices.sort((a, b) => {
        const parseDate = (dString: string) => {
          if (!dString || dString === '-') return new Date(0);
          const [d, m, y] = dString.split('/').map(Number);
          return new Date(y, m - 1, d);
        };
        return parseDate(b.date).getTime() - parseDate(a.date).getTime();
      });

      setTransactions(mappedInvoices);
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isCreatingInvoice && !editingInvoice) {
      loadInvoices();
    }
  }, [isCreatingInvoice, editingInvoice, filters]);

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = transactions.reduce((sum, t) => sum + t.balance, 0);
  const totalReceived = totalAmount - totalBalance;

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleEdit = (id: string) => {
    const inv = transactions.find(t => t.id === id);
    if (inv) setEditingInvoice(inv);
  };

  const handleDelete = async (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction?.transactionType === 'Payment In') {
      toast({ title: "Payment records cannot be cancelled here", variant: "destructive" });
      return;
    }
    if (!confirm("Are you sure you want to cancel this invoice?")) return;
    try {
      const { cancelSale } = await import('@/lib/api');
      await cancelSale(id);
      loadInvoices();
    } catch (error: any) {
      console.error("Failed to cancel", error);
      toast({ title: error.message || "Failed to cancel invoice", variant: "destructive" });
    }
  };

  const handleView = (id: string) => {
    const inv = transactions.find(t => t.id === id);
    if (inv) setEditingInvoice(inv);
  };

  const handleReceivePayment = (partyId: string, amount: number, invoiceId?: string) => {
    setPaymentPartyId(partyId);
    setPaymentAmount(amount);
    setPaymentInvoiceId(invoiceId || null);
    setIsPaymentInOpen(true);
  };

  const handleCreateNewPayment = () => {
    setPaymentPartyId(null);
    setPaymentAmount(null);
    setPaymentInvoiceId(null);
    setIsPaymentInOpen(true);
  };

  const handlePrintRow = async (id: string) => {
    // Instead of directly printing, open the invoice preview
    try {
      const inv = transactions.find(t => t.id === id);
      if (inv) {
        setPrintInvoiceData(inv);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isCreatingInvoice || editingInvoice) {
    return <CreateSaleInvoicePage
      key={(editingInvoice as any)?._id || 'new'}
      onCancel={() => { setIsCreatingInvoice(false); setEditingInvoice(null); }}
      initialData={editingInvoice}
    />;
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardContent className="p-0 divide-y">
          <div className="p-4 border-b flex justify-between items-center">
            <FilterBar onFilterChange={handleFilterChange} />
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsCreatingInvoice(true)}
                className="bg-[var(--accent-orange)] hover:bg-[var(--primary-red)] text-white gap-2"
              >
                <Plus size={16} /> Add Sale
              </Button>
              <Button
                onClick={handleCreateNewPayment}
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
              >
                <Plus size={16} /> Payment In
              </Button>
            </div>
          </div>
          <div className="p-4">
            <div className="inline-block  p-4 rounded-lg border bg-[var(--accent-orange)]/5 border-purple-200 w-full max-w-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Total Sales Amount</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">₹ {totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-500">
                    0% <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-gray-500">vs last month</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-200 flex items-center text-sm">
                <span className="text-gray-600">Received: <span className="font-semibold text-gray-800">₹ {totalReceived.toLocaleString('en-IN')}</span></span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-600">Balance: <span className="font-semibold text-gray-800">₹ {totalBalance.toLocaleString('en-IN')}</span></span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TransactionsTable
        transactions={transactions}
        showToolbar={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onPrint={handlePrintRow}
        onReceivePayment={handleReceivePayment}
      />

      <PaymentInModal
        isOpen={isPaymentInOpen}
        onClose={() => { setIsPaymentInOpen(false); setPaymentPartyId(null); setPaymentAmount(null); setPaymentInvoiceId(null); }}
        onSuccess={loadInvoices}
        initialPartyId={paymentPartyId || undefined}
        initialAmount={paymentAmount || undefined}
        initialInvoiceId={paymentInvoiceId || undefined}
      />

      {printInvoiceData && (
        <InvoicePreview
          isOpen={!!printInvoiceData}
          onClose={() => setPrintInvoiceData(null)}
          data={printInvoiceData}
          type="INVOICE"
        />
      )}
    </div>
  );
};

export default SaleInvoices;