"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, FileText, Plus } from 'lucide-react'

const ChequesPage = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Cheque Details</h1>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
        </Button>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Empty State */}
      <Card>
        <CardContent className="py-16">
          <div className="text-center">
            {/* Cheque Icon */}
            <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--background-section-gray)' }}>
              <div className="relative">
                <FileText className="h-8 w-8" style={{ color: 'var(--secondary-blue)' }} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-200 rounded-sm"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-200 rounded-sm"></div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              No Cheques to Show
            </h3>
            <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
              You haven't added any Cheque transactions yet.
            </p>
            
            <Button size="lg" className="text-white" style={{ backgroundColor: 'var(--primary-red)' }}>
              <Plus className="h-5 w-5 mr-2" />
              Add Cheque
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChequesPage