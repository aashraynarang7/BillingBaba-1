"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import SalesLayout from './component/SalesLayout';
import SaleInvoicesPage from './pages/SaleInvoicesPage';
import EstimatesPage from './pages/EstimatesPage';
import ProformaInvoicePage from './pages/ProformaInvoicePage';
import PaymentInPage from './pages/PaymentInPage';
import SaleOrderPage from './pages/SaleOrderPage';
import DeliveryChallanPage from './pages/DeliveryChallanPage';
import JobWorkOutPage from './pages/JobWorkOutPage';
import CreditNotePage from './pages/CreditNotePage';
import BillingPage from './pages/BillingPage';

export type SalePageType =
  | 'Sale Invoices'
  | 'Estimate/Quotation'
  | 'Proforma Invoice'
  | 'Payment-In'
  | 'Sale Order'
  | 'Delivery Challan'
  | 'Job Work Out'
  | 'Sale Return'
  | 'Billing Baba POS';

const viewToPageMap: Record<string, SalePageType> = {
  'invoices': 'Sale Invoices',
  'quotation': 'Estimate/Quotation',
  'proforma': 'Proforma Invoice',
  'payment-in': 'Payment-In',
  'order': 'Sale Order',
  'challan': 'Delivery Challan',
  'job-work-out': 'Job Work Out',
  'return': 'Sale Return',
  'pos': 'Billing Baba POS'
};

const pageToViewMap: Record<SalePageType, string> = {
  'Sale Invoices': 'invoices',
  'Estimate/Quotation': 'quotation',
  'Proforma Invoice': 'proforma',
  'Payment-In': 'payment-in',
  'Sale Order': 'order',
  'Delivery Challan': 'challan',
  'Job Work Out': 'job-work-out',
  'Sale Return': 'return',
  'Billing Baba POS': 'pos'
};


const SalesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentView = searchParams.get('view') || 'invoices';
  const activePage = viewToPageMap[currentView] || 'Sale Invoices';

  const renderActivePageComponent = () => {
    switch (activePage) {
      case 'Sale Invoices':
        return <SaleInvoicesPage />;
      case 'Estimate/Quotation':
        return <EstimatesPage />;
      case 'Proforma Invoice':
        return <ProformaInvoicePage />;
      case 'Payment-In':
        return <PaymentInPage />;
      case 'Sale Order':
        return <SaleOrderPage />;
      case 'Delivery Challan':
        return <DeliveryChallanPage />;
      case 'Job Work Out':
        return <JobWorkOutPage />;
      case 'Sale Return':
        return <CreditNotePage />;
      case 'Billing Baba POS':
        return <BillingPage />;
      default:
        return <div className="text-center p-10">Component not found for view: {currentView}</div>;
    }
  };

  const handlePageChange = (newPage: SalePageType) => {
    const newView = pageToViewMap[newPage];
    router.push(`/dashboard/sales?view=${newView}`);
  };

  return (
    <SalesLayout
      activePage={activePage}
      setActivePage={handlePageChange}
    >
      {renderActivePageComponent()}
    </SalesLayout>
  );
};

export default SalesPage;