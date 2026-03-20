"use client";

import { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  MoreVertical,
  Plus,
  FileText,
  Edit,
  Trash2,
} from 'lucide-react';
import AddItemModal from '../component/AddItemModal';
import { fetchItems, deleteItem, fetchTransactionsByItem } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

const ServicesTab = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddItemDropdownOpen, setIsAddItemDropdownOpen] = useState(false);
  const [openRowMenuId, setOpenRowMenuId] = useState<string | null>(null);
  const [isItemActionsDropdownOpen, setIsItemActionsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const loadItems = async () => {
    try {
      const data = await fetchItems({ type: 'service' });
      const flattenedData = data.map((item: any) => {
        const details = item.service || {};
        return {
          ...details,
          ...item,
          unit: details.unit || item.unit,
          salePrice: details.salePrice || item.salePrice,
          taxRate: details.taxRate || item.taxRate,
          service: item.service,
        };
      });
      setItems(flattenedData);
      if (flattenedData.length > 0 && !selectedItem) {
        setSelectedItem(flattenedData[0]);
      }
    } catch (error) {
      console.error('Failed to load services', error);
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
        } catch {
          setTransactions([]);
        }
      }
    };
    loadTransactions();
  }, [selectedItem]);

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteItem(id);
        if (selectedItem?._id === id) setSelectedItem(null);
        await loadItems();
        toast({ title: 'Service deleted successfully' });
      } catch (error: any) {
        toast({
          title: 'Cannot Delete Service',
          description: error.message || 'Failed to delete service',
          variant: 'destructive',
        });
      }
    }
  };

  // Empty state
  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] bg-gray-50 p-6 text-center">
        <div className="max-w-sm">
          <img src="/dashboard/service-image.png" alt="Services" className="w-32 h-32 mx-auto mb-6" />
          <p className="text-gray-600 mb-6 text-sm">
            Add services you provide to your customers and create Sale invoices for them faster.
          </p>
          <button
            className="bg-[var(--accent-orange)] text-white px-6 py-2 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity duration-200 shadow-sm"
            onClick={() => { setModalMode('add'); setIsAddModalOpen(true); }}
          >
            Add Your First Service
          </button>
        </div>
        <AddItemModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={loadItems}
          mode={modalMode}
          defaultType="Service"
          initialData={modalMode === 'edit' ? selectedItem : undefined}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-150px)]">
        {/* LEFT SIDEBAR */}
        <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col">

          <div className="p-3 border-b border-gray-200">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-blue)]"
              />
            </div>
          </div>

          <div className="p-3 border-b border-gray-200 flex items-center gap-2">
            <div className="relative flex-grow">
              <div className="flex w-full rounded-lg shadow-sm bg-[var(--accent-orange)] text-white font-semibold text-sm overflow-hidden">
                <button
                  onClick={() => { setModalMode('add'); setIsAddModalOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 hover:opacity-90 transition-opacity duration-200"
                >
                  <Plus size={18} strokeWidth={3} />
                  <span>Add Service</span>
                </button>
                <div className="border-l border-white/30">
                  <button
                    className="p-2 h-full hover:bg-black/10 transition-colors duration-200"
                    onClick={() => setIsAddItemDropdownOpen(prev => !prev)}
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>
              </div>
              {isAddItemDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                  <ul className="p-1">
                    <li>
                      <button className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                        <FileText size={18} className="text-gray-500" />
                        <span>Import Services</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto">
            <div className="flex justify-between items-center text-xs text-gray-500 font-bold px-4 py-2 bg-gray-50 border-b">
              <span>SERVICE NAME</span>
              <span>SALE PRICE</span>
            </div>
            <ul>
              {loading ? (
                <li className="p-4 text-center text-gray-400 text-sm">Loading...</li>
              ) : (
                items.map(item => (
                  <li
                    key={item._id}
                    className={`${selectedItem?._id === item._id
                      ? 'bg-blue-50 border-l-4 border-[var(--secondary-blue)]'
                      : 'border-l-4 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className="flex justify-between items-center px-4 py-3 cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <span className="text-sm font-medium text-gray-800">{item.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-green-600">
                          ₹{item.salePrice?.amount ?? item.salePrice ?? 0}
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
                ))
              )}
            </ul>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="w-full lg:w-3/4 bg-gray-50 flex flex-col p-4 gap-4">
          {selectedItem ? (
            <>
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <h2 className="text-lg font-semibold text-gray-800 pt-1">
                    {selectedItem.name} <span className="text-sm font-normal text-gray-500">(SERVICE)</span>
                  </h2>
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-start">
                    <div className="relative">
                      <button
                        onClick={() => setIsItemActionsDropdownOpen(prev => !prev)}
                        className="p-2 text-gray-500 hover:text-gray-800"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {isItemActionsDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                          <ul className="p-1 text-sm text-gray-700">
                            <li>
                              <button
                                className="w-full flex items-center gap-3 text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                                onClick={() => {
                                  setModalMode('edit');
                                  setIsAddModalOpen(true);
                                  setIsItemActionsDropdownOpen(false);
                                }}
                              >
                                <Edit size={16} /> View/Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="w-full flex items-center gap-3 text-left px-3 py-2 hover:bg-gray-100 rounded-md text-red-600"
                                onClick={() => handleDeleteItem(selectedItem._id)}
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:space-x-8 text-sm gap-y-3 mt-4">
                  <div>
                    <span className="text-gray-500">SALE PRICE: </span>
                    <span className="font-semibold text-gray-800">
                      ₹ {selectedItem.salePrice?.amount ?? selectedItem.salePrice ?? 0}
                    </span>
                    <span className="text-gray-400 text-xs"> ({selectedItem.salePrice?.taxType || 'excl'})</span>
                  </div>
                  <div>
                    <span className="text-gray-500">TAX RATE: </span>
                    <span className="font-semibold text-gray-800">{selectedItem.taxRate || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">UNIT: </span>
                    <span className="font-semibold text-gray-800">{selectedItem.unit || '-'}</span>
                  </div>
                  {selectedItem.hsn && (
                    <div>
                      <span className="text-gray-500">HSN/SAC: </span>
                      <span className="font-semibold text-gray-800">{selectedItem.hsn}</span>
                    </div>
                  )}
                  {selectedItem.description && (
                    <div className="w-full">
                      <span className="text-gray-500">DESCRIPTION: </span>
                      <span className="text-gray-700">{selectedItem.description}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex-grow flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <h3 className="text-base font-semibold text-gray-700">TRANSACTIONS</h3>
                  <div className="relative w-full sm:w-1/2 lg:w-1/3">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-blue)]"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="overflow-x-auto flex-grow">
                  <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                      <tr>
                        <th className="p-3">TYPE</th>
                        <th className="p-3">INVOICE/REF</th>
                        <th className="p-3">NAME</th>
                        <th className="p-3">DATE</th>
                        <th className="p-3">QUANTITY</th>
                        <th className="p-3">PRICE/UNIT</th>
                        <th className="p-3">STATUS</th>
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
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                tx.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-white border-b">
                          <td className="p-3 text-gray-400" colSpan={7}>No transactions yet for this service</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-grow bg-white rounded-lg shadow border border-gray-200">
              <p className="text-gray-500">Select a service to view details</p>
            </div>
          )}
        </div>
      </div>

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadItems}
        mode={modalMode}
        initialData={modalMode === 'edit' ? selectedItem : undefined}
      />
    </>
  );
};

export default ServicesTab;
