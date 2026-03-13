"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SearchableItem {
  name: string;
  path: string;
  parent?: string;
}

interface SubItem {
  name: string;
  path: string;
}

interface MenuItem {
  name: string;
  icon: LucideIcon;
  type: "link" | "action" | "dropdown";
  path?: string;
  subItems?: SubItem[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allItems: MenuItem[];
}

export default function SearchModal({
  isOpen,
  onClose,
  allItems,
}: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const searchableList = useMemo(() => {
    const list: SearchableItem[] = [];
    allItems.forEach((item) => {
      if (item.path && (item.type === "link" || item.type === "action")) {
        list.push({ name: item.name, path: item.path });
      }
      if (item.subItems) {
        item.subItems.forEach((sub) => {
          list.push({ name: sub.name, path: sub.path, parent: item.name });
        });
      }
    });
    return list;
  }, [allItems]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return searchableList;
    }
    return searchableList.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, searchableList]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl"
          >
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Open anything like invoices, reports..."
                className="w-full rounded-t-xl border-b border-gray-200 bg-transparent py-4 pl-12 pr-12 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
                autoFocus
              />
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-2">
              <p className="px-4 py-2 text-xs font-semibold uppercase text-gray-400">
                {searchTerm ? "Results" : "All Pages"}
              </p>
              <ul className="max-h-[60vh] overflow-y-auto">
                {filteredItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={onClose}
                      className="block rounded-md px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {item.name}
                      {item.parent && (
                        <span className="ml-2 text-xs text-gray-400">
                          in {item.parent}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
                {filteredItems.length === 0 && (
                  <li className="px-4 py-10 text-center text-sm text-gray-500">
                    No results found.
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}