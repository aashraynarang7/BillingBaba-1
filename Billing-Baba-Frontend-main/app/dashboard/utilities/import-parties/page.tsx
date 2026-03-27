"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { bulkImportParties } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

// Excel template columns matching the user's screenshot format
const TEMPLATE_COLUMNS = [
    "Name*",
    "Contact No.",
    "Email ID",
    "Address",
    "Opening Balance",
    "Opening Date (dd/MM/yyyy)",
    "GSTIN No.",
    "Group Name",
    "Shipping Address",
];

const SAMPLE_DATA = [
    ["Party 1", "1234567891", "abc1@xyz.com", "Address 1", 200, "07/07/2019", "10AAAGM0289C1", "Group 1", "XYZ Street, Bangalore"],
    ["Party 2", "1234567892", "abc2@xyz.com", "Address 2", 300, "08/08/2019", "09AAAGM0289C1", "Group 2", "XYZ Street, Bangalore"],
    ["Party 3", "1234567893", "abc3@xyz.com", "Address 3", 40, "26/08/2019", "14AAAGM0289C1", "Group 1", "XYZ Street, Bangalore"],
];

// --- Custom Icons ---
const XlsIcon = () => (
    <div className="relative">
        <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
            <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="2" dy="4" result="offsetblur" />
                    <feComponentTransfer><feFuncA type="linear" slope="0.3" /></feComponentTransfer>
                    <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <g filter="url(#shadow)">
                <path d="M0 8C0 3.58172 3.58172 0 8 0H54L80 26V92C80 96.4183 76.4183 100 72 100H8C3.58172 100 0 96.4183 0 92V8Z" fill="#2563EB" />
                <path d="M54 0L80 26H62C57.5817 26 54 22.4183 54 18V0Z" fill="#60A5FA" />
            </g>
        </svg>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-serif italic">xls</span>
    </div>
);

const UploadIcon = () => (
    <div className="relative">
        <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12C0 5.37258 5.37258 0 12 0H62L100 38V108C100 114.627 94.6274 120 88 120H12C5.37258 120 0 114.627 0 108V12Z" fill="#2563EB" fillOpacity="0.9" />
            <path d="M62 0L100 38H74C67.3726 38 62 32.6274 62 26V0Z" fill="#93C5FD" />
            <path d="M49.9999 54V90" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M38 66L50 54L62 66" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);

interface ParsedParty {
    name: string;
    phone: string;
    email: string;
    billingAddress: string;
    openingBalance: number;
    asOfDate: string;
    gstin: string;
    partyGroup: string;
    shippingAddress: string;
}

export default function ImportPartiesPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [parsedData, setParsedData] = useState<ParsedParty[]>([]);
    const [fileName, setFileName] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [importResult, setImportResult] = useState<{ created: number; errors: any[] } | null>(null);
    const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
    const [dragOver, setDragOver] = useState(false);

    const handleDownloadTemplate = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [TEMPLATE_COLUMNS, ...SAMPLE_DATA];
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Set column widths
        ws["!cols"] = [
            { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 },
            { wch: 18 }, { wch: 22 }, { wch: 18 }, { wch: 15 }, { wch: 25 },
        ];

        XLSX.utils.book_append_sheet(wb, ws, "Parties");
        XLSX.writeFile(wb, "BillingBaba_Import_Parties_Template.xlsx");
    };

    const parseFile = useCallback((file: File) => {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                if (rows.length < 2) {
                    toast({ title: "Excel file is empty or has no data rows", variant: "destructive" });
                    return;
                }

                // Skip header row
                const dataRows = rows.slice(1).filter((row) => row[0] && String(row[0]).trim());

                const parsed: ParsedParty[] = dataRows.map((row) => ({
                    name: String(row[0] || "").trim(),
                    phone: String(row[1] || "").trim(),
                    email: String(row[2] || "").trim(),
                    billingAddress: String(row[3] || "").trim(),
                    openingBalance: Number(row[4]) || 0,
                    asOfDate: String(row[5] || "").trim(),
                    gstin: String(row[6] || "").trim(),
                    partyGroup: String(row[7] || "General").trim(),
                    shippingAddress: String(row[8] || "").trim(),
                }));

                setParsedData(parsed);
                setStep("preview");
            } catch (err) {
                toast({ title: "Failed to parse Excel file", variant: "destructive" });
            }
        };
        reader.readAsArrayBuffer(file);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) parseFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
            parseFile(file);
        } else {
            toast({ title: "Please upload an .xls or .xlsx file", variant: "destructive" });
        }
    };

    const handleImport = async () => {
        setIsUploading(true);
        try {
            const result = await bulkImportParties(parsedData);
            setImportResult(result);
            setStep("done");
            if (result.created > 0) {
                toast({ title: `Successfully imported ${result.created} parties!` });
            }
        } catch (err: any) {
            toast({ title: err.message || "Import failed", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveRow = (index: number) => {
        setParsedData((prev) => prev.filter((_, i) => i !== index));
    };

    // Upload step UI
    if (step === "upload") {
        return (
            <div className="min-h-screen bg-white">
                <header className="bg-white p-4 flex items-center justify-between sticky top-0 z-10 border-b">
                    <h1 className="text-xl font-semibold">Import Parties from Excel</h1>
                    <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-gray-600" onClick={() => router.back()}>
                        <X className="h-6 w-6" />
                    </Button>
                </header>

                <main className="p-4 sm:p-8 flex items-center justify-center">
                    <div className="w-full max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-8 items-start">
                            {/* Left: Download Template */}
                            <div className="flex flex-col items-center text-center space-y-8 pt-8">
                                <p className="font-semibold text-gray-700">
                                    Download .xls/.xlsx (excel sheet)<br />template file to enter Data
                                </p>
                                <XlsIcon />
                                <Button
                                    onClick={handleDownloadTemplate}
                                    className="text-white shadow-lg shadow-blue-500/50 px-10 py-6 text-base rounded-md"
                                    style={{ background: "linear-gradient(to bottom, #3b82f6, #2563eb)" }}
                                >
                                    Download
                                </Button>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block bg-gray-200 w-px min-h-[300px]" />

                            {/* Right: Upload */}
                            <div className="flex flex-col items-center text-center space-y-4 pt-8">
                                <p className="font-semibold text-gray-700">Upload your .xls/ .xlsx (excel sheet)</p>
                                <div
                                    className={`w-full flex flex-col items-center border-2 border-dashed rounded-lg p-16 transition-colors ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                >
                                    <UploadIcon />
                                    <p className="text-gray-500 mt-6">
                                        Drag and drop or{" "}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-blue-600 font-semibold hover:underline focus:outline-none"
                                        >
                                            Click here to Browse
                                        </button>
                                        <br />formatted excel file to continue
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".xls,.xlsx"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Preview step UI
    if (step === "preview") {
        return (
            <div className="min-h-screen bg-white">
                <header className="bg-white p-4 flex items-center justify-between sticky top-0 z-10 border-b">
                    <div>
                        <h1 className="text-xl font-semibold">Preview & Import Parties</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            File: {fileName} — {parsedData.length} parties found
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => { setStep("upload"); setParsedData([]); setFileName(""); }}>
                            Back
                        </Button>
                        <Button
                            onClick={handleImport}
                            disabled={isUploading || parsedData.length === 0}
                            className="bg-green-600 hover:bg-green-700 text-white gap-2"
                        >
                            {isUploading ? <><Loader2 className="animate-spin" size={16} /> Importing...</> : `Import ${parsedData.length} Parties`}
                        </Button>
                    </div>
                </header>

                <main className="p-4 sm:p-6">
                    <div className="border rounded-lg overflow-auto max-h-[calc(100vh-140px)]">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600 w-8">#</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Name*</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Contact No.</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Email</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Address</th>
                                    <th className="px-3 py-2 text-right font-semibold text-gray-600">Opening Balance</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Opening Date</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">GSTIN</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Group</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Shipping Address</th>
                                    <th className="px-3 py-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {parsedData.map((party, idx) => (
                                    <tr key={idx} className="border-t hover:bg-gray-50">
                                        <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                                        <td className="px-3 py-2 font-medium">{party.name}</td>
                                        <td className="px-3 py-2">{party.phone}</td>
                                        <td className="px-3 py-2">{party.email}</td>
                                        <td className="px-3 py-2 max-w-[150px] truncate">{party.billingAddress}</td>
                                        <td className={`px-3 py-2 text-right font-medium ${party.openingBalance < 0 ? "text-red-600" : "text-green-700"}`}>
                                            {party.openingBalance}
                                        </td>
                                        <td className="px-3 py-2">{party.asOfDate}</td>
                                        <td className="px-3 py-2 text-xs font-mono">{party.gstin}</td>
                                        <td className="px-3 py-2">{party.partyGroup}</td>
                                        <td className="px-3 py-2 max-w-[150px] truncate">{party.shippingAddress}</td>
                                        <td className="px-3 py-2">
                                            <button onClick={() => handleRemoveRow(idx)} className="text-red-400 hover:text-red-600">
                                                <X size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        );
    }

    // Done step UI
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <header className="bg-white p-4 flex items-center justify-between sticky top-0 z-10 border-b">
                <h1 className="text-xl font-semibold">Import Complete</h1>
                <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-gray-600" onClick={() => router.back()}>
                    <X className="h-6 w-6" />
                </Button>
            </header>

            <main className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    {importResult && importResult.created > 0 ? (
                        <>
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {importResult.created} Parties Imported!
                            </h2>
                            {importResult.errors.length > 0 && (
                                <div className="mt-4 text-left bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-red-700 mb-2">
                                        <AlertCircle className="inline w-4 h-4 mr-1" />
                                        {importResult.errors.length} rows had errors:
                                    </p>
                                    <ul className="text-xs text-red-600 space-y-1 max-h-40 overflow-auto">
                                        {importResult.errors.map((err, i) => (
                                            <li key={i}>Row {err.row}: {err.error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Import Failed</h2>
                            {importResult?.errors && importResult.errors.length > 0 && (
                                <div className="mt-4 text-left bg-red-50 border border-red-200 rounded-lg p-4">
                                    <ul className="text-xs text-red-600 space-y-1 max-h-40 overflow-auto">
                                        {importResult.errors.map((err, i) => (
                                            <li key={i}>Row {err.row}: {err.error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex gap-3 justify-center mt-6">
                        <Button variant="outline" onClick={() => { setStep("upload"); setParsedData([]); setFileName(""); setImportResult(null); }}>
                            Import More
                        </Button>
                        <Button onClick={() => router.push("/dashboard/party")} className="bg-blue-600 hover:bg-blue-700 text-white">
                            View Parties
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
