"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X, Printer, Download, Share2, MessageSquare, Mail, CreditCard, Landmark, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { fetchCompanies, fetchBankAccounts } from '@/lib/api';
import { format } from 'date-fns';

// Types
interface InvoicePreviewProps {
    isOpen: boolean;
    onClose: () => void;
    data: any; // The invoice data object
    type?: 'INVOICE' | 'PROFORMA' | 'ESTIMATE' | 'ORDER' | 'PURCHASE_ORDER' | 'PURCHASE_INVOICE' | 'DEBIT_NOTE' | 'EXPENSE' | 'PURCHASE_FA';
}

const classicThemes = [
    { id: 'tally', name: 'Tally Theme' },
    { id: 'gst1', name: 'GST Theme 1' },
    { id: 'gst3', name: 'GST Theme 3' },
    { id: 'doubleDivine', name: 'Double Divine' },
    { id: 'frenchElite', name: 'French Elite' },
    { id: 'landscape', name: 'Landscape Theme 1' },
    { id: 'landscape2', name: 'Landscape Theme 2' },
];
const vintageThemes = [
    { id: 'vintage1', name: 'Vintage Classic' },
];

const numberToWords = (num: number): string => {
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString().length > 9 ? parseFloat(num.toString().substring(0, 9)) : num) === 0) return 'zero';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';

    let str = '';
    str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'crore ' : '';
    str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'lakh ' : '';
    str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'thousand ' : '';
    str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'hundred ' : '';
    str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) : '';

    return str.trim();
};

const DOC_TITLES: Record<string, string> = {
    INVOICE: 'Tax Invoice',
    PROFORMA: 'Proforma Invoice',
    ESTIMATE: 'Estimate / Quotation',
    ORDER: 'Sale Order',
    PURCHASE_ORDER: 'Purchase Order',
    PURCHASE_INVOICE: 'Purchase Invoice',
    DEBIT_NOTE: 'Debit Note',
    EXPENSE: 'Expense',
    PURCHASE_FA: 'Purchase Fixed Assets',
};

export const InvoicePreview = ({ isOpen, onClose, data, type = 'INVOICE' }: InvoicePreviewProps) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const docTitle = DOC_TITLES[type] || 'Tax Invoice';
    const [activeTheme, setActiveTheme] = useState('tally');
    const [classicOpen, setClassicOpen] = useState(true);
    const [vintageOpen, setVintageOpen] = useState(false);
    const [themeColor, setThemeColor] = useState('#0ea5e9');
    const [showPreviewAgain, setShowPreviewAgain] = useState(true);
    const [company, setCompany] = useState<any>(data?.company || null);
    const [bankAccount, setBankAccount] = useState<any>(null);

    // Auto-fetch company and bank account details
    useEffect(() => {
        const src = data?.company || data?.companyId;
        let companyId: string | null = null;

        if (src && typeof src === 'object' && src._id) {
            setCompany(src);
            companyId = src._id;
        } else {
            companyId = (typeof src === 'string' ? src : null)
                || localStorage.getItem('activeCompanyId');
            if (companyId) {
                fetchCompanies().then((companies: any[]) => {
                    const found = companies.find((c: any) => c._id === companyId);
                    if (found) setCompany(found);
                }).catch(console.error);
            }
        }

        // Always fetch first bank account for this company to show on invoice
        if (companyId) {
            fetchBankAccounts(companyId).then((accounts: any[]) => {
                if (accounts.length > 0) setBankAccount(accounts[0]);
            }).catch(console.error);
        }
    }, [data?.company, data?.companyId]);

    const handlePrint = () => {
        const printContent = componentRef.current;
        if (printContent) {
            const originalContents = document.body.innerHTML;
            const printContents = printContent.innerHTML;

            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '0px';
            iframe.style.height = '0px';
            iframe.style.border = 'none';
            document.body.appendChild(iframe);

            const doc = iframe.contentWindow?.document;
            if (doc) {
                doc.write('<html><head><title>Print</title>');
                document.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
                    doc.write(node.outerHTML);
                });
                doc.write('<script src="https://cdn.tailwindcss.com"></script>');
                doc.write('</head><body class="bg-white p-0 m-0">'); // Removed padding for accurate print
                doc.write(printContents);
                doc.write('</body></html>');
                doc.close();
                iframe.contentWindow?.focus();

                setTimeout(() => {
                    iframe.contentWindow?.print();
                    document.body.removeChild(iframe);
                }, 500);
            }
        }
    };

    const generatePdf = async () => {
        const element = componentRef.current;
        if (!element) return null;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                onclone: (clonedDoc) => {
                    const colorCache = new Map<string, string>();
                    const oklchToRgb = (colorStr: string) => {
                        if (!colorStr || !colorStr.includes('oklch')) return colorStr;
                        if (colorCache.has(colorStr)) return colorCache.get(colorStr)!;
                        try {
                            const c = clonedDoc.createElement('canvas');
                            c.width = 1; c.height = 1;
                            const ctx = c.getContext('2d');
                            if (!ctx) return colorStr;
                            ctx.clearRect(0, 0, 1, 1);
                            ctx.fillStyle = colorStr;
                            ctx.fillRect(0, 0, 1, 1);
                            const data = ctx.getImageData(0, 0, 1, 1).data;
                            const a = data[3];
                            const result = a === 255 ? `rgb(${data[0]}, ${data[1]}, ${data[2]})` : `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${(a / 255).toFixed(2)})`;
                            colorCache.set(colorStr, result);
                            return result;
                        } catch (e) { return colorStr; }
                    };

                    const replaceOklch = (el: HTMLElement) => {
                        try {
                            const styles = clonedDoc.defaultView?.getComputedStyle(el);
                            if (styles) {
                                const parseColor = (prop: string, camelProp: any) => {
                                    const val = styles.getPropertyValue(prop);
                                    if (val && val.includes('oklch')) {
                                        el.style.setProperty(prop, oklchToRgb(val), 'important');
                                    }
                                };
                                parseColor('background-color', 'backgroundColor');
                                parseColor('color', 'color');
                                parseColor('border-top-color', 'borderTopColor');
                                parseColor('border-right-color', 'borderRightColor');
                                parseColor('border-bottom-color', 'borderBottomColor');
                                parseColor('border-left-color', 'borderLeftColor');
                            }
                        } catch (e) { }

                        for (let i = 0; i < el.children.length; i++) {
                            replaceOklch(el.children[i] as HTMLElement);
                        }
                    };

                    replaceOklch(clonedDoc.body);
                }
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth(); // 210
            const pdfHeight = pdf.internal.pageSize.getHeight(); // 297

            const imgProps = pdf.getImageProperties(imgData);
            const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = pdfImgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight; // Move image up
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImgHeight);
                heightLeft -= pdfHeight;
            }

            return pdf;
        } catch (e) {
            console.error("PDF Error", e);
            return null;
        }
    };

    const handleDownloadPdf = async () => {
        const pdf = await generatePdf();
        if (pdf) {
            pdf.save(`${type}_${data.invoiceNo || data.billNumber || 'Document'}.pdf`);
        }
    };

    const handlePrintPdf = async () => {
        const pdf = await generatePdf();
        if (pdf) {
            pdf.autoPrint();
            window.open(pdf.output('bloburl'), '_blank');
        }
    };

    // --- Mock Share Handlers ---
    const handleWhatsappShare = () => {
        const text = `Here is your ${type}: ${data.invoiceNo}. Total Amount: ${data.grandTotal}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleEmailShare = () => {
        window.open(`mailto:?subject=${type} - ${data.invoiceNo}&body=Please find attached...`, '_blank');
    };

    // --- Template Renders ---

    const LandscapeTemplate = () => (
        <div className="w-full h-full p-6 text-xs font-sans text-gray-900 border box-border bg-white">
            <div className="border border-black h-full flex flex-col">
                {/* Header Title */}
                <div className="text-center font-bold border-b border-black py-1 bg-gray-50 uppercase tracking-wider text-sm">
                    {type}
                </div>

                {/* Company & Invoice Details */}
                <div className="flex border-b border-black min-h-[120px]">
                    {/* Left: Company Details */}
                    <div className="w-[60%] p-4 border-r border-black flex gap-4">
                        <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-gray-400 font-bold border shrink-0">
                            LOGO
                        </div>
                        <div className="flex-1">
                            <h2 className="font-bold text-lg leading-tight mb-1">{data.companyName || "Your Company Name"}</h2>
                            <p className="uppercase text-[10px] text-gray-600 mb-2">{data.companyAddress || "SHOP NO 4, SAMDARIYA ADARSH COMPLEX, JABALPUR"}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                                <span><span className="font-semibold">Phone:</span> {data.companyPhone || "7987016325"}</span>
                                <span><span className="font-semibold">GSTIN:</span> {data.companyGst || "23DGYPS7184Q1Z0"}</span>
                            </div>
                            <p className="text-[11px] mt-1"><span className="font-semibold">State:</span> {data.stateOfSupply || "23-Madhya Pradesh"}</p>
                        </div>
                    </div>

                    {/* Right: Invoice Details */}
                    <div className="w-[40%] p-3 space-y-1 bg-white">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">{type} No:</span>
                            <span>{data.invoiceNo || data.refNo || "9876"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Date:</span>
                            <span>{data.invoiceDate ? new Date(data.invoiceDate).toLocaleDateString() : format(new Date(), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Time:</span>
                            <span>{data.invoiceTime || "04:17 PM"}</span>
                        </div>
                    </div>
                </div>

                {/* Bill To */}
                <div className="border-b border-black">
                    <div className="bg-gray-100 px-2 py-1 text-[11px] font-bold border-b border-black border-dashed">
                        {type} For:
                    </div>
                    <div className="p-2">
                        <p className="font-bold text-sm">{data.partyName}</p>
                        {data.billingAddress && <p className="text-gray-600">{data.billingAddress}</p>}
                        <p className="text-gray-600 mt-1">Contact No: {data.phone}</p>
                    </div>
                </div>

                {/* Items Table Header */}
                <div className="flex border-b border-black bg-gray-100 font-bold text-center text-[10px]">
                    <div className="w-8 border-r border-black p-1">#</div>
                    <div className="flex-1 border-r border-black p-1 text-left px-2">Item Name</div>
                    <div className="w-16 border-r border-black p-1">HSN/SAC</div>
                    <div className="w-12 border-r border-black p-1">Qty</div>
                    <div className="w-12 border-r border-black p-1">Unit</div>
                    <div className="w-20 border-r border-black p-1">Price/Unit</div>
                    <div className="w-20 border-r border-black p-1">GST</div>
                    <div className="w-24 p-1 text-right px-2">Amount</div>
                </div>

                {/* Items Rows */}
                <div className="flex-1 overflow-hidden min-h-[200px] relative">
                    {data.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex border-b border-gray-200 text-center text-[11px] h-8 items-center">
                            <div className="w-8 border-r border-black h-full flex items-center justify-center bg-gray-50">{idx + 1}</div>
                            <div className="flex-1 border-r border-black h-full flex items-center px-2 text-left font-medium">{item.name}</div>
                            <div className="w-16 border-r border-black h-full flex items-center justify-center">{item.hsn || "-"}</div>
                            <div className="w-12 border-r border-black h-full flex items-center justify-center">{item.quantity}</div>
                            <div className="w-12 border-r border-black h-full flex items-center justify-center lowercase">{item.unit}</div>
                            <div className="w-20 border-r border-black h-full flex items-center justify-end px-1">{item.priceUnit?.amount?.toFixed(2)}</div>
                            <div className="w-20 border-r border-black h-full flex flex-col justify-center text-[9px] leading-tight">
                                <span>{item.tax?.rate ? `${item.tax.rate}%` : "-"}</span>
                                {item.tax?.amount > 0 && <span className="text-gray-500">({item.tax.amount.toFixed(2)})</span>}
                            </div>
                            <div className="w-24 h-full flex items-center justify-end px-2 font-bold bg-gray-50">{item.amount?.toFixed(2)}</div>
                        </div>
                    ))}
                    {/* Vertical Lines Overlay for empty space */}
                    <div className="absolute inset-0 pointer-events-none flex h-full">
                        <div className="w-8 border-r border-black"></div>
                        <div className="flex-1 border-r border-black"></div>
                        <div className="w-16 border-r border-black"></div>
                        <div className="w-12 border-r border-black"></div>
                        <div className="w-12 border-r border-black"></div>
                        <div className="w-20 border-r border-black"></div>
                        <div className="w-20 border-r border-black"></div>
                        <div className="w-24"></div>
                    </div>
                </div>

                {/* GST Analysis & Footer */}
                <div className="flex border-t border-black h-auto">
                    {/* Left Side: Tax Breakdown, Terms, Bank */}
                    <div className="w-[65%] flex flex-col border-r border-black">
                        {/* Tax Table */}
                        <div className="border-b border-black text-[9px]">
                            <div className="flex border-b border-black bg-gray-100 font-bold text-center">
                                <div className="flex-1 p-1 border-r border-black">HSN/SAC</div>
                                <div className="flex-1 p-1 border-r border-black">Taxable Amt</div>
                                <div className="flex-1 p-1 border-r border-black">CGST</div>
                                <div className="flex-1 p-1 border-r border-black">SGST</div>
                                <div className="flex-1 p-1">Total Tax</div>
                            </div>
                            <div className="flex text-center h-6 items-center">
                                <div className="flex-1 p-1 border-r border-black h-full">-</div>
                                <div className="flex-1 p-1 border-r border-black h-full">{data.subTotal?.toFixed(2)}</div>
                                <div className="flex-1 p-1 border-r border-black h-full text-right px-1">
                                    {(data.totalTax / 2)?.toFixed(2) || "0.00"}
                                </div>
                                <div className="flex-1 p-1 border-r border-black h-full text-right px-1">
                                    {(data.totalTax / 2)?.toFixed(2) || "0.00"}
                                </div>
                                <div className="flex-1 p-1 h-full text-right px-1 font-bold">{data.totalTax?.toFixed(2)}</div>
                            </div>
                            {/* Total Row for Tax Table */}
                            <div className="flex border-t border-black bg-gray-50 font-bold text-center h-5 items-center">
                                <div className="flex-1 text-right pr-2 border-r border-black">Total</div>
                                <div className="flex-1 border-r border-black">{data.subTotal?.toFixed(2)}</div>
                                <div className="flex-1 border-r border-black">{(data.totalTax / 2)?.toFixed(2)}</div>
                                <div className="flex-1 border-r border-black">{(data.totalTax / 2)?.toFixed(2)}</div>
                                <div className="flex-1">{data.totalTax?.toFixed(2)}</div>
                            </div>
                        </div>

                        <div className="p-2 flex-grow">
                            <p className="font-bold underline mb-1 text-[10px]">Terms & Conditions:</p>
                            <p className="text-[9px] leading-tight text-gray-600">
                                1. Goods once sold will not be taken back.<br />
                                2. Interest @18% p.a. will be charged if payment is not made within due date.<br />
                                3. Subject to local jurisdiction.
                            </p>
                        </div>

                        <div className="p-2 border-t border-black flex gap-2 text-[10px]">
                            <div className="flex-1">
                                <p className="font-bold mb-1">Bank Details:</p>
                                <div className="grid grid-cols-[60px_1fr] gap-x-2">
                                    <span>Bank Name:</span><span className="font-bold uppercase">{bankAccount?.bankName || company?.bankName || '—'}</span>
                                    <span>Acc No:</span><span className="font-bold">{bankAccount?.accountNumber || company?.bankAccountNo || '—'}</span>
                                    <span>IFSC Code:</span><span className="font-bold uppercase">{bankAccount?.ifscCode || company?.bankIfsc || '—'}</span>
                                    <span>Acc Holder:</span><span className="font-bold uppercase">{bankAccount?.accountHolderName || company?.bankAccountHolder || '—'}</span>
                                </div>
                            </div>
                            <div className="ml-auto flex flex-col items-center justify-center gap-1 shrink-0">
                                {(bankAccount?.upiId || company?.upiId) ? (
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${encodeURIComponent(`upi://pay?pa=${bankAccount?.upiId || company?.upiId}&pn=${encodeURIComponent(bankAccount?.accountHolderName || company?.name || '')}&am=${data.grandTotal || ''}&cu=INR`)}`}
                                        alt="UPI QR"
                                        width={72}
                                        height={72}
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <div className="w-16 h-16 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-400 text-[7px] text-center leading-tight">
                                        <span className="text-base">📱</span>
                                        <span>Set UPI ID</span>
                                    </div>
                                )}
                                <span className="text-[7px] text-green-700 font-bold tracking-tight">UPI SCAN TO PAY</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Totals & Sign */}
                    <div className="w-[35%] flex flex-col">
                        <div className="p-2 space-y-1 text-[11px]">
                            <div className="flex justify-between">
                                <span>Sub Total</span>
                                <span className="font-bold">₹ {data.subTotal?.toFixed(2)}</span>
                            </div>
                            {data.totalTax > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax Amount</span>
                                    <span>+ ₹ {data.totalTax?.toFixed(2)}</span>
                                </div>
                            )}
                            {data.roundOff !== 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Round Off</span>
                                    <span>{data.roundOff > 0 ? '+' : ''} {data.roundOff}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t border-black pt-2 mt-2 font-bold text-sm bg-gray-50 -mx-2 px-2 py-2 border-b">
                                <span className="uppercase">Total Amount</span>
                                <span>₹ {data.grandTotal?.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="px-2 py-2 text-[10px] border-b border-black">
                            <span className="font-bold text-gray-500">Amount in Words:</span><br />
                            <span className="font-bold italic capitalize">{numberToWords(Math.round(data.grandTotal || 0))} Rupees Only</span>
                        </div>

                        <div className="flex-1 flex flex-col justify-end p-4 text-center">
                            <p className="text-[9px] mb-8 text-left">For <span className="font-bold">{data.companyName || "Company Name"}</span></p>
                            <p className="font-bold border-t border-black pt-1 text-[10px]">Authorized Signatory</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Simplified generic template (Existing)
    const GenericTemplate = () => (
        <div className={cn("w-full h-full p-8 text-sm", 'bg-white')}>
            {/* ... keeping existing content structure ... */}
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-4 mb-4">
                <div>
                    <h1 className="text-2xl font-bold uppercase text-gray-800">{type}</h1>
                    <div className="text-gray-500 mt-1">Ref: {data.refNo || data.invoiceNo || data.orderNumber}</div>
                </div>
                {/* ... existing header right ... */}
                <div className="text-right">
                    <h2 className="font-bold text-lg">Your Company Name</h2>
                    <p className="text-gray-600">Your Address Line 1</p>
                    <p className="text-gray-600">City, State, Zip</p>
                    <p className="text-gray-600">GSTIN: 29ABCDE1234F1Z5</p>
                </div>
            </div>

            {/* Bill To */}
            <div className="flex justify-between mb-8">
                <div className="border p-4 rounded-md w-[48%] bg-white/50">
                    <h3 className="font-bold text-gray-700 mb-2">Bill To:</h3>
                    <p className="font-semibold">{data.partyName}</p>
                    <p className="text-gray-600">Phone: {data.phone}</p>
                    {data.billingAddress && <p className="text-gray-600">{data.billingAddress}</p>}
                </div>
                <div className="border p-4 rounded-md w-[48%] bg-white/50 text-right">
                    <p><span className="font-semibold">{type} Date:</span> {data.invoiceDate ? new Date(data.invoiceDate).toLocaleDateString() : '-'}</p>
                    {data.dueDate && <p><span className="font-semibold">Due Date:</span> {new Date(data.dueDate).toLocaleDateString()}</p>}
                    <p><span className="font-semibold">Place of Supply:</span> {data.stateOfSupply || '-'}</p>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full border-collapse border border-gray-300 mb-6">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 p-2 text-left w-12">#</th>
                        <th className="border border-gray-300 p-2 text-left">Item Name</th>
                        <th className="border border-gray-300 p-2 text-right">Qty</th>
                        <th className="border border-gray-300 p-2 text-right">Unit</th>
                        <th className="border border-gray-300 p-2 text-right">Price/Unit</th>
                        <th className="border border-gray-300 p-2 text-right">Disc</th>
                        <th className="border border-gray-300 p-2 text-right">GST</th>
                        <th className="border border-gray-300 p-2 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items?.map((item: any, idx: number) => (
                        <tr key={idx}>
                            <td className="border border-gray-300 p-2">{idx + 1}</td>
                            <td className="border border-gray-300 p-2">{item.name}</td>
                            <td className="border border-gray-300 p-2 text-right">{item.quantity}</td>
                            <td className="border border-gray-300 p-2 text-right">{item.unit}</td>
                            <td className="border border-gray-300 p-2 text-right">{item.priceUnit?.amount?.toFixed(2)}</td>
                            <td className="border border-gray-300 p-2 text-right">{item.discount?.amount > 0 ? item.discount.amount : (item.discount?.percent ? `${item.discount.percent}%` : '-')}</td>
                            <td className="border border-gray-300 p-2 text-right">{item.tax?.rate ? `${item.tax.rate}%` : '-'}</td>
                            <td className="border border-gray-300 p-2 text-right font-medium">{item.amount?.toFixed(2)}</td>
                        </tr>
                    ))}
                    {/* Minimum rows filler */}
                    {Array.from({ length: Math.max(0, 5 - (data.items?.length || 0)) }).map((_, i) => (
                        <tr key={`empty-${i}`}>
                            <td className="border border-gray-300 p-2">&nbsp;</td>
                            <td className="border border-gray-300 p-2"></td>
                            <td className="border border-gray-300 p-2"></td>
                            <td className="border border-gray-300 p-2"></td>
                            <td className="border border-gray-300 p-2"></td>
                            <td className="border border-gray-300 p-2"></td>
                            <td className="border border-gray-300 p-2"></td>
                            <td className="border border-gray-300 p-2"></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-1/2 border border-gray-300 rounded-md p-4 bg-white/50">
                    <div className="flex justify-between mb-2">
                        <span>Sub Total:</span>
                        <span className="font-semibold">{data.subTotal?.toFixed(2) || data.amount?.toFixed(2) || data.grandTotal?.toFixed(2)}</span>
                    </div>
                    {data.totalTax > 0 && (
                        <div className="flex justify-between mb-2">
                            <span>Tax:</span>
                            <span>{data.totalTax.toFixed(2)}</span>
                        </div>
                    )}
                    {data.roundOff !== 0 && (
                        <div className="flex justify-between mb-2">
                            <span>Round Off:</span>
                            <span>{data.roundOff}</span>
                        </div>
                    )}
                    <div className="flex justify-between border-t pt-2 mt-2 text-lg font-bold">
                        <span>Grand Total:</span>
                        <span>₹ {data.grandTotal?.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-right italic">
                        (amount in words)
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t flex justify-between items-end">
                <div className="text-xs text-gray-500 max-w-[60%]">
                    <p className="font-bold">Terms & Conditions:</p>
                    <p>1. Goods once sold will not be taken back.</p>
                    <p>2. Interest @18% p.a. will be charged if payment is not made within due date.</p>
                </div>
                <div className="text-center">
                    <div className="h-16 mb-2"></div> {/* Sign placeholder */}
                    <p className="font-bold border-t px-8 pt-1">Authorized Signatory</p>
                </div>
            </div>
        </div>
    );

    // --- Landscape Theme 2 (Matching Screenshot) ---
    const LandscapeTemplate2 = () => {
        const totalQty = data.items.reduce((sum: number, i: any) => sum + (Number(i.quantity) || 0), 0);

        return (
            <div className="w-full h-full p-6 text-[10px] font-sans text-gray-900 bg-white box-border">
                <div className="border border-black h-full flex flex-col">
                    {/* Header Title */}
                    <div className="text-center font-bold border-b border-black py-1 bg-gray-50 uppercase tracking-widest text-xs">
                        {type}
                    </div>

                    {/* Top Section: Company & Invoice Info */}
                    <div className="flex border-b border-black min-h-[100px]">
                        {/* Company Details (60%) */}
                        <div className="w-[60%] p-2 border-r border-black flex gap-3">
                            <div className="w-16 h-16 bg-gray-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                LOGO
                            </div>
                            <div className="flex-1">
                                <h2 className="font-bold text-sm mb-1">{data.companyName || "xyz"}</h2>
                                <p className="text-[9px] text-gray-700 mb-1">{data.companyAddress || "SHOP NO 4, SAMDARIYA ADARSH COMPLEX, JABALPUR"}</p>
                                <div className="flex flex-wrap gap-x-4">
                                    <span>Phone: <span className="font-semibold">{data.companyPhone || "7987016325"}</span></span>
                                    <span>GSTIN: <span className="font-semibold">{data.companyGst || "23DGYPS7184Q1Z0"}</span></span>
                                </div>
                                <p>State: <span className="font-semibold">{data.stateOfSupply || "23-Madhya Pradesh"}</span></p>
                            </div>
                        </div>

                        {/* Invoice Details (40%) */}
                        <div className="w-[40%] p-2 bg-white">
                            <div className="grid grid-cols-2 gap-y-1">
                                <span className="font-semibold">{type} No:</span>
                                <span>{data.refNo || data.invoiceNo || "9876"}</span>

                                <span className="font-semibold">Date:</span>
                                <span>{data.invoiceDate ? new Date(data.invoiceDate).toLocaleDateString() : format(new Date(), 'dd/MM/yyyy')}</span>

                                <span className="font-semibold">Time:</span>
                                <span>{data.invoiceTime || "04:17 PM"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Party Details */}
                    <div className="border-b border-black p-2 bg-white">
                        <div className="font-bold text-gray-600 mb-1">{type} For:</div>
                        <div className="font-bold text-sm uppercase">{data.partyName}</div>
                        {data.billingAddress && <div>{data.billingAddress}</div>}
                        <div className="mt-1">Contact No: <span className="font-semibold">{data.phone}</span></div>
                    </div>

                    {/* Items Table */}
                    <div className="flex-1 flex flex-col">
                        {/* Table Header */}
                        <div className="flex border-b border-black bg-gray-100 font-bold text-center h-8 items-center border-t border-black">
                            <div className="w-8 border-r border-black h-full flex items-center justify-center">#</div>
                            <div className="flex-1 border-r border-black h-full flex items-center px-2">Item Name</div>
                            <div className="w-16 border-r border-black h-full flex items-center justify-center">HSN/ SAC</div>
                            <div className="w-12 border-r border-black h-full flex items-center justify-center">Quantity</div>
                            <div className="w-12 border-r border-black h-full flex items-center justify-center">Unit</div>
                            <div className="w-20 border-r border-black h-full flex items-center justify-center">Price/ Unit(₹)</div>
                            <div className="w-24 border-r border-black h-full flex items-center justify-center">GST(₹)</div>
                            <div className="w-24 h-full flex items-center justify-center">Amount(₹)</div>
                        </div>

                        {/* Rows */}
                        <div className="flex-1 overflow-hidden relative min-h-[150px]">
                            {data.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex border-b border-gray-200 text-center text-[10px] items-start">
                                    <div className="w-8 border-r border-black min-h-[30px] flex items-center justify-center bg-gray-50">{idx + 1}</div>
                                    <div className="flex-1 border-r border-black min-h-[30px] flex items-center px-2 text-left">{item.name}</div>
                                    <div className="w-16 border-r border-black min-h-[30px] flex items-center justify-center">{item.hsn}</div>
                                    <div className="w-12 border-r border-black min-h-[30px] flex items-center justify-center">{item.quantity}</div>
                                    <div className="w-12 border-r border-black min-h-[30px] flex items-center justify-center lowercase">{item.unit}</div>
                                    <div className="w-20 border-r border-black min-h-[30px] flex items-center justify-end px-2">{item.priceUnit?.amount?.toFixed(2)}</div>
                                    <div className="w-24 border-r border-black min-h-[30px] flex items-center justify-end px-2">
                                        {item.tax?.amount > 0 ? `${item.tax.amount.toFixed(2)} (${item.tax.rate}%)` : '-'}
                                    </div>
                                    <div className="w-24 min-h-[30px] flex items-center justify-end px-2 font-bold">{item.amount?.toFixed(2)}</div>
                                </div>
                            ))}

                            {/* Vertical Line Overlay (to maintain column structure on empty space) */}
                            <div className="absolute inset-0 pointer-events-none flex h-full z-0">
                                <div className="w-8 border-r border-black"></div>
                                <div className="flex-1 border-r border-black"></div>
                                <div className="w-16 border-r border-black"></div>
                                <div className="w-12 border-r border-black"></div>
                                <div className="w-12 border-r border-black"></div>
                                <div className="w-20 border-r border-black"></div>
                                <div className="w-24 border-r border-black"></div>
                                <div className="w-24"></div>
                            </div>
                        </div>

                        {/* Items Total Row */}
                        <div className="flex border-t border-b border-black font-bold h-7 items-center bg-gray-50 z-10 relative">
                            <div className="w-8 border-r border-black h-full"></div>
                            <div className="flex-1 border-r border-black h-full flex items-center px-2">Total</div>
                            <div className="w-16 border-r border-black h-full"></div>
                            <div className="w-12 border-r border-black h-full flex items-center justify-center">{totalQty}</div>
                            <div className="w-12 border-r border-black h-full"></div>
                            <div className="w-20 border-r border-black h-full"></div>
                            <div className="w-24 border-r border-black h-full flex items-center justify-end px-2">{data.totalTax?.toFixed(2)}</div>
                            <div className="w-24 h-full flex items-center justify-end px-2">{data.subTotal?.toFixed(2)}</div>
                        </div>

                        {/* Tax Analysis Table */}
                        <div className="flex border-b border-black">
                            <div className="w-full">
                                {/* Tax Headers */}
                                <div className="flex bg-gray-100 font-bold text-center border-b border-black h-8 text-[9px]">
                                    <div className="flex-[1.5] border-r border-black flex items-center justify-center">HSN/ SAC</div>
                                    <div className="flex-[2] border-r border-black flex items-center justify-center">Taxable Amount (₹)</div>
                                    <div className="flex-[2.5] border-r border-black flex flex-col">
                                        <div className="border-b border-black h-full flex items-center justify-center">CGST</div>
                                        <div className="flex h-full">
                                            <div className="w-1/2 border-r border-black flex items-center justify-center">Rate(%)</div>
                                            <div className="w-1/2 flex items-center justify-center">Amt (₹)</div>
                                        </div>
                                    </div>
                                    <div className="flex-[2.5] border-r border-black flex flex-col">
                                        <div className="border-b border-black h-full flex items-center justify-center">SGST</div>
                                        <div className="flex h-full">
                                            <div className="w-1/2 border-r border-black flex items-center justify-center">Rate(%)</div>
                                            <div className="w-1/2 flex items-center justify-center">Amt (₹)</div>
                                        </div>
                                    </div>
                                    <div className="flex-[1.5] flex items-center justify-center">Total Tax (₹)</div>
                                </div>

                                {/* Tax Data - Mocking one row for now effectively */}
                                <div className="flex text-center h-6 text-[9px]">
                                    <div className="flex-[1.5] border-r border-black flex items-center justify-center">123</div>
                                    <div className="flex-[2] border-r border-black flex items-center justify-end px-2">{data.subTotal?.toFixed(2)}</div>
                                    <div className="flex-[2.5] border-r border-black flex">
                                        <div className="w-1/2 border-r border-black flex items-center justify-center">9</div>
                                        <div className="w-1/2 flex items-center justify-end px-2">{(data.totalTax / 2)?.toFixed(2)}</div>
                                    </div>
                                    <div className="flex-[2.5] border-r border-black flex">
                                        <div className="w-1/2 border-r border-black flex items-center justify-center">9</div>
                                        <div className="w-1/2 flex items-center justify-end px-2">{(data.totalTax / 2)?.toFixed(2)}</div>
                                    </div>
                                    <div className="flex-[1.5] flex items-center justify-end px-2">{data.totalTax?.toFixed(2)}</div>
                                </div>
                                <div className="flex text-center font-bold border-t border-black h-6 text-[9px]">
                                    <div className="flex-[1.5] border-r border-black flex items-center justify-end px-2">TOTAL</div>
                                    <div className="flex-[2] border-r border-black flex items-center justify-end px-2">{data.subTotal?.toFixed(2)}</div>
                                    <div className="flex-[2.5] border-r border-black flex">
                                        <div className="w-1/2 border-r border-black"></div>
                                        <div className="w-1/2 flex items-center justify-end px-2">{(data.totalTax / 2)?.toFixed(2)}</div>
                                    </div>
                                    <div className="flex-[2.5] border-r border-black flex">
                                        <div className="w-1/2 border-r border-black"></div>
                                        <div className="w-1/2 flex items-center justify-end px-2">{(data.totalTax / 2)?.toFixed(2)}</div>
                                    </div>
                                    <div className="flex-[1.5] flex items-center justify-end px-2">{data.totalTax?.toFixed(2)}</div>
                                </div>
                            </div>

                            {/* Empty space filler for alignment if needed or SubTotal summary sidebar */}
                            <div className="w-[30%] border-l border-black flex flex-col">
                                <div className="flex justify-between px-2 pt-1">
                                    <span>Sub Total</span><span>:</span> <span className="font-bold">{data.subTotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between px-2 pt-1 border-t border-black mt-auto font-bold bg-gray-100">
                                    <span>Total</span><span>:</span> <span>{data.grandTotal?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="flex h-auto border-t-0">
                            {/* Left: Terms & Bank */}
                            <div className="w-[70%] border-r border-black p-2 flex flex-col justify-between">
                                <div className="flex mb-2">
                                    <div className="w-full text-[9px]">
                                        <div className="flex border-b border-black pb-1 mb-1">
                                            <span className="font-bold whitespace-nowrap mr-2">Estimate Amount in Words :</span>
                                            <span className="font-bold italic capitalize flex-1">{numberToWords(Math.round(data.grandTotal || 0))} Rupees Only</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <p className="font-bold underline text-[9px]">Terms & Conditions:</p>
                                    <p className="text-[9px] text-gray-600">Thanks for doing business with us!</p>
                                </div>

                                <div className="flex gap-2 text-[9px] border border-black p-1">
                                    <div className="flex-1 grid grid-cols-[auto_1fr] gap-x-2 content-start">
                                        <div className="col-span-2 font-bold underline mb-1">Bank Details:</div>
                                        <span>Bank Name:</span><span className="font-bold uppercase">{bankAccount?.bankName || company?.bankName || '—'}</span>
                                        <span>Account No:</span><span className="font-bold">{bankAccount?.accountNumber || company?.bankAccountNo || '—'}</span>
                                        <span>IFSC Code:</span><span className="font-bold uppercase">{bankAccount?.ifscCode || company?.bankIfsc || '—'}</span>
                                        <span>Account Holder:</span><span className="font-bold uppercase">{bankAccount?.accountHolderName || company?.bankAccountHolder || '—'}</span>
                                    </div>
                                    {/* UPI QR — always visible */}
                                    <div className="flex flex-col items-center justify-center gap-1 shrink-0">
                                        {(bankAccount?.upiId || company?.upiId) ? (
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`upi://pay?pa=${bankAccount?.upiId || company?.upiId}&pn=${encodeURIComponent(bankAccount?.accountHolderName || company?.name || '')}&am=${data.grandTotal || ''}&cu=INR`)}`}
                                                alt="UPI QR"
                                                width={80}
                                                height={80}
                                                crossOrigin="anonymous"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-400 text-[7px] text-center leading-tight">
                                                <span className="text-lg mb-0.5">📱</span>
                                                <span>Set UPI ID</span>
                                                <span>to enable QR</span>
                                            </div>
                                        )}
                                        <span className="text-[7px] text-green-700 font-bold tracking-tight">UPI SCAN TO PAY</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Signature */}
                            <div className="w-[30%] flex flex-col p-2 text-center justify-between">
                                <div className="text-left text-[9px]">For <span className="font-bold">xyz</span>:</div>
                                <div className="mt-8 border-t border-gray-400 w-3/4 mx-auto pt-1 text-[9px]">Authorized Signatory</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- GST Theme 1 ---
    const GstTheme1Template = () => {
        const companyName = company?.name || data.companyName || 'Your Company';
        const companyAddress = company?.address || data.companyAddress || '';
        const companyPhone = company?.phone || data.companyPhone || '';
        const companyGst = company?.gstNumber || data.companyGst || '';
        const stateOfSupply = company?.state || data.stateOfSupply || '';
        const totalQty = (data.items || []).reduce((s: number, i: any) => s + (Number(i.quantity) || 0), 0);
        const totalGst = (data.items || []).reduce((s: number, i: any) => s + (Number(i.tax?.amount) || 0), 0);
        const totalAmt = (data.items || []).reduce((s: number, i: any) => s + (Number(i.amount) || 0), 0);
        const subTotal = data.subTotal ?? totalAmt;
        const grandTotal = data.grandTotal ?? totalAmt;
        const received = data.received || 0;
        const cgst = (data.totalTax || totalGst) / 2;
        const sgst = (data.totalTax || totalGst) / 2;

        return (
            <div className="w-full h-full p-0 text-[10px] font-sans text-gray-900 bg-white">
                {/* Company Header */}
                <div className="flex justify-between items-start px-5 pt-4 pb-3 border-b border-gray-300">
                    <div>
                        <div className="font-bold text-base leading-tight">{companyName}</div>
                        <div className="text-[9px] text-gray-600 mt-0.5 uppercase max-w-xs">{companyAddress}</div>
                        {companyPhone && <div className="mt-0.5 text-[9px]">Phone no. : {companyPhone}</div>}
                        {companyGst && <div className="text-[9px]">GSTIN : {companyGst}</div>}
                        {stateOfSupply && <div className="text-[9px]">State: {stateOfSupply}</div>}
                    </div>
                    <div className="w-16 h-16 bg-gray-300 flex items-center justify-center text-gray-500 font-bold text-xs border border-gray-400 shrink-0 ml-4">
                        LOGO
                    </div>
                </div>

                {/* Doc Title */}
                <div className="text-center font-bold text-sm py-2" style={{ color: themeColor }}>
                    {docTitle}
                </div>

                {/* Bill To / Invoice Details */}
                <div className="flex border-t border-b border-gray-300">
                    <div className="w-[55%] border-r border-gray-300 px-4 py-2">
                        <div className="font-semibold text-[9px] text-gray-500 mb-1">Bill To</div>
                        <div className="font-bold text-sm">{data.partyName || '—'}</div>
                        {data.billingAddress && <div className="text-[9px] text-gray-600 mt-0.5">{data.billingAddress}</div>}
                        {data.phone && <div className="text-[9px] mt-0.5">Ph: {data.phone}</div>}
                    </div>
                    <div className="w-[45%] px-4 py-2">
                        <div className="font-semibold text-[9px] text-gray-500 mb-1">Invoice Details</div>
                        <div className="grid grid-cols-[auto_1fr] gap-x-2 text-[9px]">
                            <span>Invoice No. :</span><span className="font-semibold">{data.invoiceNo || data.refNo || '—'}</span>
                            <span>Date :</span><span>{data.invoiceDate ? format(new Date(data.invoiceDate), 'dd-MM-yyyy') : format(new Date(), 'dd-MM-yyyy')}</span>
                            <span>Time :</span><span>{data.invoiceTime || format(new Date(), 'hh:mm a')}</span>
                            {stateOfSupply && <><span>Place of supply:</span><span>{stateOfSupply}</span></>}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full border-collapse text-[9px]">
                    <thead>
                        <tr style={{ backgroundColor: themeColor }} className="text-white font-semibold">
                            <th className="px-1 py-1.5 text-center w-6">#</th>
                            <th className="px-2 py-1.5 text-left">Item name</th>
                            <th className="px-1 py-1.5 text-center w-14">HSN/ SAC</th>
                            <th className="px-1 py-1.5 text-center w-12">Quantity</th>
                            <th className="px-1 py-1.5 text-center w-10">Unit</th>
                            <th className="px-1 py-1.5 text-center w-16">Price/ Unit</th>
                            <th className="px-1 py-1.5 text-center w-20">GST</th>
                            <th className="px-1 py-1.5 text-right w-16">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data.items || []).map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-gray-200">
                                <td className="px-1 py-1 text-center">{idx + 1}</td>
                                <td className="px-2 py-1 font-semibold">{item.name}</td>
                                <td className="px-1 py-1 text-center">{item.hsn || ''}</td>
                                <td className="px-1 py-1 text-center">{item.quantity}</td>
                                <td className="px-1 py-1 text-center">{item.unit}</td>
                                <td className="px-1 py-1 text-right">₹ {item.priceUnit?.amount?.toFixed(2)}</td>
                                <td className="px-1 py-1 text-right">
                                    {item.tax?.amount > 0 ? `₹ ${item.tax.amount.toFixed(2)} (${item.tax.rate}%)` : '—'}
                                </td>
                                <td className="px-1 py-1 text-right font-bold">₹ {item.amount?.toFixed(2)}</td>
                            </tr>
                        ))}
                        {/* Total row */}
                        <tr className="border-t border-b border-gray-400 font-bold bg-gray-50">
                            <td></td>
                            <td className="px-2 py-1">Total</td>
                            <td></td>
                            <td className="px-1 py-1 text-center">{totalQty}</td>
                            <td></td>
                            <td></td>
                            <td className="px-1 py-1 text-right">₹ {(totalGst || data.totalTax || 0).toFixed(2)}</td>
                            <td className="px-1 py-1 text-right">₹ {totalAmt.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Bottom Section */}
                <div className="flex border-t border-gray-300">
                    {/* Left: Amount in words + Terms + Bank */}
                    <div className="w-[55%] border-r border-gray-300 px-4 py-3 flex flex-col gap-3">
                        <div>
                            <div className="font-bold text-[10px] mb-0.5">Invoice Amount In Words</div>
                            <div className="italic capitalize text-[9px]">{numberToWords(Math.round(grandTotal))} Rupees only</div>
                        </div>
                        <div>
                            <div className="font-bold text-[10px] mb-0.5">Terms and Conditions</div>
                            <div className="text-[9px] text-gray-600">Thanks for doing business with us!</div>
                        </div>
                        <div className="mt-auto pt-2 border-t border-gray-200 text-[9px]">
                            <div className="font-bold mb-1">Pay To:</div>
                            {bankAccount?.bankName && <div>Bank Name : {bankAccount.bankName}</div>}
                            {bankAccount?.accountNumber && <div>Bank Account No. : {bankAccount.accountNumber}</div>}
                            {bankAccount?.ifscCode && <div>Bank IFSC code : {bankAccount.ifscCode}</div>}
                            {bankAccount?.accountHolderName && <div>Account holder&apos;s name : {bankAccount.accountHolderName}</div>}
                        </div>
                    </div>

                    {/* Right: Totals */}
                    <div className="w-[45%] px-3 py-3">
                        <div className="space-y-0.5 text-[10px]">
                            <div className="flex justify-between py-0.5 border-b border-gray-100">
                                <span>Sub Total</span>
                                <span>₹ {subTotal.toFixed(2)}</span>
                            </div>
                            {sgst > 0 && (
                                <div className="flex justify-between py-0.5 border-b border-gray-100">
                                    <span>SGST@{(data.items?.[0]?.tax?.rate / 2 || 9)}%</span>
                                    <span>₹ {sgst.toFixed(2)}</span>
                                </div>
                            )}
                            {cgst > 0 && (
                                <div className="flex justify-between py-0.5 border-b border-gray-100">
                                    <span>CGST@{(data.items?.[0]?.tax?.rate / 2 || 9)}%</span>
                                    <span>₹ {cgst.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-1 font-bold text-white rounded px-2 -mx-2" style={{ backgroundColor: themeColor }}>
                                <span>Total</span>
                                <span>₹ {grandTotal.toFixed(2)}</span>
                            </div>
                            {received > 0 && (
                                <div className="flex justify-between py-0.5 border-b border-gray-100">
                                    <span>Received</span>
                                    <span>₹ {received.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-0.5 border-b border-gray-100">
                                <span>Balance</span>
                                <span>₹ {(grandTotal - received).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-0.5 text-gray-500">
                                <span>Available Points</span>
                                <span>0</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between items-end text-[9px]">
                            <span>For :{companyName}</span>
                            <div className="text-center">
                                <div className="mt-6 border-t border-gray-400 pt-1 font-bold">Authorized Signatory</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- Tally Theme ---
    const TallyTemplate = () => {
        const items = data.items || [];
        const totalQty = items.reduce((s: number, i: any) => s + (Number(i.quantity) || 0), 0);
        const totalAmt = items.reduce((s: number, i: any) => s + (Number(i.amount) || 0), 0);
        const subTotal = data.subTotal ?? totalAmt;
        const grandTotal = data.grandTotal ?? totalAmt;
        const received = data.received || 0;
        const balance = grandTotal - received;
        const companyName = company?.name || data.companyName || 'Your Company';
        const companyAddress = company?.address || data.companyAddress || '';
        const companyPhone = company?.phone || data.companyPhone || '';
        const companyGst = company?.gstNumber || data.companyGst || '';
        const stateOfSupply = company?.state || data.stateOfSupply || '';
        // fill empty rows so table always looks full
        const MIN_ROWS = 6;
        const emptyRows = Math.max(0, MIN_ROWS - items.length);

        return (
            <div className="w-full font-sans text-[10px] text-gray-900 bg-white border-2 border-black">

                {/* Title */}
                <div className="text-center font-bold tracking-widest uppercase py-1.5 border-b-2 border-black text-[11px]">
                    {docTitle.toUpperCase()}
                </div>

                {/* Company + Invoice Details */}
                <div className="flex border-b border-black">
                    <div className="flex-1 border-r border-black p-3 flex gap-3">
                        <div className="w-14 h-14 bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-[9px] shrink-0 border border-gray-300">
                            LOGO
                        </div>
                        <div className="flex-1 text-[10px]">
                            <div className="font-bold text-sm leading-snug">{companyName}</div>
                            {companyAddress && <div className="text-gray-600 mt-0.5">{companyAddress}</div>}
                            {companyPhone && <div className="mt-0.5">Mobile: <span className="font-semibold">{companyPhone}</span></div>}
                            {companyGst && <div>GSTIN: <span className="font-semibold">{companyGst}</span></div>}
                            {stateOfSupply && <div>State: <span className="font-semibold">{stateOfSupply}</span></div>}
                        </div>
                    </div>
                    <div className="w-[38%] p-3 text-[10px]">
                        <div className="flex gap-1 mb-1">
                            <span className="text-gray-500 w-24 shrink-0">Invoice No:</span>
                            <span className="font-semibold">{data.invoiceNo || data.refNo || '—'}</span>
                        </div>
                        <div className="flex gap-1 mb-1">
                            <span className="text-gray-500 w-24 shrink-0">Dated:</span>
                            <span className="font-semibold">{data.invoiceDate ? format(new Date(data.invoiceDate), 'dd-MMM-yy') : format(new Date(), 'dd-MMM-yy')}</span>
                        </div>
                        {data.dueDate && (
                            <div className="flex gap-1 mb-1">
                                <span className="text-gray-500 w-24 shrink-0">Due Date:</span>
                                <span className="font-semibold">{format(new Date(data.dueDate), 'dd-MMM-yy')}</span>
                            </div>
                        )}
                        <div className="flex gap-1">
                            <span className="text-gray-500 w-24 shrink-0">Place of Supply:</span>
                            <span className="font-semibold">{stateOfSupply || '—'}</span>
                        </div>
                    </div>
                </div>

                {/* Bill To / Ship To */}
                <div className="flex border-b border-black">
                    <div className="w-1/2 border-r border-black px-3 py-2">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">BILL TO</div>
                        <div className="font-bold text-sm">{data.partyName || '—'}</div>
                        {data.billingAddress && <div className="text-[9px] text-gray-600 mt-0.5">{data.billingAddress}</div>}
                        {data.phone && <div className="mt-0.5">Ph: <span className="font-semibold">{data.phone}</span></div>}
                        {data.partyGst && <div>GSTIN: <span className="font-semibold">{data.partyGst}</span></div>}
                    </div>
                    <div className="w-1/2 px-3 py-2">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">SHIP TO</div>
                        <div className="font-bold text-sm">{data.partyName || '—'}</div>
                        {(data.shippingAddress || data.billingAddress) && (
                            <div className="text-[9px] text-gray-600 mt-0.5">{data.shippingAddress || data.billingAddress}</div>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full border-collapse text-[10px]">
                    <thead>
                        <tr className="border-b border-black bg-gray-50">
                            <th className="border-r border-black text-center px-1 py-1.5 w-7 font-semibold">#</th>
                            <th className="border-r border-black text-left px-2 py-1.5 font-semibold">Item Name</th>
                            <th className="border-r border-black text-center px-1 py-1.5 w-16 font-semibold">HSN/SAC</th>
                            <th className="border-r border-black text-right px-2 py-1.5 w-14 font-semibold">Quantity</th>
                            <th className="border-r border-black text-center px-1 py-1.5 w-10 font-semibold">Unit</th>
                            <th className="border-r border-black text-right px-2 py-1.5 w-20 font-semibold">Price/Unit</th>
                            <th className="text-right px-2 py-1.5 w-20 font-semibold">Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-gray-200">
                                <td className="border-r border-black text-center px-1 py-1.5">{idx + 1}</td>
                                <td className="border-r border-black px-2 py-1.5">{item.name}</td>
                                <td className="border-r border-black text-center px-1 py-1.5">{item.hsn || '—'}</td>
                                <td className="border-r border-black text-right px-2 py-1.5">{item.quantity}</td>
                                <td className="border-r border-black text-center px-1 py-1.5 lowercase">{item.unit}</td>
                                <td className="border-r border-black text-right px-2 py-1.5">{Number(item.priceUnit?.amount || 0).toFixed(2)}</td>
                                <td className="text-right px-2 py-1.5 font-bold">{Number(item.amount || 0).toFixed(2)}</td>
                            </tr>
                        ))}
                        {Array.from({ length: emptyRows }).map((_, i) => (
                            <tr key={`e-${i}`} className="border-b border-gray-100">
                                <td className="border-r border-black px-1 py-2">&nbsp;</td>
                                <td className="border-r border-black px-2 py-2"></td>
                                <td className="border-r border-black px-1 py-2"></td>
                                <td className="border-r border-black px-2 py-2"></td>
                                <td className="border-r border-black px-1 py-2"></td>
                                <td className="border-r border-black px-2 py-2"></td>
                                <td className="px-2 py-2"></td>
                            </tr>
                        ))}
                        {/* Total row */}
                        <tr className="border-t border-b border-black font-bold bg-gray-50">
                            <td className="border-r border-black px-1 py-1.5"></td>
                            <td className="border-r border-black px-2 py-1.5">Total</td>
                            <td className="border-r border-black px-1 py-1.5"></td>
                            <td className="border-r border-black text-right px-2 py-1.5">{totalQty}</td>
                            <td className="border-r border-black px-1 py-1.5"></td>
                            <td className="border-r border-black px-2 py-1.5"></td>
                            <td className="text-right px-2 py-1.5">{totalAmt.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Bottom split: Left (words+terms+bank) | Right (totals) */}
                <div className="flex border-t border-black">
                    {/* Left panel */}
                    <div className="flex-1 border-r border-black flex flex-col text-[9px]">
                        {/* Amount in words */}
                        <div className="px-3 py-2 border-b border-black">
                            <span className="font-bold">Amount Chargeable (in words): </span>
                            <span className="italic capitalize">{numberToWords(Math.round(grandTotal))} Rupees Only</span>
                        </div>

                        {/* Terms */}
                        <div className="px-3 py-2 border-b border-black">
                            <div className="font-bold underline mb-1">Terms &amp; Conditions:</div>
                            <div>1. Goods once sold will not be taken back.</div>
                            <div>2. Interest @18% p.a. if not paid within due date.</div>
                            <div>3. Subject to local jurisdiction.</div>
                        </div>

                        {/* Bank + QR */}
                        <div className="px-3 py-2 border-b border-black flex gap-3">
                            <div className="flex-1">
                                <div className="font-bold underline mb-1">Bank Details:</div>
                                <div className="flex gap-1"><span className="w-12 shrink-0">Bank:</span><span className="font-bold uppercase">{bankAccount?.bankName || '—'}</span></div>
                                <div className="flex gap-1"><span className="w-12 shrink-0">A/c No:</span><span className="font-bold">{bankAccount?.accountNumber || '—'}</span></div>
                                <div className="flex gap-1"><span className="w-12 shrink-0">IFSC:</span><span className="font-bold uppercase">{bankAccount?.ifscCode || '—'}</span></div>
                                <div className="flex gap-1"><span className="w-12 shrink-0">Holder:</span><span className="font-bold uppercase">{bankAccount?.accountHolderName || '—'}</span></div>
                            </div>
                            <div className="flex flex-col items-center justify-center shrink-0">
                                {(bankAccount?.upiId || company?.upiId) ? (
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${encodeURIComponent(`upi://pay?pa=${bankAccount?.upiId || company?.upiId}&pn=${encodeURIComponent(bankAccount?.accountHolderName || company?.name || '')}&am=${grandTotal}&cu=INR`)}`}
                                        alt="UPI QR" width={72} height={72} crossOrigin="anonymous"
                                    />
                                ) : (
                                    <div className="w-16 h-16 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-400 text-[7px] text-center leading-tight">
                                        <span className="text-base">📱</span><span>Set UPI ID</span>
                                    </div>
                                )}
                                <span className="text-[7px] text-green-700 font-bold mt-0.5">UPI SCAN TO PAY</span>
                            </div>
                        </div>

                        {/* Signatory */}
                        <div className="px-3 py-2 text-[9px]">
                            <div>For <span className="font-bold">{companyName}</span></div>
                            <div className="mt-10 border-t border-black w-32 pt-0.5">Authorized Signatory</div>
                        </div>
                    </div>

                    {/* Right: Totals */}
                    <div className="w-48 flex flex-col text-[10px]">
                        <div className="flex justify-between items-center px-3 py-1.5 border-b border-black">
                            <span className="text-gray-600">Sub Total</span>
                            <span className="font-semibold">₹ {subTotal.toFixed(2)}</span>
                        </div>
                        {(data.totalTax || 0) > 0 && (
                            <div className="flex justify-between items-center px-3 py-1.5 border-b border-black text-gray-600">
                                <span>Tax Amount</span>
                                <span>₹ {data.totalTax?.toFixed(2)}</span>
                            </div>
                        )}
                        {data.roundOff !== undefined && data.roundOff !== 0 && (
                            <div className="flex justify-between items-center px-3 py-1.5 border-b border-black text-gray-600">
                                <span>Round Off</span>
                                <span>{(data.roundOff || 0) > 0 ? '+' : ''}{data.roundOff}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center px-3 py-2 border-b border-black font-bold text-base">
                            <span>Total</span>
                            <span>₹ {grandTotal.toFixed(2)}</span>
                        </div>
                        {received > 0 && (
                            <div className="flex justify-between items-center px-3 py-1.5 border-b border-black text-gray-600">
                                <span>Received</span>
                                <span>₹ {received.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center px-3 py-1.5 border-b border-black font-semibold text-red-500">
                            <span>Balance</span>
                            <span>₹ {balance.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- GST Theme 3 ---
    const GstTheme3Template = () => {
        const companyName = company?.name || data.companyName || 'Your Company';
        const companyAddress = company?.address || data.companyAddress || '';
        const companyPhone = company?.phone || data.companyPhone || '';
        const companyGst = company?.gstNumber || data.companyGst || '';
        const stateOfSupply = company?.state || data.stateOfSupply || '';
        const items = data.items || [];
        const totalQty = items.reduce((s: number, i: any) => s + (Number(i.quantity) || 0), 0);
        const totalGst = items.reduce((s: number, i: any) => s + (Number(i.tax?.amount) || 0), 0);
        const totalAmt = items.reduce((s: number, i: any) => s + (Number(i.amount) || 0), 0);
        const subTotal = data.subTotal ?? totalAmt;
        const grandTotal = data.grandTotal ?? totalAmt;
        const received = data.received || 0;
        const cgst = (data.totalTax || totalGst) / 2;
        const sgst = (data.totalTax || totalGst) / 2;
        const taxRate = items[0]?.tax?.rate || 0;
        const halfRate = taxRate / 2;

        return (
            <div className="w-full text-[9px] font-sans text-gray-900 bg-white border border-gray-400">
                {/* Title */}
                <div className="text-center font-bold text-sm py-1.5 border-b border-gray-400">
                    {docTitle}
                </div>

                {/* Company + Invoice Details */}
                <div className="flex border-b border-gray-400">
                    {/* LOGO */}
                    <div className="w-16 border-r border-gray-400 flex items-center justify-center p-2 shrink-0">
                        <div className="w-12 h-12 bg-gray-300 flex items-center justify-center text-gray-500 font-bold text-[9px]">LOGO</div>
                    </div>
                    {/* Company Info */}
                    <div className="flex-1 border-r border-gray-400 p-2">
                        <div className="font-bold text-sm leading-tight">{companyName}</div>
                        <div className="text-[8px] uppercase text-gray-700 mt-0.5">{companyAddress}</div>
                        {companyPhone && <div className="mt-0.5">Phone no.: {companyPhone}</div>}
                        {companyGst && <div>GSTIN: {companyGst}</div>}
                        {stateOfSupply && <div>State: {stateOfSupply}</div>}
                    </div>
                    {/* Invoice Details — 2-col inner grid */}
                    <div className="w-[35%] p-0">
                        <div className="flex border-b border-gray-400 h-full">
                            <div className="flex-1 border-r border-gray-400 p-2">
                                <div className="text-[8px] text-gray-500">Invoice No.</div>
                                <div className="font-bold mt-0.5">{data.invoiceNo || data.refNo || '—'}</div>
                            </div>
                            <div className="flex-1 p-2">
                                <div className="text-[8px] text-gray-500">Date</div>
                                <div className="font-bold mt-0.5">
                                    {data.invoiceDate ? format(new Date(data.invoiceDate), 'dd-MM-yyyy') : format(new Date(), 'dd-MM-yyyy')}, {data.invoiceTime || format(new Date(), 'hh:mm a')}
                                </div>
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="text-[8px] text-gray-500">Place of supply</div>
                            <div className="font-bold mt-0.5">{stateOfSupply || '—'}</div>
                        </div>
                    </div>
                </div>

                {/* Bill To */}
                <div className="border-b border-gray-400 px-2 py-1.5">
                    <div className="text-[8px] text-gray-500 mb-0.5">Bill To</div>
                    <div className="font-bold text-sm">{data.partyName || '—'}</div>
                    {data.billingAddress && <div className="text-[8px] text-gray-600">{data.billingAddress}</div>}
                </div>

                {/* Items Table */}
                <table className="w-full border-collapse border-b border-gray-400">
                    <thead>
                        <tr className="border-b border-gray-400 bg-white font-bold text-center">
                            <th className="border-r border-gray-400 px-1 py-1 w-5">#</th>
                            <th className="border-r border-gray-400 px-2 py-1 text-left">Item name</th>
                            <th className="border-r border-gray-400 px-1 py-1 w-14">HSN/ SAC</th>
                            <th className="border-r border-gray-400 px-1 py-1 w-14 text-right">Quantity</th>
                            <th className="border-r border-gray-400 px-1 py-1 w-10 text-right">Unit</th>
                            <th className="border-r border-gray-400 px-1 py-1 w-16 text-right">Price/ Unit</th>
                            <th className="border-r border-gray-400 px-1 py-1 w-20 text-right">GST</th>
                            <th className="px-1 py-1 w-16 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-gray-200">
                                <td className="border-r border-gray-400 px-1 py-1 text-center">{idx + 1}</td>
                                <td className="border-r border-gray-400 px-2 py-1 font-semibold">{item.name}</td>
                                <td className="border-r border-gray-400 px-1 py-1 text-center">{item.hsn || ''}</td>
                                <td className="border-r border-gray-400 px-1 py-1 text-right">{item.quantity}</td>
                                <td className="border-r border-gray-400 px-1 py-1 text-right">{item.unit}</td>
                                <td className="border-r border-gray-400 px-1 py-1 text-right">₹ {item.priceUnit?.amount?.toFixed(2)}</td>
                                <td className="border-r border-gray-400 px-1 py-1 text-right">
                                    {item.tax?.amount > 0 ? `₹ ${item.tax.amount.toFixed(2)} (${item.tax.rate}%)` : '—'}
                                </td>
                                <td className="px-1 py-1 text-right font-bold">₹ {item.amount?.toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr className="border-t border-gray-400 font-bold">
                            <td className="border-r border-gray-400"></td>
                            <td className="border-r border-gray-400 px-2 py-1">Total</td>
                            <td className="border-r border-gray-400"></td>
                            <td className="border-r border-gray-400 px-1 py-1 text-right">{totalQty}</td>
                            <td className="border-r border-gray-400"></td>
                            <td className="border-r border-gray-400"></td>
                            <td className="border-r border-gray-400 px-1 py-1 text-right">₹ {(totalGst || data.totalTax || 0).toFixed(2)}</td>
                            <td className="px-1 py-1 text-right">₹ {totalAmt.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Invoice Amount in Words + Amounts section */}
                <div className="flex border-b border-gray-400">
                    <div className="flex-1 border-r border-gray-400 p-2">
                        <div className="font-bold text-[9px] mb-0.5" style={{ color: '#2563eb' }}>Invoice Amount in Words</div>
                        <div className="font-bold capitalize">{numberToWords(Math.round(grandTotal))} Rupees only</div>
                    </div>
                    <div className="w-[45%] p-0">
                        <div className="px-2 py-1 border-b border-gray-400 font-bold text-[9px]" style={{ color: '#2563eb' }}>Amounts</div>
                        <div className="px-2 text-[9px] space-y-0.5 py-1">
                            <div className="flex justify-between">
                                <span>Sub Total</span>
                                <span style={{ color: '#2563eb' }}>₹ {subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span style={{ color: '#2563eb' }}>₹ {grandTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Received</span>
                                <span style={{ color: '#2563eb' }}>₹ {received.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Balance</span>
                                <span style={{ color: '#2563eb' }}>₹ {(grandTotal - received).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Avaliable Points</span>
                                <span>0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GST Analysis Table */}
                <table className="w-full border-collapse border-b border-gray-400 text-[9px]">
                    <thead>
                        <tr className="border-b border-gray-400 font-bold text-center">
                            <th className="border-r border-gray-400 px-1 py-1 w-20" rowSpan={2}>HSN/ SAC</th>
                            <th className="border-r border-gray-400 px-1 py-1 w-24" rowSpan={2}>Taxable amount</th>
                            <th className="border-r border-gray-400 px-1 py-1" colSpan={2}>CGST</th>
                            <th className="border-r border-gray-400 px-1 py-1" colSpan={2}>SGST</th>
                            <th className="px-1 py-1" rowSpan={2}>Total Tax Amount</th>
                        </tr>
                        <tr className="border-b border-gray-400 font-bold text-center">
                            <th className="border-r border-gray-400 px-1 py-0.5 w-10">Rate</th>
                            <th className="border-r border-gray-400 px-1 py-0.5 w-14">Amount</th>
                            <th className="border-r border-gray-400 px-1 py-0.5 w-10">Rate</th>
                            <th className="border-r border-gray-400 px-1 py-0.5 w-14">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-300 text-center">
                            <td className="border-r border-gray-400 px-1 py-1">{items[0]?.hsn || ''}</td>
                            <td className="border-r border-gray-400 px-1 py-1 text-right">₹ {subTotal.toFixed(2)}</td>
                            <td className="border-r border-gray-400 px-1 py-1">{halfRate ? `${halfRate}%` : '9%'}</td>
                            <td className="border-r border-gray-400 px-1 py-1 text-right">₹ {cgst.toFixed(2)}</td>
                            <td className="border-r border-gray-400 px-1 py-1">{halfRate ? `${halfRate}%` : '9%'}</td>
                            <td className="border-r border-gray-400 px-1 py-1 text-right">₹ {sgst.toFixed(2)}</td>
                            <td className="px-1 py-1 text-right">₹ {(data.totalTax || totalGst).toFixed(2)}</td>
                        </tr>
                        <tr className="font-bold border-t border-gray-400 text-center">
                            <td className="border-r border-gray-400 px-1 py-1 text-right">Total</td>
                            <td className="border-r border-gray-400 px-1 py-1 text-right">₹ {subTotal.toFixed(2)}</td>
                            <td className="border-r border-gray-400"></td>
                            <td className="border-r border-gray-400 px-1 py-1 text-right">₹ {cgst.toFixed(2)}</td>
                            <td className="border-r border-gray-400"></td>
                            <td className="border-r border-gray-400 px-1 py-1 text-right">₹ {sgst.toFixed(2)}</td>
                            <td className="px-1 py-1 text-right">₹ {(data.totalTax || totalGst).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Footer: Bank Details | Terms | For + Signatory */}
                <div className="flex">
                    <div className="w-[35%] border-r border-gray-400 p-2 text-[9px]">
                        <div className="font-bold mb-1">Bank Details</div>
                        {bankAccount?.bankName && <div>Name : {bankAccount.bankName}</div>}
                        {bankAccount?.accountNumber && <div>Account No. : {bankAccount.accountNumber}</div>}
                        {bankAccount?.ifscCode && <div>IFSC code : {bankAccount.ifscCode}</div>}
                        {bankAccount?.accountHolderName && <div>Account holder&apos;s name : {bankAccount.accountHolderName}</div>}
                    </div>
                    <div className="flex-1 border-r border-gray-400 p-2 text-[9px]">
                        <div className="font-bold mb-1">Terms and conditions</div>
                        <div className="text-gray-600">Thanks for doing business with us!</div>
                    </div>
                    <div className="w-[25%] p-2 flex flex-col justify-between text-[9px]">
                        <div>For : {companyName}</div>
                        <div className="mt-8 border-t border-gray-400 pt-1 font-bold text-center">Authorized Signatory</div>
                    </div>
                </div>
            </div>
        );
    };

    // Function to render the active template
    const Template = () => {
        if (activeTheme === 'tally') return <TallyTemplate />;
        if (activeTheme === 'gst1') return <GstTheme1Template />;
        if (activeTheme === 'gst3') return <GstTheme3Template />;
        if (activeTheme === 'landscape') return <LandscapeTemplate2 />;
        if (activeTheme === 'landscape2') return <LandscapeTemplate2 />;
        return <GenericTemplate />;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] w-screen h-screen bg-gray-100 flex flex-col md:flex-row overflow-hidden text-sm">

            {/* --- Left Sidebar: Themes --- */}
            <div className="hidden md:flex w-60 flex-col border-r bg-white h-full overflow-y-auto shrink-0 shadow-lg z-10">
                <div className="p-4 border-b font-bold text-gray-700 bg-gray-50/50 text-sm">Select Theme</div>

                {/* Classic Themes */}
                <div className="border-b">
                    <button
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        onClick={() => setClassicOpen(o => !o)}
                    >
                        <span>Classic Themes</span>
                        <span className="text-gray-400 text-xs">{classicOpen ? '▲' : '▼'}</span>
                    </button>
                    {classicOpen && (
                        <div className="pb-1">
                            {classicThemes.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => setActiveTheme(theme.id)}
                                    className={cn(
                                        "w-full text-left px-5 py-2 text-sm transition-all duration-150",
                                        activeTheme === theme.id
                                            ? "bg-orange-50 text-orange-600 font-semibold border-l-4 border-orange-500"
                                            : "hover:bg-gray-50 text-gray-600 border-l-4 border-transparent"
                                    )}
                                >
                                    {theme.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Vintage Themes */}
                <div className="border-b">
                    <button
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        onClick={() => setVintageOpen(o => !o)}
                    >
                        <span>Vintage Themes</span>
                        <span className="text-gray-400 text-xs">{vintageOpen ? '▲' : '▼'}</span>
                    </button>
                    {vintageOpen && (
                        <div className="pb-1">
                            {vintageThemes.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => setActiveTheme(theme.id)}
                                    className={cn(
                                        "w-full text-left px-5 py-2 text-sm transition-all duration-150",
                                        activeTheme === theme.id
                                            ? "bg-orange-50 text-orange-600 font-semibold border-l-4 border-orange-500"
                                            : "hover:bg-gray-50 text-gray-600 border-l-4 border-transparent"
                                    )}
                                >
                                    {theme.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Select Color */}
                <div className="border-b px-4 py-3">
                    <div className="text-xs font-semibold text-gray-600 mb-2">Select Color</div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded border-2 border-gray-300 shrink-0" style={{ backgroundColor: themeColor }}></div>
                        <span className="text-xs font-medium text-gray-700">Selected</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {[
                            '#8b5cf6','#3b82f6','#6b7280','#475569','#65a30d','#0ea5e9','#16a34a',
                            '#22c55e','#ef4444','#7c3aed','#0d9488','#92400e','#d97706','#9333ea','#db2777',
                            '#84cc16','#78350f','#4c1d95','#dc2626','#1e3a5f','#111827',
                            '#f59e0b','#fca5a5','#f9a8d4','#fde68a','#bbf7d0','#bae6fd','#ddd6fe',
                        ].map(color => (
                            <button
                                key={color}
                                onClick={() => setThemeColor(color)}
                                className="w-6 h-6 rounded border-2 transition-transform hover:scale-110"
                                style={{
                                    backgroundColor: color,
                                    borderColor: themeColor === color ? '#1d4ed8' : 'transparent',
                                    outline: themeColor === color ? '2px solid #93c5fd' : 'none',
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-auto p-4 border-t bg-gray-50/50">
                    <div className="flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 p-3 rounded-md border border-yellow-100">
                        <Landmark className="h-4 w-4 shrink-0" />
                        <span>Tip: Use landscape themes for more item details.</span>
                    </div>
                </div>
            </div>

            {/* --- Center: Preview --- */}
            <div className="flex-1 flex flex-col h-full bg-slate-200/50 relative overflow-hidden">
                {/* Navbar */}
                <div className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
                            <X className="h-5 w-5" />
                        </Button>
                        <span className="font-bold text-lg text-gray-800">Preview</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 mr-2">
                            <Button variant="outline" size="sm" onClick={handlePrintPdf} className="hidden lg:flex gap-2">
                                <Printer className="h-4 w-4" /> Print PDF
                            </Button>
                            <Button variant="outline" size="sm" onClick={handlePrint} className="hidden lg:flex gap-2">
                                <Printer className="h-4 w-4" /> Thermal
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDownloadPdf} className="hidden lg:flex gap-2">
                                <Download className="h-4 w-4" /> Download
                            </Button>

                            <div className="h-6 w-px bg-gray-300 mx-2 hidden lg:block"></div>

                            <input
                                type="checkbox"
                                checked={!showPreviewAgain}
                                onChange={() => setShowPreviewAgain(!showPreviewAgain)}
                                id="dontShow"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="dontShow" className="text-sm text-gray-600 cursor-pointer select-none">Do not show again</label>
                        </div>
                        <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                            Save & Close
                        </Button>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 overflow-auto p-3 flex justify-center items-start bg-slate-100">
                    <div className="shadow-2xl origin-top w-full max-w-[900px]">
                        <div className="w-full min-h-[297mm] bg-white" ref={componentRef}>
                            <Template />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Right Sidebar: Actions --- */}
            <div className="hidden md:flex w-72 bg-white border-l h-full flex-col overflow-y-auto shrink-0 z-10">

                {/* WhatsApp Promo */}
                <div className="m-4 rounded-xl border border-green-200 bg-green-50 p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-2">
                        <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xs text-green-700 font-semibold mb-0.5">Explore WhatsApp!</div>
                    <div className="text-[10px] text-green-600 mb-3 px-2">Send invoices directly to customers via WhatsApp</div>
                    <button
                        onClick={handleWhatsappShare}
                        className="w-full bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 rounded-md transition-colors"
                    >
                        Connect WhatsApp
                    </button>
                </div>

                {/* Share Invoice */}
                <div className="px-4 py-2">
                    <h3 className="font-bold text-gray-700 mb-3 text-xs uppercase tracking-wider">Share Invoice</h3>
                    <div className="grid grid-cols-4 gap-1">
                        <button className="flex flex-col items-center gap-1.5 hover:bg-green-50 p-2 rounded-lg transition-colors relative" onClick={handleWhatsappShare}>
                            <div className="bg-green-100 p-2.5 rounded-full">
                                <MessageSquare className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="text-[9px] font-medium text-gray-600">Whatsapp</span>
                            <span className="absolute top-1 right-1 bg-red-500 text-white text-[7px] font-bold px-1 rounded-full leading-tight">NEW</span>
                        </button>
                        <button className="flex flex-col items-center gap-1.5 hover:bg-red-50 p-2 rounded-lg transition-colors" onClick={handleEmailShare}>
                            <div className="bg-red-100 p-2.5 rounded-full">
                                <Mail className="h-4 w-4 text-red-500" />
                            </div>
                            <span className="text-[9px] font-medium text-gray-600">Gmail</span>
                        </button>
                        <button className="flex flex-col items-center gap-1.5 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                            <div className="bg-blue-100 p-2.5 rounded-full">
                                <Smartphone className="h-4 w-4 text-blue-500" />
                            </div>
                            <span className="text-[9px] font-medium text-gray-600">Message</span>
                        </button>
                        <button className="flex flex-col items-center gap-1.5 hover:bg-orange-50 p-2 rounded-lg transition-colors">
                            <div className="bg-orange-100 p-2.5 rounded-full">
                                <Share2 className="h-4 w-4 text-orange-500" />
                            </div>
                            <span className="text-[9px] font-medium text-gray-600">Vyapar</span>
                        </button>
                    </div>
                </div>

                {/* Download / Print */}
                <div className="mt-auto px-4 pb-6 pt-4 border-t flex flex-col gap-2">
                    <button
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 border hover:border-blue-500 px-4 py-2.5 rounded-lg transition-all text-sm font-medium"
                        onClick={handleDownloadPdf}
                    >
                        <Download className="h-4 w-4" />
                        Download PDF
                    </button>
                    <button
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 border hover:border-blue-500 px-4 py-2.5 rounded-lg transition-all text-sm font-medium"
                        onClick={handlePrint}
                    >
                        <Printer className="h-4 w-4" />
                        Print Invoice (Thermal)
                    </button>
                    <button
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 border hover:border-blue-500 px-4 py-2.5 rounded-lg transition-all text-sm font-medium"
                        onClick={handlePrintPdf}
                    >
                        <Printer className="h-4 w-4" />
                        Print Invoice (Normal)
                    </button>
                </div>
            </div>
        </div>
    );
};
