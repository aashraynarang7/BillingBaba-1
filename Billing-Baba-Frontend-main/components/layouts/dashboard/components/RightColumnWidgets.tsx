import React from 'react'
import { motion } from 'framer-motion'
import { Mountain, Paintbrush, Gamepad2, ShoppingCart, Tv, Plane, Plus, SendHorizonal } from 'lucide-react'

const goals = [
  { icon: Mountain, name: "Holidays", amount: 550, date: "12/20/20" },
  { icon: Paintbrush, name: "Renovation", amount: 200, date: "12/20/20" },
  { icon: Gamepad2, name: "Xbox", amount: 820, date: "12/20/20" },
];

const stats = [
  { icon: ShoppingCart, name: "Shopping", percentage: 52, color: "bg-orange-400" },
  { icon: Tv, name: "Electronics", percentage: 21, color: "bg-green-400" },
  { icon: Plane, name: "Travels", percentage: 74, color: "bg-blue-400" },
];

const users = [
  { name: "Ann", img: "https://i.pravatar.cc/150?u=ann" },
  { name: "Monica", img: "https://i.pravatar.cc/150?u=monica" },
  { name: "John", img: "https://i.pravatar.cc/150?u=john" },
  { name: "Mike", img: "https://i.pravatar.cc/150?u=mike" },
  { name: "Mia", img: "https://i.pravatar.cc/150?u=mia" },
];

const widgetVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function RightColumnWidgets() {
  return (
    <div className="space-y-8">
      <motion.div 
        className="bg-card rounded-2xl p-6 shadow-lg"
        variants={widgetVariants} initial="hidden" animate="visible" transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-foreground">Goals</h3>
          <motion.button whileHover={{ scale: 1.1 }} className="p-1 rounded-full hover:bg-muted"><Plus size={18} /></motion.button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mb-2 thin-scrollbar">
          {goals.map(g => (
            <motion.div whileHover={{ y: -5 }} key={g.name} className="flex-shrink-0 w-32 text-center bg-muted/50 p-4 rounded-xl cursor-pointer">
              <g.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
              <p className="font-bold text-lg">${g.amount}</p>
              <p className="text-xs text-muted-foreground">{g.date}</p>
              <p className="font-medium text-foreground mt-1 text-sm">{g.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-card rounded-2xl p-6 shadow-lg"
        variants={widgetVariants} initial="hidden" animate="visible" transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-foreground mb-4">Outcome Statistics</h3>
        <div className="space-y-5">
          {stats.map(s => (
            <div key={s.name} className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-foreground">{s.name}</span>
                  <span className="font-semibold text-foreground">{s.percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`${s.color} h-2 rounded-full`} style={{ width: `${s.percentage}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="bg-card rounded-2xl p-6 shadow-lg"
        variants={widgetVariants} initial="hidden" animate="visible" transition={{ duration: 0.4, delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-foreground mb-4">New transaction</h3>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 -mb-2 thin-scrollbar">
          {users.map(u => (
            <motion.div whileHover={{ scale: 1.1 }} key={u.name} className="flex-shrink-0 text-center cursor-pointer">
              <img src={u.img} alt={u.name} className="h-14 w-14 rounded-full object-cover mb-1 border-2 border-transparent hover:border-primary"/>
              <span className="text-xs text-muted-foreground">{u.name}</span>
            </motion.div>
          ))}
          <motion.button whileHover={{ scale: 1.1 }} className="flex-shrink-0 h-14 w-14 bg-muted/50 border-2 border-dashed rounded-full flex items-center justify-center">
            <Plus size={20} className="text-muted-foreground" />
          </motion.button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <input type="text" placeholder="0" className="flex-1 bg-muted/50 rounded-lg p-3 text-xl font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"/>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-4 py-3 rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2">
            <SendHorizonal size={16}/>
            <span>Send</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}