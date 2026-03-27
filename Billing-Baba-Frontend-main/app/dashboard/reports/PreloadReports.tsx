"use client";
import { useEffect } from "react";

// Prefetch all report page routes so navigation feels instant
const REPORT_ROUTES = [
  "/dashboard/reports/sale",
  "/dashboard/reports/purchases",
  "/dashboard/reports/profit-and-loss",
  "/dashboard/reports/stock-summary",
  "/dashboard/reports/day-book",
  "/dashboard/reports/all-transactions",
  "/dashboard/reports/party-statement",
  "/dashboard/reports/gstr-1",
  "/dashboard/reports/gstr-2",
  "/dashboard/reports/gstr-3b",
  "/dashboard/reports/bill-wise-profit",
  "/dashboard/reports/cash-flow",
  "/dashboard/reports/trial-balance",
  "/dashboard/reports/balance-sheet",
  "/dashboard/reports/all-parties",
  "/dashboard/reports/party-wise-profit-loss",
  "/dashboard/reports/party-report-by-item",
  "/dashboard/reports/sale-purchase-by-party",
  "/dashboard/reports/sale-purchase-by-party-group",
  "/dashboard/reports/gstr-9",
  "/dashboard/reports/sale-summary-by-hsn",
  "/dashboard/reports/sac-report",
  "/dashboard/reports/item-report-by-party",
  "/dashboard/reports/item-wise-profit-and-loss",
  "/dashboard/reports/low-stock-summary",
  "/dashboard/reports/stock-detail",
  "/dashboard/reports/item-detail",
  "/dashboard/reports/item-wise-discount",
  "/dashboard/reports/sale-purchase-report-by-item-category",
];

export default function PreloadReports() {
  useEffect(() => {
    const prefetch = () => {
      REPORT_ROUTES.forEach((route) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = route;
        document.head.appendChild(link);
      });
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(prefetch, { timeout: 2000 });
      return () => (window as any).cancelIdleCallback(id);
    } else {
      const t = setTimeout(prefetch, 1000);
      return () => clearTimeout(t);
    }
  }, []);

  return null;
}
