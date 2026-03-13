import React from 'react';
import Image from 'next/image';
import { invoiceData as DataType } from './invoice/invoice-data';

interface Props {
  data: typeof DataType;
}

const InvoiceFooter: React.FC<Props> = ({ data }) => {
  return (
    <div className="mt-auto pt-4 border-t-2 border-black">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
            <div className="grid grid-cols-2">
                 <div>
                    <h4 className="font-bold">Invoice Amount in Words</h4>
                    <p>{data.totals.amountInWords}</p>
                 </div>
                 <div>
                     <h4 className="font-bold">Description</h4>
                    <p>Sale Description</p>
                 </div>
            </div>
            <div className="grid grid-cols-2 mt-4">
                <div>
                    <h4 className="font-bold">Bank Details</h4>
                    <p>{data.bank.name}: {data.bank.accountNumber}</p>
                </div>
                <div>
                     <h4 className="font-bold">Terms and conditions</h4>
                    <p>{data.terms}</p>
                </div>
            </div>
        </div>
        <div className="text-right">
             <div className="grid grid-cols-2 font-bold">
                <span>Sub Total</span><span>{data.totals.subTotal.toFixed(2)}</span>
                <span>Discount</span><span>{data.totals.discount.toFixed(2)}</span>
                <span>Tax</span><span>{data.totals.tax.toFixed(2)}</span>
                <span className="border-t border-black pt-1">Total</span><span className="border-t border-black pt-1">{data.totals.total.toFixed(2)}</span>
                <span>Received</span><span>{data.totals.received.toFixed(2)}</span>
                <span className="font-bold">Balance</span><span className="font-bold">{data.totals.balance.toFixed(2)}</span>
                <span className="text-green-600">You Saved</span><span className="text-green-600">{data.totals.youSaved.toFixed(2)}</span>
            </div>
        </div>
      </div>
       <div className="mt-8 flex justify-between items-end">
            <div>
                 <Image src={data.bank.qrCode} alt="QR Code" width={60} height={60} />
            </div>
            <div className="text-center">
                 <div className="w-40 h-10 border-b border-gray-400 mb-1"></div>
                 <p className="font-bold">{data.signature}</p>
            </div>
       </div>
    </div>
  );
};

export default InvoiceFooter;