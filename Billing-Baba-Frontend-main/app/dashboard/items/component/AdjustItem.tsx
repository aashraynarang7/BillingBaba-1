// File: components/component/AdjustItem.tsx

import { useState } from 'react';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';

// Props definition
interface AdjustItemProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdjustItem = ({ isOpen, onClose }: AdjustItemProps) => {
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'reduce'>('add');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date('2025-09-04'));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  if (!isOpen) return null;

  // Toggle switch component
  const StockToggle = () => (
    <div className="flex items-center space-x-3 text-sm font-semibold">
      <span onClick={() => setAdjustmentType('add')} className={`cursor-pointer transition-colors ${adjustmentType === 'add' ? 'text-[var(--secondary-blue)]' : 'text-gray-500'}`}>Add Stock</span>
      <button type="button" className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${adjustmentType === 'add' ? 'bg-[var(--secondary-blue)]' : 'bg-gray-300'}`} onClick={() => setAdjustmentType((prev) => (prev === 'add' ? 'reduce' : 'add'))}>
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${adjustmentType === 'add' ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
      <span onClick={() => setAdjustmentType('reduce')} className={`cursor-pointer transition-colors ${adjustmentType === 'reduce' ? 'text-[var(--secondary-blue)]' : 'text-gray-500'}`}>Reduce Stock</span>
    </div>
  );

  return (
    // Main modal overlay
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-opacity-30 backdrop-blur-xs">
      
      {/* Overlay to close the calendar when it's open */}
      {isCalendarOpen && (
        <div 
          className="fixed inset-0 z-[51]"
          onClick={() => setIsCalendarOpen(false)} 
        />
      )}

      {/* Main Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all z-[52]">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-gray-800">Stock Adjustment</h2>
            <StockToggle />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors"><X size={24} /></button>
        </div>

        <div className="p-6 pt-2">
          <div className="flex justify-between items-end pb-4 border-b border-gray-200">
            <div>
              <label className="text-xs text-gray-500">Item Name</label>
              <p className="mt-1 text-md font-semibold text-gray-900">Sample Item</p>
            </div>
            
            <div className="relative w-48">
              <div className={`relative border rounded-md px-3 py-2 transition-colors ${isCalendarOpen ? 'border-[var(--secondary-blue)]' : 'border-gray-300'}`}>
                <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-500">Adjustment Date</label>
                <button type="button" onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="block w-full text-left border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm bg-transparent">
                  {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Select Date'}
                </button>
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
              
              {isCalendarOpen && (
                <div 
                  className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[53]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                    classNames={{
                      root: 'p-2', nav: 'flex items-center justify-between p-2 bg-gray-100 rounded-t-md',
                      nav_button: 'h-7 w-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors',
                      caption_label: 'font-bold text-indigo-800', head_row: 'flex justify-center mt-2',
                      head_cell: 'w-9 h-9 flex items-center justify-center font-semibold text-sm text-gray-700',
                      table: 'w-full border-collapse mt-1', tbody: 'text-center', row: 'flex w-full mt-1', cell: 'p-0',
                      day: 'h-9 w-9 flex items-center justify-center rounded-md border border-gray-200 transition-colors hover:bg-gray-100',
                      day_selected: 'bg-yellow-300 text-gray-900 font-bold border-transparent hover:bg-yellow-400',
                      day_today: 'font-bold text-[var(--secondary-blue)]', day_outside: 'text-gray-400 opacity-70',
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <input type="text" placeholder="Total Qty" className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            <input type="text" placeholder="At Price" className="w-full p-2 border border-gray-300 rounded-md text-sm" />
            <input type="text" placeholder="Details" className="w-full p-2 border border-gray-300 rounded-md text-sm" />
          </div>

          <div className="flex justify-end mt-8">
            <button onClick={onClose} className="bg-[var(--secondary-blue)] text-white font-bold py-2 px-8 rounded-lg shadow-lg hover:opacity-90 transition-opacity">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustItem;