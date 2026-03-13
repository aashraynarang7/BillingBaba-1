import React from 'react';
import { invoiceData } from './invoice-data';
import InvoiceHeader from '../InvoiceHeader';
import InvoiceDetails from '../InvoiceDetails';
import InvoiceItemsTable from '../InvoiceItemsTable';
import InvoiceFooter from '../InvoiceFooter';

interface InvoicePreviewProps {
  theme: string;
  color: string;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ theme, color }) => {
  return (
    <div className="bg-white p-8 text-[10px] shadow-lg aspect-[1/1.414] border">
      <InvoiceHeader data={invoiceData} color={color} />
      <InvoiceDetails data={invoiceData} />
      <InvoiceItemsTable items={invoiceData.items} theme={theme} color={color} />
      <InvoiceFooter data={invoiceData} />
    </div>
  );
};

export default InvoicePreview;