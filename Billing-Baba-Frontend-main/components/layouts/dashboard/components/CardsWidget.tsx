"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Wifi, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

const cardsData = [
  {
    id: 1, brand: "cloudcash", number: "5789 **** **** 2847", holder: "Mike Smith", expiry: "06/21",
    balance: "2850.75", income: "1500.50", outcome: "350.60", limit: 4000, used: 350.60,
    gradient: "from-blue-500 to-blue-700",
  },
  {
    id: 2, brand: "financepro", number: "9876 **** **** 5432", holder: "Jane Doe", expiry: "08/23",
    balance: "5320.10", income: "2200.00", outcome: "780.90", limit: 8000, used: 780.90,
    gradient: "from-gray-800 to-gray-900",
  },
];

export default function CardsWidget() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % cardsData.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + cardsData.length) % cardsData.length);

  const card = cardsData[activeIndex];
  const paymentProgress = (card.used / card.limit) * 100;

  return (
    <motion.div 
      className="bg-card rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <h3 className="text-xl font-semibold text-foreground mb-4">Cards</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handlePrev} className="p-2 rounded-full hover:bg-muted"><ChevronLeft size={20} /></motion.button>
          <div className="w-full h-52 relative overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} text-white rounded-2xl p-5 flex flex-col justify-between shadow-md`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{card.brand}</span>
                    <Wifi size={20} />
                  </div>
                  <span className="block text-xs opacity-70">PREMIUM ACCOUNT</span>
                </div>
                <div className="text-center font-mono text-xl tracking-wider">{card.number}</div>
                <div className="flex justify-between text-sm">
                  <div><span className="opacity-70">Card Holder</span><p className="font-medium">{card.holder}</p></div>
                  <div><span className="opacity-70">Expires</span><p className="font-medium">{card.expiry}</p></div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleNext} className="p-2 rounded-full hover:bg-muted"><ChevronRight size={20} /></motion.button>
        </div>
        <div className="flex flex-col justify-center border-l border-border pl-6">
          <span className="text-sm text-muted-foreground">Current balance</span>
          <p className="text-3xl font-bold text-foreground">$ {card.balance}</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-green-500">
              <ArrowUpCircle size={18} />
              <span>Income:</span>
              <span className="font-semibold ml-auto">$ {card.income}</span>
            </div>
            <div className="flex items-center gap-2 text-red-500">
              <ArrowDownCircle size={18} />
              <span>Outcome:</span>
              <span className="font-semibold ml-auto">$ {card.outcome}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Weekly payment limit</span>
          <span className="font-semibold text-foreground">${card.used} / ${card.limit}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: `${paymentProgress}%` }}></div>
        </div>
      </div>
    </motion.div>
  )
}