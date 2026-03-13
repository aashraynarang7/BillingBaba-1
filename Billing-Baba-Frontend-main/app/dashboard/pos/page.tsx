"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
    Search,
    X,
    Settings,
    CalendarDays,
    ChevronDown,
    Receipt,
    HeadsetIcon,
    RefreshCw,
    Minus,
    Square,
} from "lucide-react";

export default function PosPage() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                handlePrint();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <div className="print:hidden flex flex-col h-screen w-full bg-slate-100 overflow-hidden font-sans text-sm">
                {/* Top Application Bar (Electron-style wrap) */}
                <div className="flex justify-between items-center bg-white px-2 py-1 border-b text-[12px] h-8 text-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 font-semibold text-red-500">
                            <div className="w-4 h-4 bg-red-500 clip-triangle" /> {/* Mock Logo */}
                        </div>
                        <button className="hover:text-black">Company</button>
                        <button className="hover:text-black">Help</button>
                        <button className="hover:text-black">Versions</button>
                        <button className="hover:text-black">Shortcuts</button>
                        <button className="hover:text-black ms-2"><RefreshCw size={12} /></button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-blue-500 hover:text-blue-600 font-medium">Request a Callback</button>
                        <div className="flex items-center gap-1">
                            <span>Customer Support: </span>
                            <HeadsetIcon size={12} className="text-gray-500" />
                            <span className="text-blue-500 font-medium">+91-6364444752, +91-9333911911</span>
                        </div>
                        <button className="text-blue-500 hover:text-blue-600 flex items-center gap-1 font-medium">
                            <HeadsetIcon size={12} /> Get Instant Online Support
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="hover:text-black"><Minus size={14} /></button>
                        <button className="hover:text-black"><Square size={12} /></button>
                        <button className="hover:text-black"><X size={14} /></button>
                    </div>
                </div>

                {/* Tabs Row */}
                <div className="flex items-center border-b bg-gray-50 h-10 px-0">
                    <div className="flex items-center h-full bg-white border-r px-4 border-t-2 border-t-red-500 text-red-500 font-medium gap-8 cursor-pointer relative top-[1px]">
                        <span>#13</span>
                        <button><X size={14} /></button>
                    </div>
                    <div className="flex items-center h-full px-4 border-r text-gray-600 gap-8 hover:bg-white cursor-pointer select-none">
                        <span>#13</span>
                        <button><X size={14} /></button>
                    </div>
                    <div className="flex items-center h-full px-4 border-r text-gray-600 hover:bg-white cursor-pointer select-none">
                        + New Bill [Ctrl+T]
                    </div>

                    <div className="flex-1" />

                    <div className="flex items-center gap-4 px-4 text-gray-500">
                        <button className="hover:text-black"><Settings size={16} /></button>
                        <button className="hover:text-black"><Minus size={16} /></button>
                        <button className="hover:text-black"><ChevronDown size={16} /></button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-1 overflow-hidden p-2 gap-2 bg-[#f4f6fa]">

                    {/* Left Side: Items Table */}
                    <div className="flex-1 flex flex-col bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                        {/* Search Bar */}
                        <div className="flex p-2 border-b items-center relative">
                            <input
                                type="text"
                                placeholder="Search by item name, item code, hsn code, mrp, sale price, purchase price... [F1]"
                                className="w-full h-10 pl-4 pr-10 bg-white border rounded text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            />
                            <Search className="absolute right-5 text-gray-400" size={18} />
                        </div>

                        {/* Table Header */}
                        <div className="flex border-b bg-gray-50 text-gray-600 font-medium text-[11px] uppercase p-2 items-center">
                            <div className="w-8 px-2">#</div>
                            <div className="w-24 px-2">ITEM CODE</div>
                            <div className="flex-1 px-2 border-l border-gray-200">ITEM NAME</div>
                            <div className="w-16 px-2 border-l border-gray-200">QTY</div>
                            <div className="w-16 px-2 border-l border-gray-200">UNIT</div>
                            <div className="w-24 px-2 border-l border-gray-200 text-center leading-tight">
                                PRICE/UNIT(₹) <br /><span className="text-[10px] text-gray-400 normal-case">Without Tax</span>
                            </div>
                            <div className="w-28 px-2 border-l border-gray-200 text-center">TAX APPLIED(₹)</div>
                            <div className="w-28 px-2 border-l border-gray-200 text-right">TOTAL(₹)</div>
                        </div>

                        {/* Table Body (Empty for now to match screenshot) */}
                        <div className="flex-1 overflow-y-auto bg-white border-r">
                            {/* Rows would map here */}
                            {/* The screenshot shows empty vertical lines taking up the space */}
                            <div className="flex h-full min-h-[400px]">
                                <div className="w-8 border-r border-gray-100" />
                                <div className="w-24 border-r border-gray-100" />
                                <div className="flex-1 border-r border-gray-100" />
                                <div className="w-16 border-r border-gray-100" />
                                <div className="w-16 border-r border-gray-100" />
                                <div className="w-24 border-r border-gray-100" />
                                <div className="w-28 border-r border-gray-100" />
                                <div className="w-28" />
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Details & Payment */}
                    <div className="w-[380px] flex flex-col gap-2">

                        {/* Top Info Card */}
                        <div className="bg-white rounded shadow-sm border border-gray-200 p-3 flex flex-col gap-3">
                            {/* Date & Time */}
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center justify-between border rounded px-3 h-9 text-gray-700">
                                    <span>{format(currentTime, "dd/MM/yyyy")}</span>
                                    <CalendarDays size={16} className="text-blue-500" />
                                </div>
                                <div className="w-[120px] flex items-center justify-between border rounded px-3 h-9 text-gray-700">
                                    <span>{format(currentTime, "hh:mm a")}</span>
                                    <ChevronDown size={14} className="text-gray-400" />
                                </div>
                            </div>

                            {/* Customer Search */}
                            <div className="flex items-center justify-between border rounded px-3 h-9 w-full bg-white text-gray-400 cursor-pointer hover:bg-gray-50">
                                <span className="truncate w-[90%] font-medium">Search for a customer by name, phone number [F11]</span>
                                <ChevronDown size={14} className="text-blue-500" />
                            </div>
                        </div>

                        {/* Breakdown / Total Card */}
                        <div className="bg-white rounded shadow-sm border border-gray-200 p-3 flex justify-between items-center relative overflow-hidden">
                            <div className="flex items-start gap-3">
                                <div className="bg-[#e7f1fc] p-2 rounded text-blue-500 mt-1">
                                    <Receipt size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-gray-800 leading-tight">Total ₹ 0.00</span>
                                    <span className="text-[11px] text-gray-500">Items: 0, Quantity: 0</span>
                                </div>
                            </div>
                            <button className="text-blue-600 font-medium text-[13px] flex items-center hover:underline h-full select-none text-right">
                                <div className="flex flex-col mr-1 leading-tight text-right pt-[2px]">
                                    <span className="leading-tight">Full Breakup</span>
                                    <span className="text-[10px] text-blue-500 leading-tight">[Ctrl+F]</span>
                                </div>
                                <span className="text-lg leading-none font-bold ml-1">›</span>
                            </button>
                        </div>

                        {/* Payment Section */}
                        <div className="flex-1 bg-white rounded shadow-sm border border-gray-200 flex flex-col p-4 relative">
                            <div className="flex gap-4">
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-[11px] text-gray-400 font-medium uppercase">Payment Mode</label>
                                    <div className="flex items-center justify-between border border-blue-200 rounded px-3 h-10 w-full text-gray-700 cursor-pointer">
                                        <span>Cash</span>
                                        <ChevronDown size={14} className="text-blue-500" />
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <label className="text-[11px] text-gray-400 font-medium uppercase">Amount Received</label>
                                    <div className="flex items-center border rounded px-3 h-10 w-full">
                                        <span className="text-gray-500 font-medium mr-2">₹</span>
                                        <input
                                            type="text"
                                            defaultValue="0.00"
                                            className="w-full text-right outline-none bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-white p-2 border-t mt-4 pt-4">
                                <span className="text-gray-600 font-semibold text-sm">Change to Return:</span>
                                <span className="text-gray-800 font-bold text-base">₹ 0.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions Footer */}
                <div className="h-24 bg-white border-t p-2 flex gap-4">
                    {/* Left Side: 8 Quick Actions Grid */}
                    <div className="flex-1 grid grid-cols-4 gap-2 h-full py-1">
                        <button className="bg-[#e7f1fc] hover:bg-[#d6e6f9] text-gray-800 text-[13px] rounded font-medium border border-blue-100 flex items-center justify-center">
                            Change Quantity [F2]
                        </button>
                        <button className="bg-[#e7f1fc] hover:bg-[#d6e6f9] text-gray-800 text-[13px] rounded font-medium border border-blue-100 flex items-center justify-center">
                            Item Discount [F3]
                        </button>
                        <button className="bg-[#e7f1fc] hover:bg-[#d6e6f9] text-gray-800 text-[13px] rounded font-medium border border-blue-100 flex items-center justify-center">
                            Remove Item [F4]
                        </button>
                        <button className="bg-[#e7f1fc] hover:bg-[#d6e6f9] text-gray-800 text-[13px] rounded font-medium border border-blue-100 flex items-center justify-center">
                            Change Unit [F6]
                        </button>

                        <button className="bg-white hover:bg-gray-50 text-gray-800 text-[13px] rounded font-medium border border-blue-200 flex items-center justify-center">
                            Additional Charges [F8]
                        </button>
                        <button className="bg-white hover:bg-gray-50 text-gray-800 text-[13px] rounded font-medium border border-blue-200 flex items-center justify-center">
                            Bill Discount [F9]
                        </button>
                        <button className="bg-white hover:bg-gray-50 text-gray-800 text-[13px] rounded font-medium border border-blue-200 flex items-center justify-center">
                            Loyalty Points [F10]
                        </button>
                        <button className="bg-white hover:bg-gray-50 text-gray-800 text-[13px] rounded font-medium border border-blue-200 flex items-center justify-center">
                            Remarks [F12]
                        </button>
                    </div>

                    {/* Right Side: Major Actions */}
                    <div className="w-[380px] grid grid-rows-2 gap-2 h-full py-1">
                        <button
                            onClick={handlePrint}
                            className="bg-[#a8e6cf] hover:bg-[#96d7c1] text-green-900 rounded font-medium border border-green-300 transform transition-all active:scale-[0.98]">
                            Save & Print Bill [Ctrl+P]
                        </button>
                        <button className="bg-[#f8f9fa] hover:bg-white text-gray-700 rounded font-medium border border-blue-200 shadow-sm transform transition-all active:scale-[0.98]">
                            Other/Credit Payments [Ctrl+M]
                        </button>
                    </div>
                </div>
            </div>

            {/* --- PRINT ONLY THERMAL RECEIPT --- */}
            <div className="hidden print:block font-sans text-black w-[80mm] mx-auto p-2">
                <style>
                    {`
                    @media print {
                        @page { margin: 0; size: auto; }
                        body { margin: 0; padding: 0; background: white; }
                    }
                `}
                </style>
                <div className="text-center mb-4">
                    <h1 className="text-xl font-bold uppercase">Mock Company Ltd</h1>
                    <p className="text-xs">123 Business Road, City, State 12345</p>
                    <p className="text-xs">Tel: +91-9876543210</p>
                    <p className="text-xs mt-1">GSTIN: 29ABCDE1234F1Z5</p>
                    <div className="border-b border-dashed border-gray-400 my-2" />
                    <h2 className="text-sm font-bold uppercase">Tax Invoice</h2>
                </div>

                <div className="text-xs mb-3 flex justify-between">
                    <div>
                        <div><span className="font-semibold">Bill No:</span> #13</div>
                        <div><span className="font-semibold">Date:</span> {format(currentTime, "dd/MM/yyyy")}</div>
                    </div>
                    <div className="text-right">
                        <div><span className="font-semibold">Time:</span> {format(currentTime, "hh:mm a")}</div>
                        <div>Cashier</div>
                    </div>
                </div>

                <table className="w-full text-xs text-left mb-3">
                    <thead>
                        <tr className="border-y border-dashed border-gray-400">
                            <th className="py-1">ITEM</th>
                            <th className="py-1 text-center">QTY</th>
                            <th className="py-1 text-right">PRICE</th>
                            <th className="py-1 text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Placeholder for real items later */}
                        <tr>
                            <td className="py-1">Sample Item 1</td>
                            <td className="py-1 text-center">2</td>
                            <td className="py-1 text-right">100.00</td>
                            <td className="py-1 text-right">200.00</td>
                        </tr>
                    </tbody>
                </table>

                <div className="text-xs mb-3">
                    <div className="flex justify-between py-0.5">
                        <span>Subtotal</span>
                        <span>₹ 200.00</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                        <span>CGST @ 9%</span>
                        <span>₹ 18.00</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                        <span>SGST @ 9%</span>
                        <span>₹ 18.00</span>
                    </div>
                    <div className="border-t border-dashed border-gray-400 my-1" />
                    <div className="flex justify-between py-1 text-sm font-bold">
                        <span>Grand Total</span>
                        <span>₹ 236.00</span>
                    </div>
                    <div className="border-b border-dashed border-gray-400 my-1" />
                </div>

                <div className="text-xs text-center mt-4">
                    <p className="font-semibold">Thank You! Visit Again!</p>
                    <p className="text-[10px] mt-2">Powered by BillingBaba</p>
                </div>
            </div>
        </>
    );
}
