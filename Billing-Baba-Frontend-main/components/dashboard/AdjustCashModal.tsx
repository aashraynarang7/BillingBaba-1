"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from 'lucide-react'

// Component ke props ke liye interface
interface AdjustCashModalProps {
  children: React.ReactNode
  onSave?: () => void
}

const AdjustCashModal = ({ children, onSave }: AdjustCashModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    adjustmentType: 'add',
    amount: '0',
    adjustmentDate: '06/09/2025',
    description: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log('Cash Adjustment Details Saved:', formData)
    // TODO: Implement API call to save adjustment
    setIsOpen(false)
    if (onSave) onSave();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      {/* Dialog ka content */}
      <DialogContent className="max-w-md w-full mx-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-gray-800">Adjust Cash</DialogTitle>
        </DialogHeader>

        {/* Modal ka main body section */}
        <div className="space-y-6">
          {/* Cash Adjustment Type */}
          <div className="space-y-3">
            <RadioGroup
              value={formData.adjustmentType}
              onValueChange={(value) => handleInputChange('adjustmentType', value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add" id="add" />
                <Label htmlFor="add" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Add Cash
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reduce" id="reduce" />
                <Label htmlFor="reduce" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Reduce Cash
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-semibold text-gray-700 flex items-center">
              Enter Amount <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <Input
                id="amount"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="pl-8 h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
                placeholder="0"
              />
            </div>
            <p className="text-sm text-gray-600">Updated Cash: ₹{formData.amount}</p>
          </div>

          {/* Adjustment Date */}
          <div className="space-y-2">
            <Label htmlFor="adjustmentDate" className="text-sm font-semibold text-gray-700">
              Adjustment Date
            </Label>
            <div className="relative">
              <Input
                id="adjustmentDate"
                value={formData.adjustmentDate}
                onChange={(e) => handleInputChange('adjustmentDate', e.target.value)}
                className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
            />
          </div>
        </div>

        {/* Modal Footer with Action Buttons */}
        <DialogFooter className="pt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-all duration-200 font-semibold"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AdjustCashModal
