"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Data structure for all report items, organized into groups
const reportItems = [
  // Group 1: Transaction
  { type: "heading", label: "Transaction report" },
  { href: "/dashboard/reports/sale", label: "Sale" },
  { href: "/dashboard/reports/purchases", label: "Purchase" },
  { href: "/dashboard/reports/day-book", label: "Day book" },
  { href: "/dashboard/reports/all-transactions", label: "All Transactions" },
  { href: "/dashboard/reports/profit-and-loss", label: "Profit And Loss" },
  { href: "/dashboard/reports/bill-wise-profit", label: "Bill Wise Profit" },
  // { href: "/dashboard/reports/sale-aging", label: "Sale Aging" },
  { href: "/dashboard/reports/cash-flow", label: "Cash flow" },
  {
    href: "/dashboard/reports/trial-balance",
    label: "Trial Balance Report",
    isNew: true,
  },
  { href: "/dashboard/reports/balance-sheet", label: "Balance Sheet" },

  // --- 👇 'Party report' ग्र ---
  { type: "heading", label: "Party report" },
  { href: "/dashboard/reports/party-statement", label: "Party Statement" },
  {
    href: "/dashboard/reports/party-wise-profit-loss",
    label: "Party wise Profit & Loss",
  },
  { href: "/dashboard/reports/all-parties", label: "All parties" },
  {
    href: "/dashboard/reports/party-report-by-item",
    label: "Party Report By Item",
  },
  {
    href: "/dashboard/reports/sale-purchase-by-party",
    label: "Sale Purchase By Party",
  },
  {
    href: "/dashboard/reports/sale-purchase-by-party-group",
    label: "Sale Purchase By Party Group",
  },

  // Group 2: GST reports
  { type: "heading", label: "GST reports" },
  { href: "/dashboard/reports/gstr-1", label: "GSTR 1" },
  { href: "/dashboard/reports/gstr-2", label: "GSTR 2" },
  { href: "/dashboard/reports/gstr-3b", label: "GSTR 3 B" },
  { href: "/dashboard/reports/gstr-9", label: "GSTR 9" },
  {
    href: "/dashboard/reports/sale-summary-by-hsn",
    label: "Sale Summary By HSN",
  },
  { href: "/dashboard/reports/sac-report", label: "SAC Report" },

  // Group 3: Item/Stock report
  { type: "heading", label: "Item/ Stock report" },
  { href: "/dashboard/reports/stock-summary", label: "Stock summary" },
  {
    href: "/dashboard/reports/item-report-by-party",
    label: "Item Report By Party",
  },
  {
    href: "/dashboard/reports/item-wise-profit-and-loss",
    label: "Item Wise Profit And Loss",
  },
  { href: "/dashboard/reports/low-stock-summary", label: "Low Stock Summary" },
  { href: "/dashboard/reports/stock-detail", label: "Stock Detail" },
  { href: "/dashboard/reports/item-detail", label: "Item Detail" },
  {
    href: "/dashboard/reports/sale-purchase-report-by-item-category",
    label: "Sale/ Purchase Report By Item Category",
  },
  {
    href: "/dashboard/reports/stock-summary-report-by-item-category",
    label: "Stock Summary Report By Item Category",
  },
  { href: "/dashboard/reports/item-category-wise-profit-and-loss", label: "Item Category Wise Profit And Loss" },
  { href: "/dashboard/reports/item-wise-discount", label: "Item Wise Discount" },
  { href: "/dashboard/reports/manufacturing-report", label: "Manufacturing Report" },
  { href: "/dashboard/reports/consumption-report", label: "Consumption Report" },
  { href: "/dashboard/reports/stock-transfer-report", label: "Stock Transfer Report" },

  // Business Status
  { type: "heading", label: "Business Status" },
  { href: "/dashboard/reports/bank-statement", label: "Bank Statement" },

  // Expense report
  { type: "heading", label: "Expense report" },
  { href: "/dashboard/reports/expense", label: "Expense" },
  { href: "/dashboard/reports/expense-category-report", label: "Expense Category Report" },
  { href: "/dashboard/reports/expense-item-report", label: "Expense Item Report" },

  // Sale/Purchase Order report
  { type: "heading", label: "Sale/ Purchase Order report" },
  { href: "/dashboard/reports/sale-purchase-orders", label: "Sale/ Purchase Orders" },
  { href: "/dashboard/reports/sale-purchase-order-item", label: "Sale/ Purchase Order Item" },

  // Other Income report
  { type: "heading", label: "Other Income report" },
  { href: "/dashboard/reports/other-income", label: "Other Income" },
  { href: "/dashboard/reports/other-income-category-report", label: "Other Income Category Report" },
  { href: "/dashboard/reports/other-income-item-report", label: "Other Income Item Report" },
];

export default function ReportsSidebar() {
  const pathname = usePathname();

  // Preload heavy shared components used across report pages on idle
  useEffect(() => {
    const preload = () => {
      import('@/components/ui/calendar');
      import('@/components/ui/accordion');
      import('@/app/dashboard/sales/component/TransactionsTable');
    };
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(preload, { timeout: 2000 });
      return () => (window as any).cancelIdleCallback(id);
    } else {
      const t = setTimeout(preload, 1000);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    // Main container with scrolling enabled
    <div className="w-[240px] flex-shrink-0 bg-white border-r border-gray-200 h-full overflow-y-auto thin-scrollbar">
      <ul className="py-2">
        {reportItems.map((item, index) => {
          // Logic for rendering a non-clickable heading
          if (item.type === "heading") {
            // Find the start and end of the current group to check for active links
            const nextHeadingIndex =
              reportItems.findIndex(
                (nextItem, i) => i > index && nextItem.type === "heading"
              ) || reportItems.length;
            const groupLinks = reportItems.slice(index + 1, nextHeadingIndex);
            const isGroupActive = groupLinks.some(
              (link) => link.href && pathname.startsWith(link.href)
            );

            return (
              <li key={index} className={index > 0 ? "mt-2" : ""}>
                <h3
                  className={`px-6 py-2 text-sm font-normal transition-colors
                  ${isGroupActive ? "bg-teal-50 text-teal-700 font-semibold" : "text-gray-500"}`}
                >
                  {item.label}
                </h3>
              </li>
            );
          }

          // Logic for rendering a clickable link
          const isActive = pathname === item.href;

          return (
            <li key={index}>
              <Link
                href={item.href!}
                className={`flex items-center justify-between text-sm py-2.5 pl-6 pr-4 cursor-pointer transition-colors relative
                  ${isActive
                    ? "bg-slate-200 text-gray-800 font-semibold" // Active state style
                    : "text-gray-700 hover:bg-slate-100" // Normal and hover state
                  }`}
              >
                {/* Blue border for active link */}
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-blue-600"></div>
                )}

                <span>{item.label}</span>

                {/* Red dot for new items */}
                {item.isNew && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
