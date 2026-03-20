"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "@uidotdev/usehooks";
import {
  Home,
  Users,
  Package,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
  Landmark,
  BarChart3,
  Settings,
  Award,
  ChevronDown,
  ChevronUp,
  Plus,
  RotateCcw,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Building2,
  Edit2,
  RefreshCw,
  LogOut,
} from "lucide-react";
import SearchModal from "./SearchModal";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SubItem {
  name: string;
  type: "link" | "action";
  path: string;
}

interface MenuItem {
  name: string;
  icon: LucideIcon;
  type: "link" | "action" | "dropdown";
  path?: string;
  subItems?: SubItem[];
}

const menuItems: MenuItem[] = [
  { name: "Home", icon: Home, type: "link", path: "/dashboard/home" },
  {
    name: "Parties",
    icon: Users,
    type: "dropdown",
    path: "/dashboard/party",
    subItems: [
      { name: "Party Details", type: "action", path: "/dashboard/party/details" },
      { name: "Whatsapp Connect", type: "link", path: "/dashboard/party/whatsapp-connect" },
      { name: "Billing Baba Network", type: "link", path: "/dashboard/party/network" },
    ],
  },
  { name: "Items", icon: Package, type: "action", path: "/dashboard/items" },
  {
    name: "Sale",
    icon: ReceiptText,
    type: "dropdown",
    path: "/dashboard/sales",
    subItems: [
      { name: "Sale Invoices", type: "action", path: "/dashboard/sales?view=invoices" },
      { name: "Estimate/ Quotation", type: "action", path: "/dashboard/sales?view=quotation" },
      { name: "Proforma Invoice", type: "link", path: "/dashboard/sales?view=proforma" },
      { name: "Payment-In", type: "action", path: "/dashboard/sales?view=payment-in" },
      { name: "Sale Order", type: "link", path: "/dashboard/sales?view=order" },
      { name: "Delivery Challan", type: "link", path: "/dashboard/sales?view=challan" },
      { name: "Job Work Out", type: "link", path: "/dashboard/sales?view=job-work-out" },
      { name: "Sale Return/ Credit Note", type: "action", path: "/dashboard/sales?view=return" },
      { name: "Billing Baba POS", type: "link", path: "/dashboard/sales?view=pos" },
    ],
  },
  {
    name: "Purchase & Expense",
    icon: ShoppingCart,
    type: "dropdown",
    path: "/dashboard/purchases",
    subItems: [
      { name: "Purchase Bills", type: "action", path: "/dashboard/purchases/bills" },
      { name: "Payment-Out", type: "action", path: "/dashboard/purchases/payment-out" },
      { name: "Expenses", type: "action", path: "/dashboard/purchases/expenses" },
      { name: "Purchase FA", type: "action", path: "/dashboard/purchases/fa" },
      { name: "Purchase Order", type: "link", path: "/dashboard/purchases/order" },
      { name: "Purchase Return/ Dr. Note", type: "action", path: "/dashboard/purchases/return" },
    ],
  },
  {
    name: "Grow Your Business",
    icon: TrendingUp,
    type: "dropdown",
    path: "/dashboard/business",
    subItems: [
      { name: "Marketing Tools", type: "link", path: "/dashboard/business/marketing-tools" },
      { name: "WhatsApp Marketing", type: "link", path: "/dashboard/business/whatsapp-marketing" },
      { name: "Online Store", type: "link", path: "/dashboard/business/online-store" },
      { name: "Ads Manager", type: "link", path: "/dashboard/business/ads-manager" },
      { name: "Business Horoscope", type: "link", path: "/dashboard/business/business-horoscope" },
      { name: "Google Profile Manager", type: "link", path: "/dashboard/business/google-profile" },
    ],
  },
  {
    name: "Cash & Bank",
    icon: Landmark,
    type: "dropdown",
    path: "/dashboard/cash-bank",
    subItems: [
      { name: "Bank Accounts", type: "link", path: "/dashboard/cash-bank/bank-accounts" },
      { name: "Cash In Hand", type: "link", path: "/dashboard/cash-bank/cash-inhand" },
      { name: "Cheques", type: "link", path: "/dashboard/cash-bank/cheques" },
      { name: "Loan Accounts", type: "link", path: "/dashboard/cash-bank/loan-account" },
    ],
  },
  { name: "Reports", icon: BarChart3, type: "link", path: "/dashboard/reports" },
  {
    name: "Sync, Share & Backup",
    icon: RotateCcw,
    type: "dropdown",
    path: "/dashboard/sync-share-backup",
    subItems: [
      { name: "Sync & Share", type: "action", path: "/dashboard/sync-share-backup?view=sync-share" },
      { name: "Add Users", type: "action", path: "/dashboard/sync-share-backup/sync-share" },
      { name: "Auto Backup", type: "action", path: "/dashboard/sync-share-backup?view=auto-backup" },
      { name: "Backup To Computer", type: "action", path: "/dashboard/sync-share-backup?view=backup-computer" },
      { name: "Backup To Drive", type: "action", path: "/dashboard/sync-share-backup?view=backup-drive" },
      { name: "Restore Backup", type: "action", path: "/dashboard/sync-share-backup?view=restore-backup" },
    ],
  },
  {
    name: "Utilities",
    icon: RotateCcw,
    type: "dropdown",
    path: "/dashboard/utilities",
    subItems: [
      { name: "Import Items", type: "action", path: "/dashboard/utilities/import-items" },
      { name: "Set Up My Business", type: "action", path: "/dashboard/utilities/set-up-my-business" },
      { name: "Accountant Access", type: "action", path: "/dashboard/utilities/accountant-access" },
      { name: "Barcode Generator", type: "action", path: "/dashboard/utilities/barcode-generator" },
      { name: "Update Items in Bulk", type: "action", path: "/dashboard/utilities/update-items-in-bulk" },
      { name: "Import From Tally", type: "action", path: "/dashboard/utilities/import-from-tally" },
      { name: "Import Parties", type: "action", path: "/dashboard/utilities/import-parties" },
      { name: "Exports to Tally", type: "action", path: "/dashboard/utilities/exports-to-tally" },
      { name: "Export Items", type: "action", path: "/dashboard/utilities/export-items" },
      { name: "Verify My Data", type: "action", path: "/dashboard/utilities/verify-my-data" },
      { name: "Recycle Bin", type: "action", path: "/dashboard/utilities/recycle-bin" },
      { name: "Close Financial Year", type: "action", path: "/dashboard/utilities/close-financial-year" },
    ],
  },
  { name: "Settings", icon: Settings, type: "link", path: "/dashboard/setting" },
  { name: "Plans & Pricing", icon: Award, type: "link", path: "/dashboard/plan-and-pricing" },
];

interface SidebarProps {
  isMobileMenuOpen: boolean;
}

export default function Sidebar({ isMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view");
  const router = useRouter();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string>("Company");
  const size = useWindowSize();
  const isMobile = size.width ? size.width < 768 : false;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "f") {
        event.preventDefault();
        setIsModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Fetch active company name
  useEffect(() => {
    const companyId = localStorage.getItem("activeCompanyId");
    if (!companyId) return;
    fetch(`http://localhost:5000/api/companies`)
      .then(r => r.json())
      .then((companies: any[]) => {
        const found = companies.find((c: any) => c._id === companyId);
        if (found?.name) setCompanyName(found.name);
      })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const activeParent = menuItems.find(
      (item) => item.path && pathname.startsWith(item.path) && item.subItems
    );
    if (activeParent) {
      setOpenDropdown(activeParent.name);
    } else {
      setOpenDropdown(null);
    }
  }, [pathname]);

  const sidebarVariants = {
    mobileClosed: { x: "-100%" },
    mobileOpen: { x: 0 },
    desktopCollapsed: { width: "5rem" },
    desktopExpanded: { width: "16rem" },
  };

  const currentVariant = isMobile
    ? isMobileMenuOpen ? "mobileOpen" : "mobileClosed"
    : isExpanded ? "desktopExpanded" : "desktopCollapsed";

  const showText = isMobile || isExpanded;

  const handleDropdownClick = (itemName: string) => {
    setOpenDropdown(openDropdown === itemName ? null : itemName);
  };

  return (
    <>
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allItems={menuItems}
      />
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={currentVariant}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed left-0 top-0 z-40 h-screen bg-gray-900 text-gray-300 w-64 md:relative md:w-auto border-r border-gray-700"
      >
        {!isMobile && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute top-4 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-gray-300 shadow-md hover:bg-gray-700"
          >
            {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        )}

        <div className="flex h-full flex-col">
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <AnimatePresence mode="wait">
              {showText ? (
                <motion.div
                  key="search-bar"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  <div className="flex h-10 w-full cursor-pointer items-center rounded-full border border-gray-700 bg-gray-800 px-4 text-sm text-gray-400">
                    Open Anything (Ctrl+F)
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="search-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsModalOpen(true)}
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-700"
                >
                  <Search className="h-5 w-5 text-gray-300" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex-grow overflow-y-auto px-3 thin-scrollbar">
            <ul>
              {menuItems.map((item) => {
                const isAnySubItemActive = item.subItems
                  ? item.subItems.some((sub) => {
                    const [path, query] = sub.path.split("?");
                    const viewParam = new URLSearchParams(query || "").get("view");
                    return pathname === path && currentView === viewParam;
                  })
                  : false;
                const isActive = (item.path && pathname.startsWith(item.path) && !item.subItems) || isAnySubItemActive;

                return (
                  <React.Fragment key={item.name}>
                    <li className="group relative">
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-0 h-full w-1 bg-red-500"
                          layoutId="active-line-indicator"
                        />
                      )}
                      <Link
                        href={item.path || "#"}
                        onClick={(e) => {
                          if (item.type === "dropdown") {
                            e.preventDefault();
                            handleDropdownClick(item.name);
                          }
                        }}
                        className={`flex items-center rounded-lg py-2 transition-colors duration-200 ${isActive ? "text-white" : "hover:text-white"
                          } ${showText ? "px-4" : "justify-center"}`}
                      >
                        <item.icon className="z-10 h-5 w-5 flex-shrink-0" />
                        <AnimatePresence>
                          {showText && (
                            <>
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                                className="z-10 ml-4 flex-1 whitespace-nowrap text-sm font-medium"
                              >
                                {item.name}
                              </motion.span>
                              {item.type === "dropdown" && (
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2, delay: 0.1 }}
                                  className="z-10"
                                >
                                  {openDropdown === item.name ? (<ChevronUp className="h-4 w-4" />) : (<ChevronDown className="h-4 w-4" />)}
                                </motion.span>
                              )}
                              {item.type === "action" && (
                                <Plus className="h-4 w-4 z-10" />
                              )}
                            </>
                          )}
                        </AnimatePresence>
                      </Link>

                      {!showText && (
                        <div className="absolute left-full ml-3 z-50 hidden items-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold text-white opacity-0 group-hover:flex group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          {item.name}
                        </div>
                      )}

                      {isActive && (
                        <motion.div
                          layoutId="active-bg-indicator"
                          className="absolute inset-0 rounded-lg bg-gray-800 -z-10"
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                      )}
                    </li>

                    <AnimatePresence>
                      {showText && item.type === "dropdown" && openDropdown === item.name && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-8"
                        >
                          {item.subItems?.map((subItem) => {
                            const [path, query] = subItem.path.split("?");
                            const viewParam = new URLSearchParams(query || "").get("view");
                            const isSubActive = pathname === path && currentView === viewParam;
                            return (
                              <li key={subItem.name} className="relative py-1.5">
                                <Link
                                  href={subItem.path}
                                  className={`flex items-center text-sm transition-colors ${isSubActive ? "text-white font-medium" : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                  <span>{subItem.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </ul>
          </nav>

          {/* Company name footer */}
          <div className="flex-shrink-0 border-t border-gray-700 px-3 py-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${!showText ? "justify-center" : ""}`}>
                  {/* Avatar */}
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white uppercase">
                    {companyName.charAt(0)}
                  </div>
                  <AnimatePresence>
                    {showText && (
                      <motion.div
                        key="company-name"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-1 items-center justify-between overflow-hidden"
                      >
                        <span className="truncate text-sm font-medium">{companyName}</span>
                        <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-52 mb-1">
                <div className="px-3 py-2 border-b">
                  <p className="text-xs text-gray-500">Active Company</p>
                  <p className="font-semibold text-sm text-gray-800 truncate">{companyName}</p>
                </div>
                <DropdownMenuItem onClick={() => router.push("/dashboard/company/new")} className="gap-2 cursor-pointer">
                  <Edit2 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/company")} className="gap-2 cursor-pointer">
                  <RefreshCw className="h-4 w-4" />
                  <span>Switch Company</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={() => { localStorage.clear(); router.push("/login"); }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.aside>
    </>
  );
}