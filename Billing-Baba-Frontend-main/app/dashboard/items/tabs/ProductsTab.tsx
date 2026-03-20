import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronDown,
  Filter,
  MoreVertical,
  Bell,
  Plus,
  FileText,
  Edit,
  Trash2,
  Hash
} from 'lucide-react';
import AdjustItem from '../component/AdjustItem';
import AddItemModal from '../component/AddItemModal';
import BulkUpdateItemsPage from '../component/BulkUpdateItemsPage';
import BulkInactiveModal from '../component/BulkInactiveModal';
import BulkActiveModal from '../component/BulkActiveModal';
import BulkAssignCodeModal from '../component/BulkAssignCodeModal';
import { fetchItems, deleteItem, fetchTransactionsByItem, bulkAssignCode } from '@/lib/api';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

const ProductsTab = () => {
  // --- STATE MANAGEMENT ---
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [isAddItemDropdownOpen, setIsAddItemDropdownOpen] = useState(false);
  const [isBulkActionsDropdownOpen, setIsBulkActionsDropdownOpen] = useState(false);
  const [isItemActionsDropdownOpen, setIsItemActionsDropdownOpen] = useState(false);
  const [openRowMenuId, setOpenRowMenuId] = useState<string | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isBulkInactiveOpen, setIsBulkInactiveOpen] = useState(false);
  const [isBulkActiveOpen, setIsBulkActiveOpen] = useState(false);
  const [isBulkAssignCodeOpen, setIsBulkAssignCodeOpen] = useState(false);

  const loadItems = async () => {
    try {
      const data = await fetchItems({ type: 'product' });
      const flattenedData = data.map((item: any) => {
        const details = item.product || item.service || {};
        return {
          ...details, // Flatten details first
          ...item,    // Overlay item wrapper fields (like _id, name, type)
          // Ensure specific fields are accessible at top level if needed
          unit: details.unit || item.unit,
          salePrice: details.salePrice || item.salePrice,
          purchasePrice: details.purchasePrice || item.purchasePrice,
          taxRate: details.taxRate || item.taxRate,
          // Keep references
          product: item.product,
          service: item.service
        };
      });
      setItems(flattenedData);
      if (flattenedData.length > 0 && !selectedItem) {
        setSelectedItem(flattenedData[0]);
      }

      // Low stock warnings
      const lowStockItems = flattenedData.filter((item: any) => {
        const qty = item.product?.currentQuantity ?? 0;
        const min = item.product?.minStockToMaintain ?? item.minStockToMaintain ?? 0;
        return min > 0 && qty <= min;
      });
      if (lowStockItems.length > 0) {
        const names = lowStockItems.slice(0, 3).map((i: any) => i.name).join(', ');
        const extra = lowStockItems.length > 3 ? ` and ${lowStockItems.length - 3} more` : '';
        toast({
          title: `Low Stock Alert`,
          description: `${names}${extra} ${lowStockItems.length === 1 ? 'is' : 'are'} at or below minimum stock level.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error("Failed to load items", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const loadTransactions = async () => {
      if (selectedItem?._id) {
        try {
          const data = await fetchTransactionsByItem(selectedItem._id);
          setTransactions(data);
        } catch (err) {
          console.error("Failed to load transactions", err);
          setTransactions([]);
        }
      }
    };
    loadTransactions();
  }, [selectedItem]);

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        if (selectedItem?._id === id) setSelectedItem(null);
        await loadItems();
        toast({ title: "Item deleted successfully" });
      } catch (error: any) {
        toast({
          title: "Cannot Delete Item",
          description: error.message || "Failed to delete item",
          variant: "destructive",
        });
      }
    }
  };

  const handleAssignCode = async (itemId: string) => {
    try {
      await bulkAssignCode([itemId]);
      toast({ title: 'Item code assigned successfully', className: 'bg-green-500 text-white' });
      await loadItems();
    } catch {
      toast({ title: 'Failed to assign item code', variant: 'destructive' });
    }
  };

  const getStockQty = (item: any) => {
    if (item.type === 'product' && item.product) {
      return item.product.currentQuantity || 0;
    }
    return 0; // Services don't track stock usually
  };

  if (isBulkUpdateOpen) {
    return (
      <div className="min-h-[calc(100vh-150px)] flex flex-col">
        <BulkUpdateItemsPage
          items={items}
          onClose={() => setIsBulkUpdateOpen(false)}
          onSuccess={loadItems}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-150px)]">
        {/* --- LEFT SIDEBAR --- */}
        <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col">

          <div className="p-3 border-b border-gray-200">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-blue)]" />
            </div>
          </div>

          <div className="p-3 border-b border-gray-200 flex items-center gap-2">
            <div className="relative flex-grow">
              <div className="flex w-full rounded-lg shadow-sm bg-[var(--accent-orange)] text-white font-semibold text-sm overflow-hidden">
                <button
                  onClick={() => {
                    setModalMode('add');
                    setIsAddModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 hover:opacity-90 transition-opacity duration-200 text-left"
                >
                  <Plus size={18} strokeWidth={3} />
                  <span>Add Item</span>
                </button>
                <div className="border-l border-white/30">
                  <button className="p-2 h-full hover:bg-black/10 transition-colors duration-200" onClick={() => setIsAddItemDropdownOpen(prev => !prev)}>
                    <ChevronDown size={20} />
                  </button>
                </div>
              </div>
              {isAddItemDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                  <ul className="p-1">
                    <li>
                      <Link href="/import-items" className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                        <FileText size={18} className="text-gray-500" />
                        <span>Import Items</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setIsBulkActionsDropdownOpen(prev => !prev)} className="p-2 border border-gray-300 rounded-md hover:bg-gray-100">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
              {isBulkActionsDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                  <ul className="p-1 text-sm text-gray-700">
                    <li>
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                        onClick={() => { setIsBulkActionsDropdownOpen(false); setIsBulkInactiveOpen(true); }}
                      >
                        Bulk Inactive
                      </button>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                        onClick={() => { setIsBulkActionsDropdownOpen(false); setIsBulkActiveOpen(true); }}
                      >
                        Bulk Active
                      </button>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                        onClick={() => { setIsBulkActionsDropdownOpen(false); setIsBulkAssignCodeOpen(true); }}
                      >
                        Bulk Assign Code
                      </button>
                    </li>
                    <li><button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">Assign Units</button></li>
                    <li>
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                        onClick={() => { setIsBulkActionsDropdownOpen(false); setIsBulkUpdateOpen(true); }}
                      >
                        Bulk Update Items
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto">
            <div className="flex justify-between items-center text-xs text-gray-500 font-bold px-4 py-2 bg-gray-50 border-b">
              <div className="flex items-center">ITEM <Filter size={12} className="ml-1" /></div>
              <div className="flex items-center">QUANTITY <Filter size={12} className="ml-1" /></div>
            </div>
            <ul>
              {items.map(item => (
                <li key={item._id} className={`${selectedItem && selectedItem._id === item._id ? 'bg-blue-50 border-l-4 border-[var(--secondary-blue)]' : 'border-l-4 border-transparent hover:bg-gray-50'}`}>
                  <div
                    className="flex justify-between items-center px-4 py-3 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <span className="text-sm font-medium text-gray-800">{item.name}</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-semibold ${getStockQty(item) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {getStockQty(item)} <span className="text-xs font-normal text-gray-500">{item.unit || ''}</span>
                      </span>
                      <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                          className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                          onClick={() => setOpenRowMenuId(openRowMenuId === item._id ? null : item._id)}
                        >
                          <MoreVertical size={15} />
                        </button>
                        {openRowMenuId === item._id && (
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-xl border border-gray-200 z-30">
                            <ul className="p-1 text-sm text-gray-700">
                              <li>
                                <button
                                  className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setModalMode('edit');
                                    setIsAddModalOpen(true);
                                    setOpenRowMenuId(null);
                                  }}
                                >
                                  <Edit size={14} /> View/Edit
                                </button>
                              </li>
                              {item.type === 'product' && !item.product?.itemCode && (
                                <li>
                                  <button
                                    className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                                    onClick={() => {
                                      setOpenRowMenuId(null);
                                      handleAssignCode(item._id);
                                    }}
                                  >
                                    <Hash size={14} /> Assign Code
                                  </button>
                                </li>
                              )}
                              <li>
                                <button
                                  className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-100 rounded-md text-red-600"
                                  onClick={() => {
                                    setOpenRowMenuId(null);
                                    handleDeleteItem(item._id);
                                  }}
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {items.length === 0 && !loading && (
                <li className="p-4 text-center text-gray-500 text-sm">No items found</li>
              )}
            </ul>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="w-full lg:w-3/4 bg-gray-50 flex flex-col p-4 gap-4">
          {selectedItem ? (
            <>
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <h2 className="text-lg font-semibold text-gray-800 pt-1">{selectedItem.name} <span className="text-sm font-normal text-gray-500">({selectedItem.type.toUpperCase()})</span></h2>
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-start">
                    <button
                      onClick={() => setIsAdjustModalOpen(true)}
                      className="bg-[var(--secondary-blue)] text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity duration-200"
                    >
                      ADJUST ITEM
                    </button>
                    <div className="relative">
                      <button onClick={() => setIsItemActionsDropdownOpen(prev => !prev)} className="p-2 text-gray-500 hover:text-gray-800">
                        <MoreVertical size={20} />
                      </button>
                      {isItemActionsDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                          <ul className="p-1 text-sm text-gray-700">
                            <li><button
                              className="w-full flex items-center gap-3 text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                              onClick={() => {
                                setModalMode('edit');
                                setIsAddModalOpen(true);
                                setIsItemActionsDropdownOpen(false);
                              }}
                            >
                              <Edit size={16} /> View/Edit
                            </button></li>
                            {selectedItem.type === 'product' && !selectedItem.product?.itemCode && (
                              <li><button
                                className="w-full flex items-center gap-3 text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                                onClick={() => {
                                  setIsItemActionsDropdownOpen(false);
                                  handleAssignCode(selectedItem._id);
                                }}
                              >
                                <Hash size={16} /> Assign Code
                              </button></li>
                            )}
                            <li><button
                              className="w-full flex items-center gap-3 text-left px-3 py-2 hover:bg-gray-100 rounded-md text-red-600"
                              onClick={() => handleDeleteItem(selectedItem._id)}
                            >
                              <Trash2 size={16} /> Delete
                            </button></li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:space-x-8 text-sm gap-y-3 mt-4">
                  <div><span className="text-gray-500">SALE PRICE: </span><span className="font-semibold text-gray-800">₹ {selectedItem.salePrice?.amount || 0}</span><span className="text-gray-400 text-xs"> ({selectedItem.salePrice?.taxType || 'excl'})</span></div>
                  <div><span className="text-gray-500">PURCHASE PRICE: </span><span className="font-semibold text-gray-800">₹ {selectedItem.type === 'product' && selectedItem.product ? selectedItem.product.purchasePrice?.amount || 0 : 0}</span></div>
                  <div className={`flex items-center ${getStockQty(selectedItem) < 0 ? 'text-red-600' : 'text-green-600'}`}><Bell size={14} className="mr-1" /><span className="font-semibold">STOCK QUANTITY: {getStockQty(selectedItem)}</span></div>
                  {/* Placeholder for Stock Value calculation */}
                  <div><span className="text-gray-500">STOCK VALUE: </span><span className="font-semibold text-green-600">₹ {(getStockQty(selectedItem) * (selectedItem.type === 'product' && selectedItem.product ? selectedItem.product.purchasePrice?.amount || 0 : 0)).toFixed(2)}</span></div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex-grow flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <h3 className="text-base font-semibold text-gray-700">TRANSACTIONS</h3>
                  <div className="relative w-full sm:w-1/2 lg:w-1/3"><input type="text" placeholder="Search..." className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-blue)]" /><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /></div>
                </div>
                <div className="overflow-x-auto flex-grow">
                  <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                      <tr>
                        <th scope="col" className="p-3">TYPE</th>
                        <th scope="col" className="p-3">INVOICE/REF</th>
                        <th scope="col" className="p-3">NAME</th>
                        <th scope="col" className="p-3">DATE</th>
                        <th scope="col" className="p-3">QUANTITY</th>
                        <th scope="col" className="p-3">PRICE/UNIT</th>
                        <th scope="col" className="p-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length > 0 ? (
                        transactions.map((tx: any, index: number) => (
                          <tr key={index} className="bg-white border-b hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-900">{tx.type}</td>
                            <td className="p-3">{tx.number}</td>
                            <td className="p-3">{tx.partyName}</td>
                            <td className="p-3">{new Date(tx.date).toLocaleDateString()}</td>
                            <td className={`p-3 font-semibold ${tx.category === 'Sale' ? 'text-red-600' : 'text-green-600'}`}>
                              {tx.category === 'Sale' ? '-' : '+'}{tx.quantity}
                            </td>
                            <td className="p-3">₹ {tx.price}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${tx.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                  tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'}`}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-white border-b hover:bg-gray-50"><td className="p-3" colSpan={7}>No transactions yet for this item</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-grow bg-white rounded-lg shadow border border-gray-200">
              <p className="text-gray-500">Select an item to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* --- RENDER THE MODALS --- */}
      <AdjustItem
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        itemId={selectedItem?._id || ''}
        itemName={selectedItem?.name || ''}
        itemUnit={selectedItem?.product?.unit || selectedItem?.unit || 'Pcs'}
        onSuccess={loadItems}
      />

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadItems}
        mode={modalMode}
        initialData={modalMode === 'edit' ? selectedItem : undefined}
      />

      <BulkInactiveModal
        isOpen={isBulkInactiveOpen}
        onClose={() => setIsBulkInactiveOpen(false)}
        onSuccess={loadItems}
      />

      <BulkActiveModal
        isOpen={isBulkActiveOpen}
        onClose={() => setIsBulkActiveOpen(false)}
        onSuccess={loadItems}
      />

      <BulkAssignCodeModal
        isOpen={isBulkAssignCodeOpen}
        onClose={() => setIsBulkAssignCodeOpen(false)}
        onSuccess={loadItems}
      />
    </>
  );
};

export default ProductsTab;