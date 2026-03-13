"use client"

import React, { useState, Suspense } from "react"
import Sidebar from "@/components/layouts/dashboard/sidebar"
import Header from "@/components/layouts/dashboard/Header"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation";

const SidebarSkeleton = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-gray-700 bg-gray-900 md:relative md:w-[5rem]">
      <div className="flex h-16 items-center px-4">
        <div className="h-10 w-full animate-pulse rounded-full bg-gray-800 md:h-10 md:w-10 md:rounded-lg"></div>
      </div>
      <div className="px-3">
        <div className="mb-2 h-10 animate-pulse rounded-lg bg-gray-800"></div>
        <div className="mb-2 h-10 animate-pulse rounded-lg bg-gray-800"></div>
        <div className="mb-2 h-10 animate-pulse rounded-lg bg-gray-800"></div>
        <div className="mb-2 h-10 animate-pulse rounded-lg bg-gray-800"></div>
        <div className="mb-2 h-10 animate-pulse rounded-lg bg-gray-800"></div>
      </div>
    </aside>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname();
  const isCompanyPage = pathname?.startsWith('/dashboard/company') || false;
  const isPosPage = pathname?.startsWith('/dashboard/pos') || false;

  const hideSidebarAndHeader = isCompanyPage || isPosPage;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {!hideSidebarAndHeader && (
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar isMobileMenuOpen={isMobileMenuOpen} />
        </Suspense>
      )}

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col">
        {!hideSidebarAndHeader && <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}