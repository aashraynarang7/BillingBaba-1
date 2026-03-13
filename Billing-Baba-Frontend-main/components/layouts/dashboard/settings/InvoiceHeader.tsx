import React from 'react';
import { invoiceData as DataType } from './invoice/invoice-data';

interface Props {
  data: typeof DataType;
  color: string;
}

const InvoiceHeader: React.FC<Props> = ({ data, color }) => {
  return (
    <header style={{ backgroundColor: color }} className="p-4 text-white -mx-8 -mt-8 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200/50 flex items-center justify-center text-xs text-white/80">Image</div>
          <div>
            <h1 className="text-2xl font-bold">{data.company.name}</h1>
            <p>Ph. no: {data.company.phone}</p>
          </div>
        </div>
        <h2 className="text-3xl font-bold uppercase">{data.invoice.title}</h2>
      </div>
    </header>
  );
};

export default InvoiceHeader;