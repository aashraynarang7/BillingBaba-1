import { Search, Filter } from 'lucide-react';

const CategoryTab = () => {
    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-150px)]">
            {/* Left Sidebar (No changes) */}
            <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col">
                <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="relative w-full mr-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-blue)]" />
                    </div>
                </div>
                <div className="p-3 border-b border-gray-200">
                    <button className="w-full bg-[var(--accent-orange)] text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity duration-200">+ Add Category</button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <div className="flex justify-between items-center text-xs text-gray-500 font-bold px-4 py-2 bg-gray-50 border-b">
                        <span>CATEGORY</span>
                        <span>ITEM</span>
                    </div>
                    <ul>
                        <li className="bg-blue-50 border-l-4 border-[var(--secondary-blue)]">
                            <div className="flex justify-between items-center px-4 py-3 cursor-pointer">
                                <span className="text-sm font-medium text-gray-800">Items not in any Category</span>
                                <span className="text-sm font-semibold text-gray-700 bg-gray-200 rounded-full px-2 py-0.5">1</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content - UPDATED with Cards */}
            <div className="w-full lg:w-3/4 bg-gray-50 flex flex-col p-4 gap-4">
                
                {/* Card 1: Header */}
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <h2 className="text-sm font-semibold text-gray-800">ITEMS NOT IN ANY CATEGORY <span className="text-sm font-normal text-gray-500 ml-2">1</span></h2>
                    <button className="bg-[var(--secondary-blue)] text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity duration-200 self-start sm:self-center">Move To This Category</button>
                </div>

                {/* Card 2: Items Table */}
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex-grow flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                      <h3 className="text-base font-semibold text-gray-700">ITEMS</h3>
                      <div className="relative w-full sm:w-1/2 lg:w-1/3">
                          <input type="text" placeholder="Search..." className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-blue)]" />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>
                    <div className="overflow-x-auto flex-grow">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                                <tr>
                                    <th scope="col" className="p-3">NAME</th>
                                    <th scope="col" className="p-3"><div className="flex items-center">QUANTITY <Filter size={12} className="ml-1" /></div></th>
                                    <th scope="col" className="p-3"><div className="flex items-center">STOCK VALUE <Filter size={12} className="ml-1" /></div></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium text-gray-900">Sample Item</td>
                                    <td className="p-3 text-red-600 font-semibold">-10</td>
                                    <td className="p-3 text-green-600 font-semibold">₹ 0.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryTab;