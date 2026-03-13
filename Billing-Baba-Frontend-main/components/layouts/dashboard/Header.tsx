// components/Header.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Menu, Plus, MoreVertical, AlertTriangle } from "lucide-react"
import AddMoreModal from "./AddMoreModal"; 

interface HeaderProps {
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Header({ setIsMobileMenuOpen }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        setIsModalOpen(prev => !prev);
      }
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full flex-shrink-0 items-center justify-between border-b border-gray-200/80 bg-white px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-full text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <button className="flex items-center gap-2.5 group">
            <span className="h-2.5 w-2.5 bg-pink-500 rounded-full"></span>
            <span className="text-md font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
              Enter Business Name
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-100/60 rounded-full hover:bg-red-100 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add Sale</span>
          </button>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100/60 rounded-full hover:bg-blue-100 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add Purchase</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100/60 rounded-full hover:bg-blue-100 transition-colors"
          >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add More</span>
          </button>
          <div className="h-6 w-px bg-gray-200 mx-1"></div>
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
              <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      {/* <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Your Free Plan has expired. To continue using Vyapar, {' '}
              <a href="#" className="font-medium text-red-800 underline hover:text-red-700">
                upgrade to our premium plan.
              </a>
            </p>
          </div>
        </div>
      </div> */}

      <AddMoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}