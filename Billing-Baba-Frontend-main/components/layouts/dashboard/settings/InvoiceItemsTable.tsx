import React from 'react';
import clsx from 'clsx';
import { invoiceData as DataType } from './invoice/invoice-data';

interface Props {
  items: typeof DataType.items;
  theme: string;
  color: string;
}

const InvoiceItemsTable: React.FC<Props> = ({ items, theme, color }) => {
  const isTallyTheme = theme === 'Tally Theme';

  const thClasses = clsx("p-1 text-left font-bold", {
    "border-b border-gray-400": !isTallyTheme,
  });

  return (
    <div className="mb-4">
      <table className="w-full border-collapse">
        <thead className={clsx({ "border-y-2 border-black": isTallyTheme })}>
          <tr style={ !isTallyTheme ? { backgroundColor: color, color: 'white' } : {}}>
            <th className={thClasses}>#</th>
            <th className={thClasses}>Item Name</th>
            <th className={thClasses}>HSC/SAC</th>
            <th className={thClasses}>Price/unit</th>
            <th className={thClasses}>Discount</th>
            <th className={thClasses}>CGST</th>
            <th className={thClasses}>SGST</th>
            <th className={thClasses}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="p-1">{index + 1}</td>
              <td className="p-1">{item.name}</td>
              <td className="p-1">{item.hsc}</td>
              <td className="p-1">{item.price.toFixed(2)}</td>
              <td className="p-1">{item.discount.toFixed(2)} ({item.discountPercent}%)</td>
              <td className="p-1">{item.cgst.toFixed(2)} ({item.gstPercent}%)</td>
              <td className="p-1">{item.sgst.toFixed(2)} ({item.gstPercent}%)</td>
              <td className="p-1 font-bold">{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceItemsTable;