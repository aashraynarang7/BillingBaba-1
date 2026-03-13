// components/items/ImportItemsPage.tsx
import { useState } from 'react';
import { Barcode, FileSpreadsheet, Library } from 'lucide-react';

type ImportMethod = 'barcode' | 'excel' | 'library';

const ImportItemsPage = () => {
    const [selectedMethod, setSelectedMethod] = useState<ImportMethod>('barcode');

    const OptionCard = ({
        method,
        title,
        description,
        icon,
        isRecommended = false,
    }: {
        method: ImportMethod;
        title: string;
        description: string;
        icon: React.ReactNode;
        isRecommended?: boolean;
    }) => {
        const isSelected = selectedMethod === method;

        return (
            <div
                onClick={() => setSelectedMethod(method)}
                className={`relative p-6 bg-white border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected ? 'border-[var(--secondary-blue)] shadow-lg' : 'border-gray-200 hover:border-gray-300'
                }`}
            >
                {isRecommended && (
                    <div className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        RECOMMENDED
                    </div>
                )}
                <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 ${isSelected ? 'border-[var(--secondary-blue)]' : 'border-gray-300'} flex items-center justify-center`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-[var(--secondary-blue)] rounded-full"></div>}
                </div>
                <div className="flex flex-col items-center text-center mt-6">
                    <div className="mb-4 text-[var(--secondary-blue)]">{icon}</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-xl font-bold text-gray-800">Import Items</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-8 sm:py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        Select Import Method
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <OptionCard
                            method="barcode"
                            title="Import From Barcode"
                            description="Import item details by scanning barcodes. Billing Baba uses a library of 100 Mn+ standard barcodes to fetch all details of your items in seconds."
                            icon={<Barcode size={48} strokeWidth={1.5} />}
                            isRecommended
                        />
                         <OptionCard
                            method="excel"
                            title="Import From Excel"
                            description="Import item data from excel files in your system"
                            icon={<FileSpreadsheet size={48} strokeWidth={1.5} />}
                        />
                    </div>

                    <div className="flex items-center my-8">
                        <hr className="flex-grow border-gray-300" />
                        <span className="px-4 text-sm font-semibold text-gray-500">OR</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    <div
                        onClick={() => setSelectedMethod('library')}
                        className={`relative p-4 bg-white border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between ${
                            selectedMethod === 'library' ? 'border-[var(--secondary-blue)] shadow-lg' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                         <div className="flex items-center gap-4">
                            <div className="text-[var(--secondary-blue)]"><Library size={32} strokeWidth={1.5}/></div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Import From Billing Baba Library</h3>
                                <p className="text-sm text-gray-500">Import items from Billing Baba's database</p>
                            </div>
                         </div>
                         <div className={`w-5 h-5 rounded-full border-2 ${selectedMethod === 'library' ? 'border-[var(--secondary-blue)]' : 'border-gray-300'} flex items-center justify-center flex-shrink-0`}>
                            {selectedMethod === 'library' && <div className="w-2.5 h-2.5 bg-[var(--secondary-blue)] rounded-full"></div>}
                        </div>
                    </div>
                </div>
            </main>

             {/* Footer Button */}
             <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <div className="max-w-6xl mx-auto flex justify-end">
                    <button className="bg-[var(--accent-red)] text-white font-bold py-3 px-10 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-200">
                        Continue
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ImportItemsPage;