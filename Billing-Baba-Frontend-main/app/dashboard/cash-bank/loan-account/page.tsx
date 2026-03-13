"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Building2, Grid3X3, Calculator, List } from 'lucide-react'
import AddLoanAccountModal from '@/components/dashboard/AddLoanAccountModal'

const LoanAccountPage = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Loan Accounts</h1>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
        </Button>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Main Content */}
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Manage Your Loan Accounts
        </h2>
        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          Add your loan accounts and check all loan transactions at one place
        </p>

        {/* Bank Illustration */}
        <div className="mb-12">
          <div className="mx-auto w-64 h-40 relative">
            <img 
              src="/dashboard/bank/bank.png" 
              alt="Bank Building with Coins" 
              className="w-full h-400px object-contain"
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center bg-blue-100">
                <Grid3X3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>All Loans, One Dashboard</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Easily track business loans kept separate from the daily transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center bg-blue-100">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Auto EMI Calculation with Every Entry</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Add loan details and the system instantly breaks it down into EMIs</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center bg-blue-100">
                <List className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Manual Flexibility</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Add notes, interest details etc. Keeps it flexible for varied use cases</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Loan Account Button */}
        <AddLoanAccountModal>
          <Button size="lg" className="text-white" style={{ backgroundColor: 'var(--primary-red)' }}>
            <Building2 className="h-5 w-5 mr-2" />
            + Add Loan Account
          </Button>
        </AddLoanAccountModal>
      </div>
    </div>
  )
}

export default LoanAccountPage  