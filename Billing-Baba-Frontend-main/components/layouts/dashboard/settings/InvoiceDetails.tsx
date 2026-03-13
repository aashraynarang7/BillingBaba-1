import React from 'react';
import { invoiceData as DataType } from './invoice/invoice-data';

interface Props {
  data: typeof DataType;
}

const InvoiceDetails: React.FC<Props> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
      <div>
        <h3 className="font-bold border-b border-gray-400 pb-1 mb-1">Bill To:</h3>
        <p className="font-bold">{data.customer.name}</p>
        <p>{data.customer.address}</p>
        <p>Contact No: {data.customer.contact}</p>
      </div>
      <div className="border border-gray-300 p-2">
        <h3 className="font-bold border-b border-gray-400 pb-1 mb-1">Invoice Details:</h3>
        <div className="grid grid-cols-2">
          <p>Invoice No.:</p><p className="font-bold">{data.invoice.number}</p>
          <p>Date:</p><p className="font-bold">{data.invoice.date}</p>
          <p>Time:</p><p className="font-bold">{data.invoice.time}</p>
          <p>Due Date:</p><p className="font-bold">{data.invoice.dueDate}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;