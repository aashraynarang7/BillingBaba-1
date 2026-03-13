// src/app/sales/components/Header.tsx
"use client";

import { useState } from 'react';
import { Settings, ChevronDown, Check } from 'lucide-react';
import { SalePageType } from '../page'; // Import the type from the main page

interface HeaderProps {
  activePage: SalePageType;
  setActivePage: (page: SalePageType) => void;
}

const Header = ({ activePage, setActivePage }: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pages: SalePageType[] = [
    'Sale Invoices', 'Estimate/Quotation', 'Proforma Invoice', 'Payment-In',
    'Sale Order', 'Delivery Challan', 'Sale Return', 'Billing Baba POS'
  ];

  const handlePageSelect = (page: SalePageType) => {
    setActivePage(page);
    setIsDropdownOpen(false);
  };

  return (
    <header className="flex justify-between items-center">
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 text-2xl font-bold text-gray-800"
        >
          {activePage}
          <ChevronDown size={20} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full mt-2 w-60 bg-white rounded-lg shadow-xl border z-20">
            <ul className="p-1">
              {pages.map((page) => (
                <li key={page}>
                  <button
                    onClick={() => handlePageSelect(page)}
                    className="w-full flex justify-between items-center text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    {page}
                    {activePage === page && <Check size={16} className="text-blue-600" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors">
          + Add Sale
        </button>
        <button className="text-gray-500 hover:text-gray-800">
          <Settings size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;