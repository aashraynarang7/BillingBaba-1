"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Role = 'owner' | 'salesman' | 'biller' | 'stock-keeper' | 'ca-accountant' | 'secondary-admin';

interface RoleContextType {
  role: Role;
  isOwner: boolean;
  can: (permission: string) => boolean;
}

const RoleContext = createContext<RoleContextType>({
  role: 'owner',
  isOwner: true,
  can: () => true,
});

// Permission matrix based on notebook: what each role can ACCESS (sidebar visibility)
// Keys: sale, purchase, expense, cashBank, reports, settings, parties, items,
//       paymentIn, paymentOut, purchaseBills, purchaseOrders, creditNote,
//       deliveryChallan, estimate, debitNote, grows, syncBackup, utilities, home
const ROLE_ACCESS: Record<Role, Record<string, boolean>> = {
  owner: {
    home: true, parties: true, items: true,
    sale: true, paymentIn: true, creditNote: true, deliveryChallan: true, estimate: true,
    purchase: true, expense: true, paymentOut: true, purchaseBills: true,
    purchaseOrders: true, debitNote: true,
    cashBank: true, reports: true, settings: true,
    grows: true, syncBackup: true, utilities: true,
  },
  // Salesman: sale + expenses only; no purchase bills/payment-out/cash-bank
  salesman: {
    home: false, parties: true, items: true,
    sale: true, paymentIn: true, creditNote: true, deliveryChallan: true, estimate: true,
    purchase: false, expense: true, paymentOut: false, purchaseBills: false,
    purchaseOrders: false, debitNote: false,
    cashBank: false, reports: true, settings: false,
    grows: true, syncBackup: false, utilities: true,
  },
  // Biller: sale (full) + purchase (limited view) + expenses; no cash-bank
  biller: {
    home: false, parties: true, items: true,
    sale: true, paymentIn: true, creditNote: true, deliveryChallan: true, estimate: true,
    purchase: true, expense: true, paymentOut: true, purchaseBills: true,
    purchaseOrders: true, debitNote: false,
    cashBank: false, reports: true, settings: false,
    grows: true, syncBackup: false, utilities: true,
  },
  // Stock Keeper: purchase (full) + items/godown; no sale, no cash-bank
  'stock-keeper': {
    home: false, parties: true, items: true,
    sale: false, paymentIn: false, creditNote: false, deliveryChallan: false, estimate: false,
    purchase: true, expense: true, paymentOut: true, purchaseBills: true,
    purchaseOrders: true, debitNote: true,
    cashBank: false, reports: true, settings: false,
    grows: true, syncBackup: false, utilities: true,
  },
  // CA/Accountant: everything except Grow Your Business
  'ca-accountant': {
    home: true, parties: true, items: true,
    sale: true, paymentIn: true, creditNote: true, deliveryChallan: true, estimate: true,
    purchase: true, expense: true, paymentOut: true, purchaseBills: true,
    purchaseOrders: true, debitNote: true,
    cashBank: true, reports: true, settings: true,
    grows: false, syncBackup: true, utilities: true,
  },
  'secondary-admin': {
    home: true, parties: true, items: true,
    sale: true, paymentIn: true, creditNote: true, deliveryChallan: true, estimate: true,
    purchase: true, expense: true, paymentOut: true, purchaseBills: true,
    purchaseOrders: true, debitNote: true,
    cashBank: true, reports: true, settings: true,
    grows: true, syncBackup: true, utilities: true,
  },
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('owner');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyRole') : null;
    const isShared = typeof window !== 'undefined' ? localStorage.getItem('isSharedCompany') : null;
    if (isShared === 'true' && stored) {
      setRole(stored as Role);
    } else {
      setRole('owner');
    }

    const handleStorage = () => {
      const r = localStorage.getItem('activeCompanyRole');
      const s = localStorage.getItem('isSharedCompany');
      setRole(s === 'true' && r ? (r as Role) : 'owner');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isOwner = role === 'owner';

  const can = (permission: string): boolean => {
    return ROLE_ACCESS[role]?.[permission] ?? false;
  };

  return (
    <RoleContext.Provider value={{ role, isOwner, can }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
export default RoleContext;
