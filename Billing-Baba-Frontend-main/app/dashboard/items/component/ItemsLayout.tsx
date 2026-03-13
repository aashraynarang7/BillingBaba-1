"use client"
import { useState } from 'react';
import ProductsTab from '../tabs/ProductsTab';
import ServicesTab from '../tabs/ServicesTab';
import CategoryTab from '../tabs/CategoryTab';
import UnitsTab from '../tabs/UnitsTab';

const tabs = ['PRODUCTS', 'SERVICES', 'CATEGORY', 'UNITS'];

const ItemsLayout = () => {
  const [activeTab, setActiveTab] = useState('PRODUCTS');

  const renderContent = () => {
    switch (activeTab) {
      case 'PRODUCTS':
        return <ProductsTab />;
      case 'SERVICES':
        return <ServicesTab />;
      case 'CATEGORY':
        return <CategoryTab />;
      case 'UNITS':
        return <UnitsTab />;
      default:
        return <ProductsTab />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-2 sm:p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-6 px-4 sm:px-6 overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-[var(--secondary-blue)] text-[var(--secondary-blue)]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex-shrink-0 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="content-area">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsLayout;