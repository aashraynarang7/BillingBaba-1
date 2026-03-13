"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ChevronDown, Youtube } from 'lucide-react';
import { updateItem, fetchCategories } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

type TabType = 'Pricing' | 'Stock' | 'Item Information';

const TAX_DISPLAY = ['Excluded', 'Included'];
const TAX_RATES_DISPLAY = ['None', 'GST@0%', 'IGST@0%', 'GST@0.25%', 'IGST@0.25%', 'GST@3%', 'IGST@3%', 'GST@5%', 'IGST@5%', 'GST@12%', 'IGST@12%', 'GST@18%', 'IGST@18%', 'GST@28%', 'IGST@28%', 'Exempt'];

// Helpers to map between display values and backend values
const toBackendTax = (v: string) => v === 'Included' ? 'withTax' : 'withoutTax';
const toDisplayTax = (v: string) => v === 'withTax' ? 'Included' : 'Excluded';

const parseTaxRateNum = (display: string): number => {
  if (!display || display === 'None' || display === 'Exempt') return 0;
  const m = display.match(/(\d+(\.\d+)?)%/);
  return m ? parseFloat(m[1]) : 0;
};

const taxRateFromNum = (num: number): string => {
  if (!num || num === 0) return 'None';
  const found = TAX_RATES_DISPLAY.find(r => r.includes(`${num}%`));
  return found || 'None';
};

interface BulkUpdateItemsPageProps {
  items: any[];
  onClose: () => void;
  onSuccess: () => void;
}

const BulkUpdateItemsPage = ({ items, onClose, onSuccess }: BulkUpdateItemsPageProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('Pricing');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  // Build drafts from flattened items (ProductsTab already flattens product fields to top level)
  useEffect(() => {
    const initial: Record<string, any> = {};
    items.forEach(item => {
      initial[item._id] = {
        name: item.name || '',
        // Category stored as name string in backend payload
        categoryName: item.category || '',
        hsn: item.hsn || '',
        itemCode: item.itemCode || '',
        description: item.description || '',
        purchasePriceAmount: item.purchasePrice?.amount ?? '',
        purchaseTaxDisplay: toDisplayTax(item.purchasePrice?.taxType || 'withoutTax'),
        salePriceAmount: item.salePrice?.amount ?? '',
        saleTaxDisplay: toDisplayTax(item.salePrice?.taxType || 'withoutTax'),
        taxRateDisplay: taxRateFromNum(item.taxRate || 0),
        openingQuantity: item.openingQuantity ?? '',
        atPrice: item.atPrice ?? '',
        minStockToMaintain: item.minStockToMaintain ?? '',
        location: item.location || '',
        // Keep for payload
        unit: item.unit || 'PCS',
        type: item.type || 'product',
      };
    });
    setDrafts(initial);
  }, [items]);

  const updateDraft = (id: string, field: string, value: any) => {
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  // Count changes compared to original
  const changedCounts = useMemo(() => {
    let pricing = 0, stock = 0, info = 0;
    items.forEach(item => {
      const d = drafts[item._id];
      if (!d) return;
      if (
        d.name !== (item.name || '') ||
        d.purchasePriceAmount !== (item.purchasePrice?.amount ?? '') ||
        d.purchaseTaxDisplay !== toDisplayTax(item.purchasePrice?.taxType || 'withoutTax') ||
        d.salePriceAmount !== (item.salePrice?.amount ?? '') ||
        d.saleTaxDisplay !== toDisplayTax(item.salePrice?.taxType || 'withoutTax') ||
        d.taxRateDisplay !== taxRateFromNum(item.taxRate || 0) ||
        d.hsn !== (item.hsn || '') ||
        d.categoryName !== (item.category || '')
      ) pricing++;
      if (
        String(d.openingQuantity) !== String(item.openingQuantity ?? '') ||
        String(d.atPrice) !== String(item.atPrice ?? '') ||
        String(d.minStockToMaintain) !== String(item.minStockToMaintain ?? '') ||
        d.location !== (item.location || '')
      ) stock++;
      if (
        d.itemCode !== (item.itemCode || '') ||
        d.description !== (item.description || '')
      ) info++;
    });
    return { pricing, stock, info };
  }, [drafts, items]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(item => {
      const d = drafts[item._id];
      return (
        (item.name || '').toLowerCase().includes(q) ||
        (d?.hsn || '').toLowerCase().includes(q)
      );
    });
  }, [items, drafts, search]);

  const allSelected = filteredItems.length > 0 && filteredItems.every(i => selectedIds.has(i._id));
  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(prev => { const n = new Set(prev); filteredItems.forEach(i => n.delete(i._id)); return n; });
    } else {
      setSelectedIds(prev => { const n = new Set(prev); filteredItems.forEach(i => n.add(i._id)); return n; });
    }
  };
  const toggleOne = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const handleUpdate = async () => {
    setSaving(true);
    let success = 0, failed = 0;
    // If some rows are selected, only update those; otherwise update all
    const toUpdate = selectedIds.size > 0
      ? items.filter(i => selectedIds.has(i._id))
      : items;

    for (const item of toUpdate) {
      const d = drafts[item._id];
      if (!d) continue;
      try {
        const payload: any = {
          name: d.name,
          type: d.type,
          hsn: d.hsn,
          unit: d.unit,
          category: d.categoryName,
          itemCode: d.itemCode,
          description: d.description,
          salePrice: {
            amount: Number(d.salePriceAmount) || 0,
            taxType: toBackendTax(d.saleTaxDisplay),
          },
          purchasePrice: {
            amount: Number(d.purchasePriceAmount) || 0,
            taxType: toBackendTax(d.purchaseTaxDisplay),
          },
          taxRate: parseTaxRateNum(d.taxRateDisplay),
          openingQuantity: d.openingQuantity !== '' ? Number(d.openingQuantity) : 0,
          // Add opening qty to current stock qty so actual stock increases
          currentQuantity: (item.product?.currentQuantity || 0) + (d.openingQuantity !== '' ? Number(d.openingQuantity) : 0),
          atPrice: d.atPrice !== '' ? Number(d.atPrice) : 0,
          minStockToMaintain: d.minStockToMaintain !== '' ? Number(d.minStockToMaintain) : 0,
          location: d.location,
        };
        await updateItem(item._id, payload);
        success++;
      } catch {
        failed++;
      }
    }
    setSaving(false);
    if (failed === 0) {
      toast({ title: `${success} item(s) updated successfully` });
      onSuccess();
      onClose();
    } else {
      toast({ title: `${success} updated, ${failed} failed`, variant: 'destructive' });
      onSuccess();
    }
  };

  const inputCls = "w-full px-2 py-1 text-sm border border-transparent rounded hover:border-gray-300 focus:border-blue-400 focus:outline-none bg-transparent focus:bg-white";
  const selectCls = "w-full px-2 py-1 text-sm border border-transparent rounded hover:border-gray-300 focus:border-blue-400 focus:outline-none bg-transparent focus:bg-white cursor-pointer";

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-white">
        <h1 className="text-lg font-bold text-gray-800">Bulk Update Items</h1>
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by item name / HSN Code"
              className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400 w-64"
            />
          </div>
          {/* Tab radios */}
          {(['Pricing', 'Stock', 'Item Information'] as TabType[]).map(tab => (
            <label key={tab} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer ${activeTab === tab ? 'border-blue-600' : 'border-gray-400'}`}
                onClick={() => setActiveTab(tab)}
              >
                {activeTab === tab && <div className="w-2 h-2 rounded-full bg-blue-600" />}
              </div>
              <span onClick={() => setActiveTab(tab)}>{tab}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Update Tax Slab bar (Pricing only) + selected count */}
      {activeTab === 'Pricing' && (
        <div className="px-6 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
          <span className="text-sm text-gray-500">{selectedIds.size} items selected</span>
          <button className="flex items-center gap-1.5 text-sm bg-white border border-gray-300 rounded px-3 py-1.5 text-gray-700 hover:bg-gray-50">
            Update Tax Slab <ChevronDown size={13} />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="sticky top-0 bg-white border-b-2 border-gray-200 z-10 shadow-sm">
            <tr className="text-xs text-gray-500 uppercase font-semibold">
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-blue-600 cursor-pointer" />
              </th>
              <th className="px-2 py-3 w-10">#</th>
              {activeTab === 'Pricing' && <>
                <th className="px-2 py-3 min-w-[200px]">Item Name* <Filter size={10} className="inline ml-1 text-gray-400" /></th>
                <th className="px-2 py-3 min-w-[130px]">Category <Filter size={10} className="inline ml-1 text-gray-400" /></th>
                <th className="px-2 py-3 min-w-[110px]">Item HSN</th>
                <th className="px-2 py-3 min-w-[130px]">Purchase Price <Filter size={10} className="inline ml-1 text-gray-400" /></th>
                <th className="px-2 py-3 min-w-[110px]">Tax Type</th>
                <th className="px-2 py-3 min-w-[110px]">Sale Price</th>
                <th className="px-2 py-3 min-w-[110px]">Tax Type</th>
                <th className="px-2 py-3 min-w-[120px]">Tax Rate <Filter size={10} className="inline ml-1 text-gray-400" /></th>
              </>}
              {activeTab === 'Stock' && <>
                <th className="px-2 py-3 min-w-[220px]">Item Name* <Filter size={10} className="inline ml-1 text-gray-400" /></th>
                <th className="px-2 py-3 min-w-[140px]">Opening Quantity <Filter size={10} className="inline ml-1 text-gray-400" /></th>
                <th className="px-2 py-3 min-w-[110px]">At Price</th>
                <th className="px-2 py-3 min-w-[130px]">As of Date <Filter size={10} className="inline ml-1 text-gray-400" /></th>
                <th className="px-2 py-3 min-w-[160px]">Min. Stock to Maint. <Filter size={10} className="inline ml-1 text-gray-400" /></th>
                <th className="px-2 py-3 min-w-[200px]">Location <Filter size={10} className="inline ml-1 text-gray-400" /></th>
              </>}
              {activeTab === 'Item Information' && <>
                <th className="px-2 py-3 min-w-[220px]">Item Name* <Filter size={10} className="inline ml-1 text-gray-400" /></th>
                <th className="px-2 py-3 min-w-[150px]">Category <Filter size={10} className="inline ml-1 text-gray-400" /></th>
                <th className="px-2 py-3 min-w-[110px]">Item HSN</th>
                <th className="px-2 py-3 min-w-[130px]">Item Code</th>
                <th className="px-2 py-3">Description <Filter size={10} className="inline ml-1 text-gray-400" /></th>
              </>}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, idx) => {
              const d = drafts[item._id];
              if (!d) return null;
              const isSelected = selectedIds.has(item._id);
              const rowCls = `border-b border-gray-100 ${isSelected ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}`;
              return (
                <tr key={item._id} className={rowCls}>
                  <td className="px-4 py-1.5">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleOne(item._id)} className="accent-blue-600 cursor-pointer" />
                  </td>
                  <td className="px-2 py-1.5 text-gray-500 font-medium text-xs">{idx + 1}</td>

                  {activeTab === 'Pricing' && <>
                    <td className="px-1 py-1">
                      <input className={inputCls} value={d.name} onChange={e => updateDraft(item._id, 'name', e.target.value)} />
                    </td>
                    <td className="px-1 py-1">
                      <div className="flex items-center border border-transparent hover:border-gray-300 rounded focus-within:border-blue-400 bg-transparent focus-within:bg-white">
                        <select className="w-full px-2 py-1 text-sm outline-none bg-transparent cursor-pointer" value={d.categoryName}
                          onChange={e => updateDraft(item._id, 'categoryName', e.target.value)}>
                          <option value="">---</option>
                          {categories.map((c: any) => <option key={c._id} value={c.name}>{c.name}</option>)}
                        </select>
                        <ChevronDown size={12} className="text-gray-400 mr-1 flex-shrink-0" />
                      </div>
                    </td>
                    <td className="px-1 py-1">
                      <input className={inputCls} value={d.hsn} onChange={e => updateDraft(item._id, 'hsn', e.target.value)} />
                    </td>
                    <td className="px-1 py-1">
                      <div className="flex items-center gap-0.5">
                        <span className="text-gray-400 text-xs pl-1">₹</span>
                        <input type="number" className={inputCls} value={d.purchasePriceAmount}
                          onChange={e => updateDraft(item._id, 'purchasePriceAmount', e.target.value)} placeholder="---" />
                      </div>
                    </td>
                    <td className="px-1 py-1">
                      <div className="flex items-center border border-transparent hover:border-gray-300 rounded focus-within:border-blue-400 bg-transparent focus-within:bg-white">
                        <select className="w-full px-2 py-1 text-sm outline-none bg-transparent cursor-pointer" value={d.purchaseTaxDisplay}
                          onChange={e => updateDraft(item._id, 'purchaseTaxDisplay', e.target.value)}>
                          {TAX_DISPLAY.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={12} className="text-gray-400 mr-1 flex-shrink-0" />
                      </div>
                    </td>
                    <td className="px-1 py-1">
                      <div className="flex items-center gap-0.5">
                        <span className="text-gray-400 text-xs pl-1">₹</span>
                        <input type="number" className={inputCls} value={d.salePriceAmount}
                          onChange={e => updateDraft(item._id, 'salePriceAmount', e.target.value)} placeholder="---" />
                      </div>
                    </td>
                    <td className="px-1 py-1">
                      <div className="flex items-center border border-transparent hover:border-gray-300 rounded focus-within:border-blue-400 bg-transparent focus-within:bg-white">
                        <select className="w-full px-2 py-1 text-sm outline-none bg-transparent cursor-pointer" value={d.saleTaxDisplay}
                          onChange={e => updateDraft(item._id, 'saleTaxDisplay', e.target.value)}>
                          {TAX_DISPLAY.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={12} className="text-gray-400 mr-1 flex-shrink-0" />
                      </div>
                    </td>
                    <td className="px-1 py-1">
                      <div className="flex items-center border border-transparent hover:border-gray-300 rounded focus-within:border-blue-400 bg-transparent focus-within:bg-white">
                        <select className="w-full px-2 py-1 text-sm outline-none bg-transparent cursor-pointer" value={d.taxRateDisplay}
                          onChange={e => updateDraft(item._id, 'taxRateDisplay', e.target.value)}>
                          {TAX_RATES_DISPLAY.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={12} className="text-gray-400 mr-1 flex-shrink-0" />
                      </div>
                    </td>
                  </>}

                  {activeTab === 'Stock' && <>
                    <td className="px-1 py-1">
                      <input className={`${inputCls} ${isSelected ? 'border-gray-300 bg-white' : ''}`} value={d.name}
                        onChange={e => updateDraft(item._id, 'name', e.target.value)} />
                    </td>
                    <td className="px-1 py-1">
                      <input type="number" className={inputCls} value={d.openingQuantity}
                        onChange={e => updateDraft(item._id, 'openingQuantity', e.target.value)} placeholder="---" />
                    </td>
                    <td className="px-1 py-1">
                      <div className="flex items-center gap-0.5">
                        <span className="text-gray-400 text-xs pl-1">₹</span>
                        <input type="number" className={inputCls} value={d.atPrice}
                          onChange={e => updateDraft(item._id, 'atPrice', e.target.value)} placeholder="---" />
                      </div>
                    </td>
                    <td className="px-1 py-1">
                      <input className={inputCls} value={d.asOfDate || new Date().toLocaleDateString('en-GB')}
                        onChange={e => updateDraft(item._id, 'asOfDate', e.target.value)} />
                    </td>
                    <td className="px-1 py-1">
                      <input type="number" className={inputCls} value={d.minStockToMaintain}
                        onChange={e => updateDraft(item._id, 'minStockToMaintain', e.target.value)} placeholder="---" />
                    </td>
                    <td className="px-1 py-1">
                      <input className={inputCls} value={d.location}
                        onChange={e => updateDraft(item._id, 'location', e.target.value)} placeholder="---" />
                    </td>
                  </>}

                  {activeTab === 'Item Information' && <>
                    <td className="px-1 py-1">
                      <input className={`${inputCls} ${isSelected ? 'border-gray-300 bg-white' : ''}`} value={d.name}
                        onChange={e => updateDraft(item._id, 'name', e.target.value)} />
                    </td>
                    <td className="px-1 py-1">
                      <div className="flex items-center border border-transparent hover:border-gray-300 rounded focus-within:border-blue-400 bg-transparent focus-within:bg-white">
                        <select className="w-full px-2 py-1 text-sm outline-none bg-transparent cursor-pointer" value={d.categoryName}
                          onChange={e => updateDraft(item._id, 'categoryName', e.target.value)}>
                          <option value="">---</option>
                          {categories.map((c: any) => <option key={c._id} value={c.name}>{c.name}</option>)}
                        </select>
                        <ChevronDown size={12} className="text-gray-400 mr-1 flex-shrink-0" />
                      </div>
                    </td>
                    <td className="px-1 py-1">
                      <input className={inputCls} value={d.hsn} onChange={e => updateDraft(item._id, 'hsn', e.target.value)} />
                    </td>
                    <td className="px-1 py-1">
                      <input className={inputCls} value={d.itemCode} onChange={e => updateDraft(item._id, 'itemCode', e.target.value)} placeholder="---" />
                    </td>
                    <td className="px-1 py-1">
                      <input className={inputCls} value={d.description} onChange={e => updateDraft(item._id, 'description', e.target.value)} placeholder="---" />
                    </td>
                  </>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-6">
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600">
            <div className="bg-red-600 text-white rounded p-0.5"><Youtube size={14} /></div>
            Watch Youtube tutorial to learn more
          </a>
          <span className="text-sm text-gray-600">
            <span className="font-semibold">Pricing</span> - {changedCounts.pricing} Updates,{' '}
            <span className="font-semibold">Stock</span> - {changedCounts.stock} Updates,{' '}
            <span className="font-semibold">Item Information</span> - {changedCounts.info} Updates
          </span>
        </div>
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="bg-gray-400 hover:bg-gray-500 disabled:opacity-60 text-white font-semibold px-8 py-2 rounded text-sm transition-colors"
        >
          {saving ? 'Updating...' : 'Update'}
        </button>
      </div>
    </div>
  );
};

export default BulkUpdateItemsPage;
