"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchSettings } from "@/lib/api";

export type AppSettings = {
    enablePasscode: boolean;
    businessCurrency: string;
    amountDecimalPlaces: number;
    showGSTIN: boolean;
    stopSaleOnNegativeStock: boolean;
    blockNewItemsFromTxn: boolean;
    blockNewPartiesFromTxn: boolean;
    showEstimate: boolean;
    showProformaInvoice: boolean;
    showSalePurchaseOrder: boolean;
    showOtherIncome: boolean;
    showFixedAssets: boolean;
    showDeliveryChallan: boolean;
    goodsReturnOnDeliveryChallan: boolean;
    printAmountInDeliveryChallan: boolean;
    enableGodownManagement: boolean;
    autoBackup: boolean;
    lastBackupAt: string | null;
    auditTrail: boolean;
    zoomLevel: number;
    multiFirmEnabled: boolean;

    // Transaction Header
    txnInvoiceBillNo: boolean;
    txnAddTime: boolean;
    txnPrintTime: boolean;
    txnCashSaleDefault: boolean;
    txnBillingNameOfParties: boolean;
    txnCustomerPODetails: boolean;

    // Items Table
    txnInclusiveExclusiveTax: boolean;
    txnDisplayPurchasePrice: boolean;
    txnShowLast5SalePrice: boolean;
    txnFreeItemQuantity: boolean;
    txnCount: boolean;

    // Taxes, Discount & Totals
    txnTransactionWiseTax: boolean;
    txnTransactionWiseDiscount: boolean;
    txnRoundOffTotal: boolean;
    txnRoundOffDirection: string;
    txnRoundOffTo: number;

    // More Transaction Features
    txnEwayBillNo: boolean;
    txnQuickEntry: boolean;
    txnNoInvoicePreview: boolean;
    txnPasscodeForEditDelete: boolean;
    txnDiscountDuringPayments: boolean;
    txnLinkPayments: boolean;
    txnDueDatesPaymentTerms: boolean;
    txnShowProfitOnSale: boolean;

    // Transaction Prefixes
    txnPrefixSale: string;
    txnPrefixCreditNote: string;
    txnPrefixSaleOrder: string;
    txnPrefixPurchaseOrder: string;
    txnPrefixEstimate: string;
    txnPrefixProformaInvoice: string;
    txnPrefixDeliveryChallan: string;
    txnPrefixPaymentIn: string;
    txnPrefixSaleFixedAsset: string;
    txnCustomPrefixes: string[];

    // Billing Type
    txnBillingType: string;
};

const DEFAULTS: AppSettings = {
    enablePasscode: false,
    businessCurrency: "₹",
    amountDecimalPlaces: 2,
    showGSTIN: true,
    stopSaleOnNegativeStock: false,
    blockNewItemsFromTxn: false,
    blockNewPartiesFromTxn: false,
    showEstimate: true,
    showProformaInvoice: true,
    showSalePurchaseOrder: true,
    showOtherIncome: true,
    showFixedAssets: true,
    showDeliveryChallan: true,
    goodsReturnOnDeliveryChallan: true,
    printAmountInDeliveryChallan: false,
    enableGodownManagement: false,
    autoBackup: false,
    lastBackupAt: null,
    auditTrail: true,
    zoomLevel: 100,
    multiFirmEnabled: false,

    // Transaction Header
    txnInvoiceBillNo: true,
    txnAddTime: false,
    txnPrintTime: false,
    txnCashSaleDefault: false,
    txnBillingNameOfParties: false,
    txnCustomerPODetails: false,

    // Items Table
    txnInclusiveExclusiveTax: true,
    txnDisplayPurchasePrice: true,
    txnShowLast5SalePrice: false,
    txnFreeItemQuantity: false,
    txnCount: false,

    // Taxes, Discount & Totals
    txnTransactionWiseTax: false,
    txnTransactionWiseDiscount: false,
    txnRoundOffTotal: true,
    txnRoundOffDirection: "Nearest",
    txnRoundOffTo: 1,

    // More Transaction Features
    txnEwayBillNo: false,
    txnQuickEntry: false,
    txnNoInvoicePreview: false,
    txnPasscodeForEditDelete: false,
    txnDiscountDuringPayments: false,
    txnLinkPayments: false,
    txnDueDatesPaymentTerms: false,
    txnShowProfitOnSale: false,

    // Transaction Prefixes
    txnPrefixSale: "None",
    txnPrefixCreditNote: "None",
    txnPrefixSaleOrder: "None",
    txnPrefixPurchaseOrder: "None",
    txnPrefixEstimate: "None",
    txnPrefixProformaInvoice: "None",
    txnPrefixDeliveryChallan: "None",
    txnPrefixPaymentIn: "None",
    txnPrefixSaleFixedAsset: "None",
    txnCustomPrefixes: [],

    // Billing Type
    txnBillingType: "full",
};

type SettingsContextValue = {
    settings: AppSettings;
    refresh: () => void;
};

const SettingsContext = createContext<SettingsContextValue>({
    settings: DEFAULTS,
    refresh: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<AppSettings>(DEFAULTS);

    const load = useCallback(() => {
        fetchSettings()
            .then(data => setSettings({ ...DEFAULTS, ...data }))
            .catch(() => {});
    }, []);

    useEffect(() => { load(); }, [load]);

    return (
        <SettingsContext.Provider value={{ settings, refresh: load }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
