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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from 'lucide-react'

// Component ke props ke liye interface
interface AddLoanAccountModalProps {
  children: React.ReactNode // Yeh modal ko open karne wala button hoga
}

// Main Component Function
const AddLoanAccountModal = ({ children }: AddLoanAccountModalProps) => {
  // Modal ke open/close state ko manage karne ke liye
  const [isOpen, setIsOpen] = useState(false)

  // Form ke data ko manage karne ke liye
  const [formData, setFormData] = useState({
    accountName: '',
    lenderBank: '',
    accountNumber: '',
    description: '',
    currentBalance: '',
    balanceAsOf: '06/09/2025',
    loanReceivedIn: 'Cash',
    interestRate: '',
    termDuration: '',
    processingFee: '',
    processingFeePaidFrom: 'Cash',
  })

  // Input fields mein badlav ko handle karne ke liye function
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Save button ke action ko handle karne ke liye function
  const handleSave = () => {
    console.log('Loan Account Details Saved:', formData)
    setIsOpen(false) // Save karne par modal band ho jayega
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      
      {/* Dialog ka content */}
      <DialogContent className="max-w-4xl w-full mx-auto rounded-lg">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-bold text-gray-800">Add Loan Account</DialogTitle>
        </DialogHeader>

        {/* Modal ka main body section */}
        <div className="space-y-6">
          {/* Form Fields: 2 columns grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Account Name */}
              <div className="space-y-2">
                <Label htmlFor="accountName" className="text-sm font-semibold text-gray-700 flex items-center">
                  Account Name <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="accountName"
                  placeholder="Account Name *"
                  value={formData.accountName}
                  onChange={(e) => handleInputChange('accountName', e.target.value)}
                  className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all duration-200"
                />
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="text-sm font-semibold text-gray-700">
                  Account Number
                </Label>
                <Input
                  id="accountNumber"
                  placeholder="Account Number"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all duration-200"
                />
              </div>

              {/* Current Balance */}
              <div className="space-y-2">
                <Label htmlFor="currentBalance" className="text-sm font-semibold text-gray-700 flex items-center">
                  Current Balance <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="currentBalance"
                  placeholder="Current Balance *"
                  value={formData.currentBalance}
                  onChange={(e) => handleInputChange('currentBalance', e.target.value)}
                  className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all duration-200"
                />
              </div>

              {/* Loan received In */}
              <div className="space-y-2">
                <Label htmlFor="loanReceivedIn" className="text-sm font-semibold text-gray-700">
                  Loan received In
                </Label>
                <Select value={formData.loanReceivedIn} onValueChange={(value) => handleInputChange('loanReceivedIn', value)}>
                  <SelectTrigger className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all duration-200">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <Label htmlFor="interestRate" className="text-sm font-semibold text-gray-700">
                  Interest Rate
                </Label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input
                      id="interestRate"
                      placeholder="Interest Rate"
                      value={formData.interestRate}
                      onChange={(e) => handleInputChange('interestRate', e.target.value)}
                      className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all duration-200"
                    />
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">% per annum</span>
                </div>
              </div>

              {/* Processing Fee */}
              <div className="space-y-2">
                <Label htmlFor="processingFee" className="text-sm font-semibold text-gray-700">
                  Processing Fee
                </Label>
                <Input
                  id="processingFee"
                  placeholder="Processing Fee"
                  value={formData.processingFee}
                  onChange={(e) => handleInputChange('processingFee', e.target.value)}
                  className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all duration-200"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Lender Bank */}
              <div className="space-y-2">
                <Label htmlFor="lenderBank" className="text-sm font-semibold text-gray-700">
                  Lender Bank
                </Label>
                <Input
                  id="lenderBank"
                  placeholder="Lender Bank"
                  value={formData.lenderBank}
                  onChange={(e) => handleInputChange('lenderBank', e.target.value)}
                  className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all duration-200"
                />
              </div>

              {/* Balance as of */}
              <div className="space-y-2">
                <Label htmlFor="balanceAsOf" className="text-sm font-semibold text-gray-700">
                  Balance as of
                </Label>
                <div className="relative">
                  <Input
                    id="balanceAsOf"
                    value={formData.balanceAsOf}
                    onChange={(e) => handleInputChange('balanceAsOf', e.target.value)}
                    className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all duration-200 pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Term Duration */}
              <div className="space-y-2">
                <Label htmlFor="termDuration" className="text-sm font-semibold text-gray-700">
                  Term Duration(in Months)
                </Label>
                <Input
                  id="termDuration"
                  placeholder="Term Duration(in Months)"
                  value={formData.termDuration}
                  onChange={(e) => handleInputChange('termDuration', e.target.value)}
                  className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all duration-200"
                />
              </div>

              {/* Processing Fee Paid from */}
              <div className="space-y-2">
                <Label htmlFor="processingFeePaidFrom" className="text-sm font-semibold text-gray-700">
                  Processing Fee Paid from
                </Label>
                <div className="w-full">
                  <Select value={formData.processingFeePaidFrom} onValueChange={(value) => handleInputChange('processingFeePaidFrom', value)}>
                    <SelectTrigger className="h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md transition-all duration-200 w-full">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="addNewBank">
                        <div className="flex items-center justify-between w-full">
                          <span>ADD NEW BANK ACCOUNT?</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Action Buttons */}
        <DialogFooter className="pt-6 flex justify-end">
          <Button 
            onClick={handleSave}
            className="px-6 py-2 h-10 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-semibold rounded-md"
          >
            SAVE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddLoanAccountModal
