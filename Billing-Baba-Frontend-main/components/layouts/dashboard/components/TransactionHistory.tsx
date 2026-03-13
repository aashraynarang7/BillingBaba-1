import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Film, Utensils, Shirt, Ship, LucideProps } from 'lucide-react'

type CategoryStyle = {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  color: string;
}

const categoryStyles: { [key: string]: CategoryStyle } = {
  Shopping: { icon: ShoppingCart, color: "bg-orange-100 text-orange-600" },
  Electronics: { icon: Film, color: "bg-blue-100 text-blue-600" },
  Food: { icon: Utensils, color: "bg-red-100 text-red-600" },
  Sport: { icon: Shirt, color: "bg-green-100 text-green-600" },
  Travel: { icon: Ship, color: "bg-purple-100 text-purple-600" },
};

const transactions = [
  { receiver: "Tesco Market", type: "Shopping", date: "13 Dec 2020", amount: -75.67 },
  { receiver: "ElectroMen Market", type: "Electronics", date: "14 Dec 2020", amount: -250.00 },
  { receiver: "Fiorgio Restaurant", type: "Food", date: "07 Dec 2020", amount: -19.50 },
  { receiver: "John Mathew Kayne", type: "Sport", date: "06 Dec 2020", amount: -350 },
  { receiver: "Ann Marlin", type: "Travel", date: "31 Nov 2020", amount: -430 },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TransactionHistory() {
  return (
    <motion.div 
      className="bg-card rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <h3 className="text-xl font-semibold text-foreground mb-4">Transaction history</h3>
      <motion.div 
        className="space-y-2"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {transactions.map((t, i) => {
          const { icon: Icon, color } = categoryStyles[t.type] || categoryStyles.Shopping;
          return (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t.receiver}</p>
                  <p className="text-sm text-muted-foreground">{t.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${t.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ${t.amount.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">{t.date}</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}