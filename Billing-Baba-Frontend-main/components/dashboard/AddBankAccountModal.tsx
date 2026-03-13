"use client"

import React, { useState } from 'react'
import { createBankAccount } from '@/lib/api'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, Info, Check, Search } from 'lucide-react'
import AddCardMachineModal from './AddCardMachineModal'

interface AddBankAccountModalProps {
  children: React.ReactNode;
  onSaved?: () => void;
}

// Main Component Function
const AddBankAccountModal = ({ children, onSaved }: AddBankAccountModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    accountName: '',
    openingBalance: '',
    asOfDate: '06/09/2025',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    bankName: '',
    accountHolderName: '',
    printUpiQr: true,
    printBankDetails: true,
  })

  // Input fields mein badlav ko handle karne ke liye function
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.accountName) return;
    setIsSaving(true);
    try {
      const companyId = localStorage.getItem('activeCompanyId');
      await createBankAccount({ ...formData, companyId, openingBalance: Number(formData.openingBalance) || 0 });
      setIsOpen(false);
      onSaved?.();
    } catch (err) {
      console.error('Failed to save bank account', err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      
      {/* Dialog ka content, image jaisa wide look dene ke liye max-w-4xl */}
      <DialogContent className="max-w-7xl w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[1200px] h-[85vh] m-0 rounded-xl p-0 shadow-2xl border-0 flex flex-col" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">+</span>
            </div>
            Add Bank Account
          </DialogTitle>
        </DialogHeader>

        {/* Modal ka main body section with scroll */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Form Fields: 2 columns grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1 */}
            <div className="space-y-2">
              <Label htmlFor="accountName" className="text-sm font-semibold text-gray-700 flex items-center">
                Account Display Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="accountName"
                placeholder="Enter Account Display Name"
                value={formData.accountName}
                onChange={(e) => handleInputChange('accountName', e.target.value)}
                className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="openingBalance" className="text-sm font-semibold text-gray-700">
                Opening Balance
              </Label>
              <Input
                id="openingBalance"
                placeholder="Enter Opening Balance"
                value={formData.openingBalance}
                onChange={(e) => handleInputChange('openingBalance', e.target.value)}
                className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asOfDate" className="text-sm font-semibold text-gray-700">
                As of Date
              </Label>
              <div className="relative">
                <Input
                  id="asOfDate"
                  value={formData.asOfDate}
                  onChange={(e) => handleInputChange('asOfDate', e.target.value)}
                  className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-sm font-semibold text-gray-700 flex items-center">
                Account Number <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="accountNumber"
                placeholder="Enter Account Number"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ifscCode" className="text-sm font-semibold text-gray-700">
                IFSC Code
              </Label>
              <div className="relative">
                <Input
                  id="ifscCode"
                  placeholder="Enter IFSC"
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                  className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="upiId" className="text-sm font-semibold text-gray-700">
                UPI ID for QR Code
              </Label>
              <Input
                id="upiId"
                placeholder="Enter UPI ID"
                value={formData.upiId}
                onChange={(e) => handleInputChange('upiId', e.target.value)}
                className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
              />
            </div>

            {/* Row 3 */}
            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-sm font-semibold text-gray-700">
                Bank Name
              </Label>
              <Input
                id="bankName"
                placeholder="Enter Bank Name"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountHolderName" className="text-sm font-semibold text-gray-700">
                Account Holder Name
              </Label>
              <Input
                id="accountHolderName"
                placeholder="Enter Account Holder Name"
                value={formData.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
              />
            </div>
          </div>

          {/* Add more fields link */}
          <div className="pt-2">
            <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-all duration-200">
              + Add more fields
            </Button>
          </div>
          
          {/* Checkbox Options */}
          <div className="space-y-4 pt-4">
            <div 
              className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer"
              onClick={() => handleInputChange('printUpiQr', !formData.printUpiQr)}
            >
              <Checkbox
                id="printUpiQr"
                checked={formData.printUpiQr}
                onCheckedChange={(checked) => handleInputChange('printUpiQr', checked as boolean)}
                className="w-5 h-5"
              />
              <Label htmlFor="printUpiQr" className="text-sm font-medium text-gray-700 flex-1 cursor-pointer">
                Print UPI QR Code on Invoices
              </Label>
              <Info className="h-4 w-4 text-gray-400 hover:text-blue-500 cursor-help" />
            </div>

            <div 
              className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer"
              onClick={() => handleInputChange('printBankDetails', !formData.printBankDetails)}
            >
              <Checkbox
                id="printBankDetails"
                checked={formData.printBankDetails}
                onCheckedChange={(checked) => handleInputChange('printBankDetails', checked as boolean)}
                className="w-5 h-5"
              />
              <Label htmlFor="printBankDetails" className="text-sm font-medium text-gray-700 flex-1 cursor-pointer">
                Print Bank Details on Invoices
              </Label>
              <Info className="h-4 w-4 text-gray-400 hover:text-blue-500 cursor-help" />
            </div>
          </div>

          {/* Card Machine Banner */}
          <div className="bg-blue-600 rounded-xl p-8 text-white mt-6 shadow-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-3 text-white">Add Card Machine & Collect Payment</h3>
              <p className="text-base text-blue-100 mb-6">Seamless In-Store Payments with EDC Machine</p>
              
              {/* Bullet Points */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium text-sm">All Payment Modes Accepted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium text-sm">High Transaction Success Rates</span>
                </div>
              </div>
              
              {/* Red Button */}
              <AddCardMachineModal>
                <Button 
                  className="bg-red-500 text-white hover:bg-red-600 rounded-lg font-bold text-base px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Add Card Machine
                </Button>
              </AddCardMachineModal>
            </div>
          </div>
        </div>

        {/* Modal Footer with Action Buttons */}
        <DialogFooter className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1 px-6 py-2 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto order-1 sm:order-2 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              {isSaving ? 'Saving...' : 'Save Details'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddBankAccountModal