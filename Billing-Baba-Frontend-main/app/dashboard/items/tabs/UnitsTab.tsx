import { Search, MoreVertical } from 'lucide-react';

const unitsData = [
    { fullName: 'BAGS', shortName: 'Bag' }, { fullName: 'BOTTLES', shortName: 'Btl' },
    { fullName: 'BOX', shortName: 'Box' }, { fullName: 'BUNDLES', shortName: 'Bdl' },
    { fullName: 'CANS', shortName: 'Cns' }, { fullName: 'CARTONS', shortName: 'Ctn' },
    { fullName: 'DOZENS', shortName: 'Dzn' }, { fullName: 'GRAMMES', shortName: 'Gm' },
    { fullName: 'KILOGRAMS', shortName: 'Kg' }, { fullName: 'LITRE', shortName: 'Ltr' },
    { fullName: 'METERS', shortName: 'Mtr' }, { fullName: 'MILILITRE', shortName: 'Ml' },
];

const UnitsTab = () => {
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
                    <button className="w-full bg-[var(--accent-orange)] text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity duration-200">+ Add Units</button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <div className="flex justify-between items-center text-xs text-gray-500 font-bold px-4 py-2 bg-gray-50 border-b">
                        <span>FULLNAME</span>
                        <span>SHORTNAME</span>
                    </div>
                    <ul>
                        {unitsData.map((unit, index) => (
                            <li key={index} className={`${index === 0 ? 'bg-blue-50 border-l-4 border-[var(--secondary-blue)]' : ''} hover:bg-gray-100`}>
                                <div className="flex justify-between items-center px-4 py-3 cursor-pointer">
                                    <span className="text-sm font-medium text-gray-800">{unit.fullName}</span>
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium text-gray-600">{unit.shortName}</span>
                                      <button className="ml-4 text-gray-400 hover:text-gray-700"><MoreVertical size={16} /></button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Main Content - UPDATED with Cards */}
            <div className="w-full lg:w-3/4 bg-gray-50 flex flex-col p-4 gap-4">
                
                {/* Card 1: Header */}
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <h2 className="text-sm font-semibold text-gray-800">BAGS</h2>
                    <button className="bg-[var(--secondary-blue)] text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity duration-200 self-start sm:self-center">Add Conversion</button>
                </div>

                {/* Card 2: Units Table */}
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex-grow flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <h3 className="text-base font-semibold text-gray-700">UNITS</h3>
                        <div className="relative w-full sm:w-1/2 lg:w-1/3">
                            <input type="text" placeholder="Search..." className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-blue)]" />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg flex-grow">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                                <tr><th scope="col" className="p-3">CONVERSION</th></tr>
                            </thead>
                            <tbody>
                                <tr className='h-full'>
                                    <td className="p-16 text-center text-gray-500 align-middle">No Rows To Show</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnitsTab;