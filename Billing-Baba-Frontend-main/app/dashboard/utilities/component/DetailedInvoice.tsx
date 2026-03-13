import { Separator } from "@/components/ui/separator";

export const DetailedInvoice = () => (
    <div className="bg-white shadow-md rounded-lg p-6 border mx-auto text-[10px] leading-tight">
        <h2 className="text-center font-bold mb-4 text-base">Sample Tax Invoice</h2>
        <Separator />
        {/* Invoice Header */}
        <div className="flex justify-between items-start py-4">
            <div>
                <h3 className="font-bold text-lg">heloo</h3>
                <p>Phone: 9310891509</p>
                <p>FSSAI No.:</p>
            </div>
            <div className="text-right">
                <p>Drug License Number:</p>
            </div>
        </div>
        <Separator />
        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-4 py-4">
            <div className="border p-2 rounded-md space-y-1">
                <p className="font-semibold">Bill To:</p>
                <p>Sample Party</p><p>Sample Address</p><p>Contact Number: 9333 911 911</p><p>PAN Number: ****</p><p>Drug License No: ****</p><p>Drug License Exp. Date: ****</p><p>Age/Gender: ****</p>
            </div>
            <div className="border p-2 rounded-md space-y-1">
                <p className="font-semibold">Invoice Details:</p>
                <p>No: Sample 01</p><p>Date: 06/09/2025</p><p>Doctor's Name: ****</p><p>Diagnosis: ****</p><p>Salesman Name: ****</p>
            </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto w-full border rounded-md">
            <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 font-semibold">
                    <tr>
                        <th className="p-2 border-r">#</th>
                        <th className="p-2 border-r text-left">Item Name</th>
                        <th className="p-2 border-r">HSN/SAC</th>
                        <th className="p-2 border-r">Batch No.</th>
                        <th className="p-2 border-r">Exp. Date</th>
                        <th className="p-2 border-r">Mfg. Date</th>
                        <th className="p-2 border-r">Dosage</th>
                        <th className="p-2 border-r">Qty</th>
                        <th className="p-2 border-r">Unit</th>
                        <th className="p-2 border-r">Price/Unit(₹)</th>
                        <th className="p-2 border-r">GST(₹)</th>
                        <th className="p-2">Amount(₹)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t">
                        <td className="p-2 border-r">1</td>
                        <td className="p-2 border-r"><div>Sample Item</div><div>Manufacturer Name:</div><div>Cipla</div></td>
                        <td className="p-2 border-r">123456</td>
                        <td className="p-2 border-r">B1</td>
                        <td className="p-2 border-r">09/2026</td>
                        <td className="p-2 border-r">08/09/2024</td>
                        <td className="p-2 border-r">500MG</td>
                        <td className="p-2 border-r text-center">1</td>
                        <td className="p-2 border-r">STRP</td>
                        <td className="p-2 border-r text-right">380.95</td>
                        <td className="p-2 border-r text-right">19.05</td>
                        <td className="p-2 text-right">400.00</td>
                    </tr>
                    <tr className="border-t bg-gray-50 font-semibold">
                        <td colSpan={7} className="p-2 border-r text-right">Total</td>
                        <td className="p-2 border-r text-center">1</td>
                        <td colSpan={2} className="p-2 border-r"></td>
                        <td className="p-2 border-r text-right">19.05</td>
                        <td className="p-2 text-right">400.00</td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* Tax Summary & Totals */}
        <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
                <p className="font-semibold mb-1">Tax Summary:</p>
                <table className="w-full border">
                    <thead className="bg-gray-50 font-semibold">
                        <tr>
                            <th rowSpan={2} className="p-2 border">HSN/SAC</th>
                            <th rowSpan={2} className="p-2 border">Taxable amount (₹)</th>
                            <th colSpan={2} className="p-2 border">CGST</th>
                            <th colSpan={2} className="p-2 border">SGST</th>
                            <th rowSpan={2} className="p-2 border">Total Tax (₹)</th>
                        </tr>
                        <tr>
                            <th className="p-2 border">Rate (%)</th><th className="p-2 border">Amt (₹)</th>
                            <th className="p-2 border">Rate (%)</th><th className="p-2 border">Amt (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-2 border">123456</td>
                            <td className="p-2 border text-right">380.95</td>
                            <td className="p-2 border text-right">2.5</td>
                            <td className="p-2 border text-right">9.52</td>
                            <td className="p-2 border text-right">2.5</td>
                            <td className="p-2 border text-right">9.52</td>
                            <td className="p-2 border text-right">19.05</td>
                        </tr>
                        <tr className="font-semibold bg-gray-50">
                            <td className="p-2 border">TOTAL</td>
                            <td className="p-2 border text-right">380.95</td>
                            <td colSpan={2} className="p-2 border text-right">9.52</td>
                            <td colSpan={2} className="p-2 border text-right">9.52</td>
                            <td className="p-2 border text-right">19.05</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="border rounded-md p-2 space-y-1">
                <div className="flex justify-between"><span className="font-semibold">Sub Total :</span><span>₹ 400.00</span></div>
                <div className="flex justify-between"><span className="font-semibold">Total :</span><span>₹ 400.00</span></div>
                <Separator />
                <p className="font-semibold">Invoice Amount in Words:</p>
                <p>Four Hundred Rupees only</p>
                <Separator />
                <div className="flex justify-between"><span className="font-semibold">Received :</span><span>₹ 400.00</span></div>
                <div className="flex justify-between"><span className="font-semibold">Balance :</span><span>₹ 0.00</span></div>
            </div>
        </div>
        
        {/* Footer section */}
        <div className="border rounded-md mt-2 p-2">
            <p className="font-semibold">Terms & Conditions:</p>
            <p>Thanks for doing business with us!</p>
        </div>
        <div className="flex justify-between mt-8 pt-16">
            <p className="font-semibold">For My Company:</p>
            <div className="border-t pt-2 w-1/3 text-center">Authorized Signatory</div>
        </div>
    </div>
);