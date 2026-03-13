import React from 'react';

// हर आइटम के डेटा के लिए एक टाइप बनाना बेहतर होता है
type Item = {
  itemName: string;
  itemCode?: number | string; // आइटम कोड स्ट्रिंग या नंबर हो सकता है
  category?: string;
  hsn?: number | string;
  salePrice: number;
  purchasePrice: number;
  onlineStorePrice: number;
  discountType: string;
  saleDiscount: number;
  currentStock: number;
  minStock: number;
  itemLocation?: string;
  taxRate: string;
  taxType: 'exclusive' | 'inclusive';
  baseUnit?: string;
  secondaryUnit?: string;
  convRate?: string;
};

// आपके अनुरोध के अनुसार, यहाँ ज़्यादा डेटा जोड़ा गया है
const tableData: Item[] = [
  {
    itemName: 'Mask',
    itemCode: 6675,
    category: 'Health',
    hsn: 12345,
    salePrice: 200,
    purchasePrice: 180,
    onlineStorePrice: 200,
    discountType: 'Discount %',
    saleDiscount: 20,
    currentStock: 19,
    minStock: 0,
    taxRate: 'IGST@3%',
    taxType: 'exclusive',
  },
  {
    itemName: 'Sample Item',
    itemCode: '',
    category: '',
    hsn: '',
    salePrice: 100,
    purchasePrice: 0,
    onlineStorePrice: 100,
    discountType: 'Discount %',
    saleDiscount: 0,
    currentStock: -10,
    minStock: 0,
    taxRate: 'none',
    taxType: 'exclusive',
  },
  {
    itemName: 'Wireless Mouse',
    itemCode: 8801,
    category: 'Electronics',
    hsn: 8471,
    salePrice: 1200,
    purchasePrice: 950,
    onlineStorePrice: 1150,
    discountType: 'Discount %',
    saleDiscount: 10,
    currentStock: 150,
    minStock: 20,
    taxRate: 'GST@18%',
    taxType: 'exclusive',
  },
  {
    itemName: 'USB-C Hub',
    itemCode: 8802,
    category: 'Accessories',
    hsn: 8544,
    salePrice: 2500,
    purchasePrice: 2100,
    onlineStorePrice: 2500,
    discountType: 'Discount %',
    saleDiscount: 0,
    currentStock: 75,
    minStock: 10,
    taxRate: 'GST@18%',
    taxType: 'exclusive',
  },
    {
    itemName: 'Laptop Stand',
    itemCode: 9105,
    category: 'Furniture',
    hsn: 9403,
    salePrice: 1800,
    purchasePrice: 1400,
    onlineStorePrice: 1750,
    discountType: 'Discount %',
    saleDiscount: 5,
    currentStock: 40,
    minStock: 5,
    taxRate: 'GST@12%',
    taxType: 'exclusive',
  },
];


const ExcelSheetDownloadPage: React.FC = () => {
  return (
    // पूरे पेज का बैकग्राउंड
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* मेन कार्ड जिसमें शैडो और गोल किनारे हैं */}
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        
        {/* कार्ड का हेडर */}
        <header className="p-4 sm:p-5 bg-[#e8eaf6] border-b border-gray-200">
          <h1 className="text-lg sm:text-xl font-bold text-[#3f51b5]">
            Excel Sheet Download
          </h1>
        </header>

        {/* कार्ड की बॉडी - इसमें स्क्रॉल होने वाली टेबल है */}
        <main className="p-4 sm:p-5">
          {/*
            *** यही वो बदलाव है जिससे पेज बाहर नहीं जाएगा ***
            यह DIV टेबल को घेरता है और 'overflow-x-auto' क्लास इसे छोटे स्क्रीन पर हॉरिजॉन्टल स्क्रॉल करने की सुविधा देता है।
          */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    'Item Name', 'Item Code', 'Category', 'HSN', 'Sale Price',
                    'Purchase Price', 'Online Store Price', 'Discount Type',
                    'Sale Discount', 'Current Stock', 'Min Stock', 'Item Location',
                    'Tax Rate', 'Tax Type', 'Base Unit', 'Secondary Unit', 'Conv. Rate'
                  ].map((header) => (
                    // कॉम्पैक्ट लुक के लिए पैडिंग (py-2 px-3) और फॉन्ट साइज़ (text-sm) को कम किया गया है
                    <th key={header} className="py-2 px-3 text-left text-sm font-semibold text-gray-700 border border-gray-300 whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {/* सभी सेल्स (td) पर कॉम्पैक्ट स्टाइल लगाई गई है */}
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.itemName}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.itemCode}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.category}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.hsn}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.salePrice}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.purchasePrice}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.onlineStorePrice}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.discountType}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.saleDiscount}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.currentStock}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.minStock}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.itemLocation || ''}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.taxRate}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.taxType}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.baseUnit || ''}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.secondaryUnit || ''}</td>
                    <td className="py-2 px-3 text-sm text-gray-800 border-l border-r border-gray-300 whitespace-nowrap">{item.convRate || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* कार्ड का फुटर */}
        <footer className="flex justify-end p-4 sm:p-5 border-t border-gray-200">
          <button className="px-5 py-2 bg-[#00b0ff] text-white font-bold text-sm rounded-md hover:bg-[#0091ea] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors">
            EXPORT
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ExcelSheetDownloadPage;