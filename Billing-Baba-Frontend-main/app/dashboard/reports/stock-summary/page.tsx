// app/dashboard/reports/stock-summary/page.tsx
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Printer, FileSpreadsheet, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

// ── Types ─────────────────────────────────────────────────────────────────────

type StockItem = {
  id: string;
  name: string;
  category: string;
  salePrice: number;
  purchasePrice: number;
  stockQty: number;
  stockValue: number;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { 'x-auth-token': token }),
    ...(companyId && { 'x-company-id': companyId }),
  };
};

const fmt = (n: number) =>
  `₹ ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function StockSummaryPage() {
  const [allItems, setAllItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFilterEnabled, setDateFilterEnabled] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [selectedGodown, setSelectedGodown] = useState('all');

  const companyId =
    typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';

  // ── Fetch items ──────────────────────────────────────────────────────────────

  const fetchItems = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/items?companyId=${companyId}&type=product`,
        { headers: getHeaders() }
      );
      if (!res.ok) throw new Error('Failed to fetch items');
      const data: any[] = await res.json();

      const mapped: StockItem[] = data
        .filter((item) => item.product)
        .map((item) => {
          const prod = item.product;
          const salePrice = prod.salePrice?.amount ?? 0;
          const purchasePrice = prod.purchasePrice?.amount ?? 0;
          const stockQty = prod.currentQuantity ?? 0;
          return {
            id: item._id,
            name: item.name,
            category: prod.category || '',
            salePrice,
            purchasePrice,
            stockQty,
            stockValue: stockQty * purchasePrice,
          };
        });

      setAllItems(mapped);
    } catch (err) {
      console.error('Stock summary fetch error:', err);
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ── Unique categories ────────────────────────────────────────────────────────

  const uniqueCategories = useMemo(
    () => ['all', ...Array.from(new Set(allItems.map((i) => i.category).filter(Boolean)))],
    [allItems]
  );

  // ── Filtered data ────────────────────────────────────────────────────────────

  const filteredData = useMemo(() => {
    let data = allItems;
    if (selectedCategory !== 'all') {
      data = data.filter((item) => item.category === selectedCategory);
    }
    if (showInStockOnly) {
      data = data.filter((item) => item.stockQty > 0);
    }
    return data;
  }, [allItems, selectedCategory, showInStockOnly]);

  // ── Totals ───────────────────────────────────────────────────────────────────

  const totals = useMemo(
    () =>
      filteredData.reduce(
        (acc, item) => ({
          stockQty: acc.stockQty + item.stockQty,
          stockValue: acc.stockValue + item.stockValue,
        }),
        { stockQty: 0, stockValue: 0 }
      ),
    [filteredData]
  );

  // ── Export Excel ──────────────────────────────────────────────────────────────

  const handleExportExcel = async () => {
    const xlsx: any = await import('xlsx');
    const rows = filteredData.map((item) => ({
      'Item Name': item.name,
      'Sale Price': item.salePrice,
      'Purchase Price': item.purchasePrice,
      'Stock Qty': item.stockQty,
      'Stock Value': item.stockValue,
    }));
    rows.push({
      'Item Name': 'Total',
      'Sale Price': 0,
      'Purchase Price': 0,
      'Stock Qty': totals.stockQty,
      'Stock Value': totals.stockValue,
    });
    const ws = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'StockSummary');
    xlsx.writeFile(
      wb,
      `StockSummary${dateFilterEnabled && selectedDate ? '_' + format(selectedDate, 'dd-MM-yyyy') : ''}.xlsx`
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Filters bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b bg-white">
        <div className="flex flex-wrap items-center gap-3">
          {/* FILTERS label */}
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            FILTERS
          </span>

          {/* Category */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-44 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {uniqueCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date filter toggle */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="date-filter"
              checked={dateFilterEnabled}
              onCheckedChange={(v) => setDateFilterEnabled(Boolean(v))}
            />
            <Label htmlFor="date-filter" className="text-sm cursor-pointer text-gray-600">
              Date filter
            </Label>
          </div>

          {/* Date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={!dateFilterEnabled}
                className="h-9 px-3 text-sm font-normal gap-2"
              >
                <span className="text-xs text-gray-400 font-medium">Date</span>
                {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Pick a date'}
                <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
            </PopoverContent>
          </Popover>

          {/* Show items in stock */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="in-stock"
              checked={showInStockOnly}
              onCheckedChange={(v) => setShowInStockOnly(Boolean(v))}
            />
            <Label htmlFor="in-stock" className="text-sm cursor-pointer text-gray-600">
              Show items in stock
            </Label>
          </div>

          {/* Godown */}
          <Select value={selectedGodown} onValueChange={setSelectedGodown}>
            <SelectTrigger className="w-36 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Godown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9 px-4 text-sm font-medium text-blue-600 border-blue-200 hover:bg-blue-50 gap-2"
            title="Share With Accountant"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            Share With Accountant
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handleExportExcel}
            title="Export Excel"
          >
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => window.print()}
            title="Print"
          >
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto px-4 py-4">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
          STOCK SUMMARY
        </h2>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-12 py-2 text-left text-xs font-medium text-gray-500" />
              <th className="py-2 text-left text-xs font-medium text-gray-500 pr-4">Item Name</th>
              <th className="py-2 text-right text-xs font-medium text-gray-500 pr-4">Sale Price</th>
              <th className="py-2 text-right text-xs font-medium text-gray-500 pr-4">Purchase Price</th>
              <th className="py-2 text-right text-xs font-medium text-gray-500 pr-4">Stock Qty</th>
              <th className="py-2 text-right text-xs font-medium text-gray-500">Stock Value</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-gray-400 text-sm">
                  No stock items to display.
                </td>
              </tr>
            ) : (
              filteredData.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 text-left text-gray-400 text-xs">{idx + 1}</td>
                  <td className="py-3 pr-4 text-gray-800 font-medium">{item.name}</td>
                  <td className="py-3 pr-4 text-right text-gray-600">{fmt(item.salePrice)}</td>
                  <td className="py-3 pr-4 text-right text-gray-600">{fmt(item.purchasePrice)}</td>
                  <td
                    className={`py-3 pr-4 text-right font-medium ${
                      item.stockQty < 0
                        ? 'text-red-500'
                        : item.stockQty > 0
                        ? 'text-teal-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {item.stockQty}
                  </td>
                  <td className="py-3 text-right text-gray-700">{fmt(item.stockValue)}</td>
                </tr>
              ))
            )}
          </tbody>
          {!loading && filteredData.length > 0 && (
            <tfoot>
              <tr className="border-t border-gray-200">
                <td />
                <td className="py-3 font-bold text-gray-800">Total</td>
                <td />
                <td />
                <td
                  className={`py-3 pr-4 text-right font-bold ${
                    totals.stockQty < 0 ? 'text-red-500' : 'text-teal-600'
                  }`}
                >
                  {totals.stockQty}
                </td>
                <td className="py-3 text-right font-bold text-gray-800">
                  {fmt(totals.stockValue)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
