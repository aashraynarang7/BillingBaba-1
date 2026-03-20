"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, UploadCloud, CheckCircle2, XCircle, AlertTriangle, Download, Loader2 } from "lucide-react";
import { fetchItems, createItem } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

// ── Types ────────────────────────────────────────────────────────────────────
interface ParsedRow {
    rowIndex: number;
    name: string;
    type: "product" | "service";
    salePrice: number;
    purchasePrice: number;
    taxRate: number;
    unit: string;
    hsn: string;
    openingQty: number;
    status: "valid" | "duplicate_file" | "duplicate_db" | "missing_name";
    error?: string;
}

// ── Step indicator ────────────────────────────────────────────────────────────
const ImportStep = ({ number, active, children }: { number: number; active?: boolean; children: React.ReactNode }) => (
    <div className={active ? "opacity-100" : "opacity-60"}>
        <h3 className="text-sm font-bold text-red-500 mb-1">STEP {number}</h3>
        <div className="text-gray-700 space-y-2 text-sm">{children}</div>
    </div>
);

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: ParsedRow["status"] }) => {
    if (status === "valid")
        return <span className="flex items-center gap-1 text-green-700 text-xs font-medium"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</span>;
    if (status === "duplicate_file")
        return <span className="flex items-center gap-1 text-orange-600 text-xs font-medium"><AlertTriangle className="h-3.5 w-3.5" /> Duplicate in file</span>;
    if (status === "duplicate_db")
        return <span className="flex items-center gap-1 text-red-600 text-xs font-medium"><XCircle className="h-3.5 w-3.5" /> Already exists</span>;
    return <span className="flex items-center gap-1 text-red-600 text-xs font-medium"><XCircle className="h-3.5 w-3.5" /> Name missing</span>;
};

// ── Sample template columns ───────────────────────────────────────────────────
const TEMPLATE_HEADERS = [
    "Item Name*", "Type (product/service)", "Sale Price", "Purchase Price",
    "Tax Rate (%)", "Unit", "HSN/SAC Code", "Opening Quantity"
];

const SAMPLE_ROWS = [
    ["Rice Bag 5kg", "product", 250, 200, 5, "BAG", "1006", 100],
    ["Web Design Service", "service", 5000, 0, 18, "NOS", "998314", 0],
];

// ── Download sample template ──────────────────────────────────────────────────
function downloadTemplate() {
    const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS, ...SAMPLE_ROWS]);
    ws["!cols"] = TEMPLATE_HEADERS.map(() => ({ wch: 22 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Items");
    XLSX.writeFile(wb, "import_items_template.xlsx");
}

// ── Parse Excel file → ParsedRow[] ───────────────────────────────────────────
function parseExcel(file: File): Promise<Omit<ParsedRow, "status" | "error">[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target!.result as ArrayBuffer);
                const wb = XLSX.read(data, { type: "array" });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

                if (rows.length < 2) { resolve([]); return; }

                // Skip header row
                const parsed = rows.slice(1).map((row, idx) => ({
                    rowIndex: idx + 2, // Excel row number
                    name: String(row[0] || "").trim(),
                    type: String(row[1] || "product").toLowerCase().includes("service") ? "service" as const : "product" as const,
                    salePrice: Number(row[2]) || 0,
                    purchasePrice: Number(row[3]) || 0,
                    taxRate: Number(row[4]) || 0,
                    unit: String(row[5] || "NOS").trim(),
                    hsn: String(row[6] || "").trim(),
                    openingQty: Number(row[7]) || 0,
                })).filter(r => r.name !== "" || String(r.salePrice) !== "0"); // skip completely blank rows

                resolve(parsed);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ImportItemsFromExcelPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [rows, setRows] = useState<ParsedRow[]>([]);
    const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null);

    // ── File processing ──────────────────────────────────────────────────────
    const processFile = useCallback(async (file: File) => {
        if (!file.name.match(/\.(xlsx|xls)$/i)) {
            toast({ title: "Invalid file type. Please upload .xlsx or .xls", variant: "destructive" });
            return;
        }
        setIsProcessing(true);
        try {
            const parsed = await parseExcel(file);
            if (parsed.length === 0) {
                toast({ title: "No data found in the file.", variant: "destructive" });
                setIsProcessing(false);
                return;
            }

            // Fetch existing item names from DB
            const existing = await fetchItems();
            const existingNames = new Set<string>(
                existing.map((it: any) => (it.name || "").toLowerCase().trim())
            );

            // Find in-file duplicates (case-insensitive)
            const nameCount: Record<string, number> = {};
            for (const r of parsed) nameCount[r.name.toLowerCase()] = (nameCount[r.name.toLowerCase()] || 0) + 1;

            const validated: ParsedRow[] = parsed.map(r => {
                if (!r.name) return { ...r, status: "missing_name" as const, error: "Item name is required" };
                if (existingNames.has(r.name.toLowerCase())) return { ...r, status: "duplicate_db" as const, error: "Item already exists in database" };
                if (nameCount[r.name.toLowerCase()] > 1) return { ...r, status: "duplicate_file" as const, error: "Duplicate name within file" };
                return { ...r, status: "valid" as const };
            });

            setRows(validated);
            setStep("preview");
        } catch (err) {
            console.error(err);
            toast({ title: "Failed to parse file. Please check the format.", variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    }, []);

    // ── Drag & Drop ──────────────────────────────────────────────────────────
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    }, [processFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
        e.target.value = "";
    };

    // ── Import valid rows ────────────────────────────────────────────────────
    const handleImport = async () => {
        const validRows = rows.filter(r => r.status === "valid");
        if (validRows.length === 0) {
            toast({ title: "No valid rows to import", variant: "destructive" });
            return;
        }
        setIsImporting(true);
        const companyId = typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : "";

        let success = 0;
        let failed = 0;

        for (const row of validRows) {
            try {
                const payload: any = {
                    name: row.name,
                    type: row.type,
                    companyId,
                    unit: row.unit,
                    hsn: row.hsn,
                    sac: row.type === "service" ? row.hsn : undefined,
                    salePrice: { amount: row.salePrice, taxType: "withTax" },
                    purchasePrice: { amount: row.purchasePrice, taxType: "withTax" },
                    taxRate: row.taxRate,
                    openingQuantity: row.type === "product" ? row.openingQty : undefined,
                    currentQuantity: row.type === "product" ? row.openingQty : undefined,
                };
                await createItem(payload);
                success++;
            } catch {
                failed++;
            }
        }

        setImportResults({ success, failed });
        setStep("done");
        setIsImporting(false);
        toast({
            title: `Import complete: ${success} added${failed > 0 ? `, ${failed} failed` : ""}`,
            className: success > 0 ? "bg-green-500 text-white" : undefined,
            variant: failed > 0 && success === 0 ? "destructive" : undefined,
        });
    };

    const validCount = rows.filter(r => r.status === "valid").length;
    const errorCount = rows.length - validCount;

    // ── Upload screen ────────────────────────────────────────────────────────
    if (step === "upload") {
        return (
            <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-2xl font-bold">Import Items From Excel File</h1>
                </div>

                <Card className="shadow-lg max-w-5xl mx-auto">
                    <CardContent className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left: Steps */}
                        <div className="space-y-8">
                            <h2 className="text-xl font-bold">Steps to Import</h2>

                            <ImportStep number={1} active>
                                <p>Download the sample template and fill in your item details.</p>
                                <Button
                                    variant="outline"
                                    className="border-blue-500 text-blue-600 hover:bg-blue-50 gap-2"
                                    onClick={downloadTemplate}
                                >
                                    <Download className="h-4 w-4" /> Download Sample Template
                                </Button>
                                <div className="mt-3 rounded border bg-gray-50 p-3 text-xs text-gray-500">
                                    <p className="font-semibold text-gray-700 mb-1">Template columns:</p>
                                    <p>{TEMPLATE_HEADERS.join(" · ")}</p>
                                    <p className="mt-1 text-orange-600 font-medium">* Item Name is required and must be unique</p>
                                </div>
                            </ImportStep>

                            <ImportStep number={2} active>
                                <p>Upload the filled <strong>.xlsx</strong> or <strong>.xls</strong> file using the panel on the right.</p>
                            </ImportStep>

                            <ImportStep number={3}>
                                <p>Review items — duplicates and errors are highlighted automatically. Confirm to import valid items.</p>
                            </ImportStep>
                        </div>

                        {/* Right: Drop zone */}
                        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8">
                            <h3 className="font-semibold mb-4">Upload your .xls / .xlsx file</h3>
                            <div
                                className={`w-full flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                                    ${isDragging ? "border-blue-500 bg-blue-50" : "border-blue-300 hover:border-blue-400"}`}
                                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="h-14 w-14 text-blue-400 mb-4 animate-spin" />
                                        <p className="text-gray-600">Processing file...</p>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="h-16 w-16 text-blue-300 mb-4" />
                                        <p className="text-lg text-gray-600">Drag & Drop file here</p>
                                        <p className="text-muted-foreground my-3">or</p>
                                        <Button className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 py-5 pointer-events-none">
                                            <Upload className="h-4 w-4 mr-2" /> Browse File
                                        </Button>
                                    </>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ── Done screen ──────────────────────────────────────────────────────────
    if (step === "done") {
        return (
            <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex items-center justify-center">
                <Card className="shadow-lg max-w-md w-full text-center p-10">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Import Complete!</h2>
                    <p className="text-gray-600 mb-1">{importResults?.success} item(s) imported successfully.</p>
                    {importResults && importResults.failed > 0 && (
                        <p className="text-red-600 text-sm mb-4">{importResults.failed} item(s) failed.</p>
                    )}
                    <div className="flex gap-3 justify-center mt-6">
                        <Button variant="outline" onClick={() => { setStep("upload"); setRows([]); setImportResults(null); }}>
                            Import More
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push("/dashboard/items")}>
                            Go to Items
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // ── Preview screen ───────────────────────────────────────────────────────
    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => { setStep("upload"); setRows([]); }}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Review Items to Import</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        <span className="text-green-600 font-semibold">{validCount} valid</span>
                        {errorCount > 0 && <span className="text-red-600 font-semibold ml-2">{errorCount} skipped (errors)</span>}
                    </p>
                </div>
            </div>

            {/* Summary cards */}
            <div className="flex gap-4 mb-6 flex-wrap">
                <div className="bg-white border rounded-lg px-5 py-3 shadow-sm text-center min-w-[120px]">
                    <p className="text-2xl font-bold text-gray-800">{rows.length}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Total Rows</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg px-5 py-3 shadow-sm text-center min-w-[120px]">
                    <p className="text-2xl font-bold text-green-700">{validCount}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Will be Imported</p>
                </div>
                {errorCount > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-5 py-3 shadow-sm text-center min-w-[120px]">
                        <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Skipped</p>
                    </div>
                )}
            </div>

            <Card className="shadow-lg">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Item Name</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3 text-right">Sale Price</th>
                                    <th className="px-4 py-3 text-right">Purchase Price</th>
                                    <th className="px-4 py-3 text-right">Tax %</th>
                                    <th className="px-4 py-3">Unit</th>
                                    <th className="px-4 py-3">HSN/SAC</th>
                                    <th className="px-4 py-3 text-right">Opening Qty</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {rows.map(row => (
                                    <tr key={row.rowIndex} className={
                                        row.status === "valid"
                                            ? "hover:bg-gray-50"
                                            : "bg-red-50/40 hover:bg-red-50"
                                    }>
                                        <td className="px-4 py-2.5 text-gray-400 text-xs">{row.rowIndex}</td>
                                        <td className="px-4 py-2.5 font-medium text-gray-800">{row.name || <span className="text-red-400 italic">—</span>}</td>
                                        <td className="px-4 py-2.5 capitalize text-gray-600">{row.type}</td>
                                        <td className="px-4 py-2.5 text-right">₹ {row.salePrice.toLocaleString("en-IN")}</td>
                                        <td className="px-4 py-2.5 text-right">₹ {row.purchasePrice.toLocaleString("en-IN")}</td>
                                        <td className="px-4 py-2.5 text-right">{row.taxRate}%</td>
                                        <td className="px-4 py-2.5 text-gray-600">{row.unit}</td>
                                        <td className="px-4 py-2.5 text-gray-600">{row.hsn || "—"}</td>
                                        <td className="px-4 py-2.5 text-right">{row.openingQty}</td>
                                        <td className="px-4 py-2.5"><StatusBadge status={row.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Footer actions */}
            <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
                <Button variant="outline" onClick={() => { setStep("upload"); setRows([]); }}>
                    Upload Different File
                </Button>
                <div className="flex items-center gap-3">
                    {errorCount > 0 && (
                        <p className="text-xs text-gray-500">{errorCount} row(s) with errors will be skipped.</p>
                    )}
                    <Button
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full px-10 py-5 font-semibold"
                        disabled={validCount === 0 || isImporting}
                        onClick={handleImport}
                    >
                        {isImporting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Importing...</> : `Import ${validCount} Item${validCount !== 1 ? "s" : ""}`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
