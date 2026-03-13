"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, X } from "lucide-react";

export function BusinessSetupSuccessDialog() {
  // In a real app, you would control this `open` state with props
  return (
    <Dialog open={true}>
      {/* 
        THE FIX: 
        1. max-w-4xl -> Sets a maximum width for the modal.
        2. flex flex-col -> Turns the modal into a flex container.
        3. max-h-[90vh] -> Prevents the modal from being taller than 90% of the screen height.
      */}
      <DialogContent className="max-w-4xl p-0 flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 text-center border-b">
          <DialogTitle className="text-3xl font-bold">
            Your business has been set up 🎉
          </DialogTitle>
          <DialogDescription>
            Take a look at how your invoice will look with the set up details!
          </DialogDescription>
        </DialogHeader>

        {/* 
          THE FIX:
          1. flex-1 -> Makes this container take up all available vertical space.
          2. overflow-y-auto -> Adds a vertical scrollbar ONLY if the content is too tall.
        */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-8">
            <div className="bg-white shadow-md rounded-lg p-6 border mx-auto">
                <h2 className="text-center font-bold mb-4">Sample Tax Invoice</h2>
                <Separator />
                {/* Invoice Header */}
                <div className="flex justify-between items-start py-4">
                    <div>
                        <h3 className="font-bold text-lg">heloo</h3>
                        <p className="text-sm text-muted-foreground">Phone: 9310891509</p>
                        <p className="text-sm text-muted-foreground">FSSAI No.:</p>
                    </div>
                    <div>
                         <p className="text-sm text-muted-foreground">Drug License Number:</p>
                    </div>
                </div>
                <Separator />
                {/* Invoice Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-sm">
                    <div className="border p-3 rounded-md space-y-1">
                        <p className="font-semibold">Bill To:</p>
                        <p>Sample Party</p><p>Sample Address</p><p>Contact Number: 9333 911 911</p><p>Drug License No: ****</p><p>Age/Gender: ****</p><p>Drug License Exp. Date: ****</p>
                    </div>
                     <div className="border p-3 rounded-md space-y-1">
                        <p className="font-semibold">Invoice Details:</p>
                        <p>No: Sample 01</p><p>Date: 06/09/2025</p><p>Doctor's Name: ****</p><p>Diagnosis: ****</p><p>Salesman Name: ****</p>
                    </div>
                </div>

                {/* 
                  THE FIX: 
                  overflow-x-auto -> Adds a horizontal scrollbar to this container ONLY if the table is too wide.
                */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-sm text-left min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-2 font-semibold">#</th>
                                <th className="p-2 font-semibold">Item Name</th>
                                <th className="p-2 font-semibold">Manufacturer Name</th>
                                <th className="p-2 font-semibold">Batch No.</th>
                                <th className="p-2 font-semibold">Exp. Date</th>
                                <th className="p-2 font-semibold">Mfg. Date</th>
                                <th className="p-2 font-semibold">Dosage</th>
                                <th className="p-2 font-semibold">Qty</th>
                                <th className="p-2 font-semibold">Unit</th>
                                <th className="p-2 font-semibold">Price(₹)</th>
                                <th className="p-2 font-semibold">GST(₹)</th>
                                <th className="p-2 font-semibold">Amount(₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-2">1</td>
                                <td className="p-2">Sample Item</td>
                                <td className="p-2">Cipla</td>
                                <td className="p-2">B1</td>
                                <td className="p-2">09/2026</td>
                                <td className="p-2">08/09/2024</td>
                                <td className="p-2">500MG</td>
                                <td className="p-2">1</td>
                                <td className="p-2">STRP</td>
                                <td className="p-2">380.95</td>
                                <td className="p-2">19.05</td>
                                <td className="p-2">400</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end p-2 bg-gray-50 mt-2 font-bold">
                    Total: ₹ 400
                </div>

                <div className="flex justify-between mt-8 pt-16">
                    <p className="font-semibold">For My Company:</p>
                    <div className="border-t pt-2 w-1/3 text-center">Authorized Signatory</div>
                </div>
            </div>
        </div>

        <DialogFooter className="p-6 bg-white flex justify-center items-center gap-4 border-t">
          <Button variant="secondary" size="lg" className="px-8 py-6 rounded-md">Make More Changes</Button>
          <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-md">
            Proceed To Vyapar <ArrowRight className="ml-2 h-4 w-4"/>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}