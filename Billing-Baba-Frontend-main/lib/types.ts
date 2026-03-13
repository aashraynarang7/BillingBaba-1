export interface Transaction {
  id: number | string;
  date: string;
  invoiceNo: number | string;
  partyName: string;
  partyId?: string;
  transactionType: 'Sale' | 'Purchase' | 'Return' | 'Sale Order' | 'Proforma Invoice' | 'Estimate/Quotation' | 'Delivery Challan' | 'Payment In' | 'Credit Note' | 'Purchase Order' | 'Purchase Bill';
  paymentType: 'Cash' | 'Online' | 'Cheque' | string;
  amount: number;
  balance: number;
  isPaid?: boolean;
  status?: string;
  dueDate?: string;
  paymentHistory?: { date: string, amount: number, paymentMode: string, notes?: string }[];
  convertedRef?: string; // e.g. "#5" — the linked invoice/order number after conversion
}
