"use client";

import React, { useState, useEffect } from "react";
import { fetchItems } from "@/lib/api";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

interface ItemRow {
    itemName: string;
    itemCode: string;
    description: string;
    category: string;
    hsn: string;
    salePrice: number;
    purchasePrice: number;
    onlineStorePrice: number;
    currentStock: number;
    minStock: number;
    itemLocation: string;
    taxRate: string;
    taxType: string;
    baseUnit: string;
    secondaryUnit: string;
    convRate: string;
}

const TABLE_HEADERS = [
    "Item Name", "Item Code", "Description", "Category", "HSN",
    "Sale Price", "Purchase Price", "Online Store Price",
    "Current Stock", "Min Stock", "Item Location",
    "Tax Rate", "Tax Type", "Base Unit", "Secondary Unit", "Conv. Rate",
];

const formatTaxRate = (rate: number | undefined): string => {
    if (!rate || rate === 0) return "none";
    return `GST@${rate}%`;
};

const formatTaxType = (taxType: string | undefined): string => {
    if (taxType === "withTax") return "inclusive";
    return "exclusive";
};

const ExcelSheetDownloadPage: React.FC = () => {
    const router = useRouter();
    const [items, setItems] = useState<ItemRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const data = await fetchItems({ type: "product" });
                const mapped: ItemRow[] = data.map((item: any) => {
                    const p = item.product || {};
                    return {
                        itemName: item.name || p.name || "",
                        itemCode: p.itemCode || "",
                        description: p.onlineStoreDescription || "",
                        category: p.category || "",
                        hsn: p.hsn || "",
                        salePrice: Number(p.salePrice?.amount ?? p.salePrice) || 0,
                        purchasePrice: Number(p.purchasePrice?.amount ?? p.purchasePrice) || 0,
                        onlineStorePrice: Number(p.onlineStorePrice) || 0,
                        currentStock: Number(p.currentQuantity) || 0,
                        minStock: Number(p.minStockToMaintain) || 0,
                        itemLocation: p.location || "",
                        taxRate: formatTaxRate(p.taxRate),
                        taxType: formatTaxType(p.salePrice?.taxType),
                        baseUnit: (p.unit || "PIECES").toUpperCase(),
                        secondaryUnit: "",
                        convRate: "",
                    };
                });
                setItems(mapped);
            } catch (err) {
                console.error("Failed to load items", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadItems();
    }, []);

    const handleExport = () => {
        const wsData = [
            TABLE_HEADERS,
            ...items.map((item) => [
                item.itemName,
                item.itemCode,
                item.description,
                item.category,
                item.hsn,
                item.salePrice,
                item.purchasePrice,
                item.onlineStorePrice,
                item.currentStock,
                item.minStock,
                item.itemLocation,
                item.taxRate,
                item.taxType,
                item.baseUnit,
                item.secondaryUnit,
                item.convRate,
            ]),
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        ws["!cols"] = [
            { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 12 },
            { wch: 12 }, { wch: 15 }, { wch: 18 },
            { wch: 14 }, { wch: 10 }, { wch: 15 },
            { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 12 },
        ];

        XLSX.utils.book_append_sheet(wb, ws, "Items");
        XLSX.writeFile(wb, "BillingBaba_Items_Export.xlsx");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <header className="p-4 sm:p-5 bg-[#e8eaf6] border-b border-gray-200 flex items-center justify-between">
                    <h1 className="text-lg sm:text-xl font-bold text-[#3f51b5]">
                        Excel Sheet Download
                    </h1>
                    <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
                        <X size={22} />
                    </button>
                </header>

                {/* Body */}
                <main className="p-4 sm:p-5">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            <span className="ml-3 text-gray-500">Loading items...</span>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            No items found. Add products first to export.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {TABLE_HEADERS.map((header) => (
                                            <th
                                                key={header}
                                                className="py-2 px-3 text-left text-sm font-semibold text-gray-700 border border-gray-300 whitespace-nowrap"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {items.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.itemName}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.itemCode}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap max-w-[200px] truncate">{item.description}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.category}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.hsn}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.salePrice}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.purchasePrice}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.onlineStorePrice}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.currentStock}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.minStock}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.itemLocation}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.taxRate}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.taxType}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.baseUnit}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.secondaryUnit}</td>
                                            <td className="py-2 px-3 text-sm text-gray-800 border border-gray-300 whitespace-nowrap">{item.convRate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="flex justify-end p-4 sm:p-5 border-t border-gray-200">
                    <button
                        onClick={handleExport}
                        disabled={isLoading || items.length === 0}
                        className="px-5 py-2 bg-[#00b0ff] text-white font-bold text-sm rounded-md hover:bg-[#0091ea] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors disabled:opacity-50"
                    >
                        EXPORT
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ExcelSheetDownloadPage;
