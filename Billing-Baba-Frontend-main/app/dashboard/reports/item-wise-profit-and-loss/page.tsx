// app/dashboard/reports/item-wise-profit-and-loss/page.tsx
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

type ItemRow = {
  itemName: string;
  sale: number;
  crNote: number;
  purchase: number;
  drNote: number;
  openingStock: number;
  closingStock: number;
  taxReceivable: number;
  taxPayable: number;
  mfgCost: number;
  consumptionCost: number;
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

// ── Helpers ───────────────────────────────────────────────────────────────────

const n2 = (n: number) =>
  n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtNet = (n: number) =>
  n < 0 ? `- ₹ ${n2(Math.abs(n))}` : `₹ ${n2(n)}`;

// Net P/L = Sale - CrNote - (Opening + Purchase - Closing - DrNote) - TaxPayable + TaxReceivable - MfgCost - ConsumptionCost
const getNetProfit = (r: ItemRow) =>
  r.sale - r.crNote -
  (r.openingStock + r.purchase - r.closingStock - r.drNote) -
  r.taxPayable + r.taxReceivable -
  r.mfgCost - r.consumptionCost;

function mergeItems(
  docs: any[],
  map: Map<string, ItemRow>,
  amtField: 'sale' | 'crNote' | 'purchase' | 'drNote',
  taxField: 'taxPayable' | 'taxReceivable' | null,
  taxSign: 1 | -1 = 1,
) {
  for (const doc of docs) {
    if (doc.status === 'Cancelled') continue;
    for (const item of (doc.items || [])) {
      const name: string = (item.name || 'Unknown').trim();
      if (!map.has(name)) {
        map.set(name, {
          itemName: name, sale: 0, crNote: 0, purchase: 0, drNote: 0,
          openingStock: 0, closingStock: 0, taxReceivable: 0, taxPayable: 0,
          mfgCost: 0, consumptionCost: 0,
        });
      }
      const row = map.get(name)!;
      row[amtField] += item.amount ?? 0;
      if (taxField) row[taxField] += (item.tax?.amount ?? 0) * taxSign;
    }
  }
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ItemWiseProfitAndLossPage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [itemsHavingSaleOnly, setItemsHavingSaleOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rawSales, setRawSales] = useState<any[]>([]);
  const [rawCrNotes, setRawCrNotes] = useState<any[]>([]);
  const [rawPurchases, setRawPurchases] = useState<any[]>([]);
  const [rawDrNotes, setRawDrNotes] = useState<any[]>([]);
  const [productMap, setProductMap] = useState<Map<string, { opening: number; closing: number }>>(new Map());

  const companyId =
    typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';

  // ── Fetch ────────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    if (!fromDate || !toDate || !companyId) return;
    setLoading(true);
    try {
      const start = new Date(fromDate); start.setHours(0, 0, 0, 0);
      const end = new Date(toDate); end.setHours(23, 59, 59, 999);
      const dateQs = `startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
      const cid = `companyId=${companyId}`;

      const [salesRes, crRes, purchRes, drRes, itemsRes] = await Promise.all([
        fetch(`${API_BASE}/sales?type=INVOICE&${cid}&${dateQs}`, { headers: getHeaders() }),
        fetch(`${API_BASE}/sales?type=CREDIT_NOTE&${cid}&${dateQs}`, { headers: getHeaders() }),
        fetch(`${API_BASE}/purchases?type=BILL&${cid}&${dateQs}`, { headers: getHeaders() }),
        fetch(`${API_BASE}/purchases?type=DEBIT_NOTE&${cid}&${dateQs}`, { headers: getHeaders() }),
        fetch(`${API_BASE}/items?type=product&${cid}`, { headers: getHeaders() }),
      ]);

      const toArr = async (res: Response) => {
        if (!res.ok) return [];
        const d = await res.json();
        return Array.isArray(d) ? d : d.data ?? [];
      };

      const [sales, crNotes, purchases, drNotes, items] = await Promise.all([
        toArr(salesRes), toArr(crRes), toArr(purchRes), toArr(drRes), toArr(itemsRes),
      ]);

      setRawSales(sales);
      setRawCrNotes(crNotes);
      setRawPurchases(purchases);
      setRawDrNotes(drNotes);

      // Build product stock map: itemName → { opening value, closing value }
      const pMap = new Map<string, { opening: number; closing: number }>();
      for (const item of items) {
        if (!item.product) continue;
        const prod = item.product;
        pMap.set((item.name || '').trim(), {
          opening: (prod.openingQuantity ?? 0) * (prod.atPrice ?? 0),
          closing: (prod.currentQuantity ?? 0) * (prod.purchasePrice?.amount ?? 0),
        });
      }
      setProductMap(pMap);
    } catch (err) {
      console.error('Item P/L fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, companyId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Build rows ────────────────────────────────────────────────────────────────

  const rows: ItemRow[] = useMemo(() => {
    const map = new Map<string, ItemRow>();
    mergeItems(rawSales, map, 'sale', 'taxPayable', 1);
    mergeItems(rawCrNotes, map, 'crNote', null, 1);
    mergeItems(rawPurchases, map, 'purchase', 'taxReceivable', 1);
    mergeItems(rawDrNotes, map, 'drNote', 'taxReceivable', -1);

    for (const row of map.values()) {
      const stock = productMap.get(row.itemName);
      if (stock) {
        row.openingStock = stock.opening;
        row.closingStock = stock.closing;
      }
    }

    let result = Array.from(map.values()).sort((a, b) => a.itemName.localeCompare(b.itemName));
    if (itemsHavingSaleOnly) result = result.filter(r => r.sale > 0);
    return result;
  }, [rawSales, rawCrNotes, rawPurchases, rawDrNotes, productMap, itemsHavingSaleOnly]);

  const totalAmount = useMemo(() => rows.reduce((s, r) => s + getNetProfit(r), 0), [rows]);

  // ── Export ────────────────────────────────────────────────────────────────────

  const handleExportExcel = async () => {
    const xlsx: any = await import('xlsx');
    const data = rows.map(r => ({
      'Item Name': r.itemName,
      'Sale': r.sale,
      'Cr. Note / Sale Return': r.crNote,
      'Purchase': r.purchase,
      'Dr. Note / Purchase Return': r.drNote,
      'Opening Stock': r.openingStock,
      'Closing Stock': r.closingStock,
      'Tax Receivable': r.taxReceivable,
      'Tax Payable': r.taxPayable,
      'Mfg. Cost': r.mfgCost,
      'Consumption Cost': r.consumptionCost,
      'Net Profit/Loss': getNetProfit(r),
    }));
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'ItemWiseProfitLoss');
    xlsx.writeFile(wb, `ItemWisePL_${format(fromDate!, 'MMM-yyyy')}.xlsx`);
  };

  // ── Render helpers ────────────────────────────────────────────────────────────

  const NumCell = ({ v }: { v: number }) => (
    <td className={`px-3 py-2.5 text-right text-xs ${v === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
      {v === 0 ? '0' : n2(v)}
    </td>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Top bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b">
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-36 h-9 text-sm font-semibold text-teal-600 border-teal-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL FIRMS</SelectItem>
            </SelectContent>
          </Select>

          {/* Date range */}
          <div className="flex items-center border rounded-md bg-white h-9 px-2 gap-1">
            <span className="text-xs text-gray-500 font-medium">From</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-auto px-2 py-0.5 text-sm font-normal gap-1">
                  {fromDate ? format(fromDate, 'dd/MM/yyyy') : 'Start'}
                  <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={fromDate} onSelect={setFromDate} />
              </PopoverContent>
            </Popover>
            <span className="text-xs text-gray-500 font-medium">To</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-auto px-2 py-0.5 text-sm font-normal gap-1">
                  {toDate ? format(toDate, 'dd/MM/yyyy') : 'End'}
                  <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={toDate} onSelect={setToDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="items-having-sale"
              checked={itemsHavingSaleOnly}
              onCheckedChange={v => setItemsHavingSaleOnly(Boolean(v))}
            />
            <Label htmlFor="items-having-sale" className="text-sm cursor-pointer text-gray-600">
              Items Having Sale
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleExportExcel} title="Export Excel">
            <FileSpreadsheet className="h-4 w-4 text-teal-600" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => window.print()} title="Print">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 py-3">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">DETAILS</h2>
        </div>

        <div className="flex-1 overflow-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <table className="w-full text-xs border-collapse" style={{ minWidth: '1120px' }}>
              <thead>
                <tr className="border-b border-t border-gray-200 bg-gray-50 text-gray-600">
                  <th className="px-3 py-2.5 text-left font-semibold w-[150px] align-bottom">Item Name</th>
                  <th className="px-3 py-2.5 text-right font-semibold align-bottom">Sale</th>
                  <th className="px-3 py-2.5 text-right font-semibold align-bottom leading-tight">Cr. Note /<br />Sale Return</th>
                  <th className="px-3 py-2.5 text-right font-semibold align-bottom">Purchase</th>
                  <th className="px-3 py-2.5 text-right font-semibold align-bottom leading-tight">Dr. Note /<br />Purchase<br />Return</th>
                  <th className="px-3 py-2.5 text-right font-semibold align-bottom leading-tight">Opening<br />Stock</th>
                  <th className="px-3 py-2.5 text-right font-semibold align-bottom leading-tight">Closing<br />Stock</th>
                  <th className="px-3 py-2.5 text-right font-semibold align-bottom leading-tight">Tax<br />Receivable</th>
                  <th className="px-3 py-2.5 text-right font-semibold align-bottom leading-tight">Tax Payable</th>
                  <th className="px-3 py-2.5 text-right font-semibold align-bottom leading-tight">Mfg. Cost</th>
                  <th className="px-3 py-2.5 text-right font-semibold align-bottom leading-tight">Consumption<br />Cost</th>
                  <th className="px-3 py-2.5 text-right font-semibold align-bottom leading-tight">Net Profit/Loss</th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-16 text-center text-gray-400">
                      No data for the selected period.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => {
                    const net = getNetProfit(row);
                    return (
                      <tr
                        key={row.itemName}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 1 ? 'bg-gray-50/40' : ''}`}
                      >
                        <td className="px-3 py-2.5 text-gray-800 font-medium break-words max-w-[150px]">
                          {row.itemName}
                        </td>
                        <NumCell v={row.sale} />
                        <NumCell v={row.crNote} />
                        <NumCell v={row.purchase} />
                        <NumCell v={row.drNote} />
                        <NumCell v={row.openingStock} />
                        <NumCell v={row.closingStock} />
                        <td className={`px-3 py-2.5 text-right ${row.taxReceivable < 0 ? 'text-red-500' : row.taxReceivable === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                          {row.taxReceivable === 0 ? '0' : n2(row.taxReceivable)}
                        </td>
                        <NumCell v={row.taxPayable} />
                        <NumCell v={row.mfgCost} />
                        <NumCell v={row.consumptionCost} />
                        <td className={`px-3 py-2.5 text-right font-medium ${net < 0 ? 'text-red-500' : 'text-teal-600'}`}>
                          {fmtNet(net)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Footer ── */}
        {!loading && rows.length > 0 && (
          <div className="px-4 py-3 border-t bg-white text-right text-sm font-semibold text-gray-700">
            Total Amount:{' '}
            <span className={totalAmount < 0 ? 'text-red-500' : 'text-teal-600'}>
              ₹ {n2(totalAmount)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
