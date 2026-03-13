"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info, Play, CreditCard, Headphones } from 'lucide-react'

interface AddCardMachineModalProps {
  children: React.ReactNode
}

const AddCardMachineModal = ({ children }: AddCardMachineModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('pineLabs')
  const [selectedDevice, setSelectedDevice] = useState('android-pos')
  const [formData, setFormData] = useState({
    machineName: '',
    storeId: '',
    merchantId: '',
    clientId: '',
    securityToken: '',
    appKey: '',
    userName: '',
    deviceSerialNo: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log('Saving card machine:', { selectedProvider, selectedDevice, formData })
    setIsOpen(false)
  }

  const isFormValid = () => {
    if (selectedProvider === 'pineLabs') {
      return formData.machineName && formData.storeId && formData.merchantId && formData.clientId && formData.securityToken
    } else if (selectedProvider === 'phonepe') {
      return formData.machineName && formData.storeId && formData.merchantId && formData.clientId
    } else if (selectedProvider === 'razorpay') {
      return formData.machineName && formData.appKey && formData.userName && formData.deviceSerialNo
    }
    return false
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[900px] h-[700px] m-0 rounded-lg p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            Add Card Machine
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6 overflow-y-auto h-full">
          {/* Payment Provider Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Provider</h3>
            <RadioGroup value={selectedProvider} onValueChange={setSelectedProvider} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div 
                className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedProvider === 'pineLabs' 
                    ? 'border-green-400 bg-gradient-to-r from-green-50 to-green-100 shadow-lg' 
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                }`}
                onClick={() => setSelectedProvider('pineLabs')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      P
                    </div>
                    <span className="font-medium text-sm text-gray-700">PineLabs</span>
                  </div>
                  {selectedProvider === 'pineLabs' && (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>

              <div 
                className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedProvider === 'phonepe' 
                    ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg' 
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
                onClick={() => setSelectedProvider('phonepe')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      पे
                    </div>
                    <span className="font-medium text-sm text-gray-700">PhonePe</span>
                  </div>
                  {selectedProvider === 'phonepe' && (
                    <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>

              <div 
                className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedProvider === 'razorpay' 
                    ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
                onClick={() => setSelectedProvider('razorpay')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      R
                    </div>
                    <span className="font-medium text-sm text-gray-700">Razorpay</span>
                  </div>
                  {selectedProvider === 'razorpay' && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </RadioGroup>

            {/* Device Selection */}
            {selectedProvider === 'pineLabs' && (
              <div className="mt-4">
                <RadioGroup value={selectedDevice} onValueChange={setSelectedDevice}>
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedDevice === 'android-pos' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-gray-600" />
                        </div>
                        <span className="font-medium">Android Smart POS</span>
                      </div>
                      <RadioGroupItem value="android-pos" />
                    </div>
                  </div>
                </RadioGroup>
                <p className="text-sm text-gray-500 mt-2">
                  Currently POS payments are accepted only in Billing Baba POS.
                </p>
              </div>
            )}

            {selectedProvider === 'phonepe' && (
              <div className="mt-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">पे</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-purple-800">
                        Please click on Link Account to fill out the form and authenticate your PhonePe account with Billing Baba. Once authentication is complete, enter the required details below after 24-48 hours to finalize the connection.
                      </p>
                    </div>
                    <Button className="bg-purple-500 text-white hover:bg-purple-600">
                      Link Account
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {selectedProvider === 'razorpay' && (
              <div className="mt-4">
                <RadioGroup value={selectedDevice} onValueChange={setSelectedDevice}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedDevice === 'android-pos' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-12 bg-white rounded border flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                          </div>
                          <span className="font-medium">Android Smart POS</span>
                        </div>
                        <RadioGroupItem value="android-pos" />
                      </div>
                    </div>
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedDevice === 'soundbox' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-12 bg-blue-100 rounded flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                          </div>
                          <span className="font-medium">Dynamic SoundBox</span>
                        </div>
                        <RadioGroupItem value="soundbox" />
                      </div>
                    </div>
                  </div>
                </RadioGroup>
                <p className="text-sm text-gray-500 mt-2">
                  Currently POS payments are accepted only in Billing Baba POS.
                </p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="machineName" className="text-sm font-medium text-gray-700 flex items-center">
                  Machine Display Name <span className="text-red-500 ml-1">*</span>
                  <Info className="h-4 w-4 ml-1 text-gray-400" />
                </Label>
                <Input
                  id="machineName"
                  value={formData.machineName}
                  onChange={(e) => handleInputChange('machineName', e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* PineLabs Fields */}
              {selectedProvider === 'pineLabs' && (
                <>
                  <div>
                    <Label htmlFor="storeId" className="text-sm font-medium text-gray-700 flex items-center">
                      Store ID <span className="text-red-500 ml-1">*</span>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </Label>
                    <Input
                      id="storeId"
                      placeholder="Enter Store ID ..."
                      value={formData.storeId}
                      onChange={(e) => handleInputChange('storeId', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="merchantId" className="text-sm font-medium text-gray-700 flex items-center">
                      Merchant ID <span className="text-red-500 ml-1">*</span>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </Label>
                    <Input
                      id="merchantId"
                      placeholder="Enter Merchant ID ..."
                      value={formData.merchantId}
                      onChange={(e) => handleInputChange('merchantId', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientId" className="text-sm font-medium text-gray-700 flex items-center">
                      Client ID/POS ID <span className="text-red-500 ml-1">*</span>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </Label>
                    <Input
                      id="clientId"
                      placeholder="Enter Client ID/POS ID ..."
                      value={formData.clientId}
                      onChange={(e) => handleInputChange('clientId', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="securityToken" className="text-sm font-medium text-gray-700 flex items-center">
                      Security Token <span className="text-red-500 ml-1">*</span>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </Label>
                    <Input
                      id="securityToken"
                      placeholder="Enter Security token ..."
                      value={formData.securityToken}
                      onChange={(e) => handleInputChange('securityToken', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              {/* PhonePe Fields */}
              {selectedProvider === 'phonepe' && (
                <>
                  <div>
                    <Label htmlFor="storeId" className="text-sm font-medium text-gray-700 flex items-center">
                      Store ID <span className="text-red-500 ml-1">*</span>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </Label>
                    <Input
                      id="storeId"
                      placeholder="Enter Store ID ..."
                      value={formData.storeId}
                      onChange={(e) => handleInputChange('storeId', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="merchantId" className="text-sm font-medium text-gray-700 flex items-center">
                      Merchant ID <span className="text-red-500 ml-1">*</span>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </Label>
                    <Input
                      id="merchantId"
                      placeholder="Enter Merchant ID ..."
                      value={formData.merchantId}
                      onChange={(e) => handleInputChange('merchantId', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientId" className="text-sm font-medium text-gray-700 flex items-center">
                      Client ID/POS ID <span className="text-red-500 ml-1">*</span>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </Label>
                    <Input
                      id="clientId"
                      placeholder="Enter Client ID/POS ID ..."
                      value={formData.clientId}
                      onChange={(e) => handleInputChange('clientId', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              {/* Razorpay Fields */}
              {selectedProvider === 'razorpay' && (
                <>
                  <div>
                    <Label htmlFor="appKey" className="text-sm font-medium text-gray-700 flex items-center">
                      APP KEY <span className="text-red-500 ml-1">*</span>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </Label>
                    <Input
                      id="appKey"
                      placeholder="Enter app key."
                      value={formData.appKey}
                      onChange={(e) => handleInputChange('appKey', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="userName" className="text-sm font-medium text-gray-700 flex items-center">
                      User Name <span className="text-red-500 ml-1">*</span>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </Label>
                    <Input
                      id="userName"
                      placeholder="Enter 10 digit no."
                      value={formData.userName}
                      onChange={(e) => handleInputChange('userName', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="deviceSerialNo" className="text-sm font-medium text-gray-700 flex items-center">
                      Device Serial No <span className="text-red-500 ml-1">*</span>
                      <Info className="h-4 w-4 ml-1 text-gray-400" />
                    </Label>
                    <Input
                      id="deviceSerialNo"
                      placeholder="Enter 10 digit no."
                      value={formData.deviceSerialNo}
                      onChange={(e) => handleInputChange('deviceSerialNo', e.target.value)}
                      className="mt-1"
                    />
                    <div className="mt-1">
                      <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700 text-xs">
                        <Play className="h-3 w-3 mr-1" />
                        How to find a serial no.?
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Info Alert */}
          <Alert className="bg-orange-50 border-orange-200">
            <Headphones className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              {selectedProvider === 'pineLabs' && "If you do not have the above details handy, please reach out to Pinelab team to get the details."}
              {selectedProvider === 'phonepe' && "If you do not have the above details handy, please reach out to PhonePe team to get the details."}
              {selectedProvider === 'razorpay' && "If you do not have the above details handy, please reach out to Razorpay's team to get the details."}
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 space-y-4">
            {/* Top Row - Two Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center justify-center space-x-2 flex-1 min-w-0">
                <Play className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm sm:text-base truncate">Watch Setup Video</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 border-blue-200 flex-1 min-w-0">
                <CreditCard className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm sm:text-base truncate">Get Certified POS Machine</span>
              </Button>
            </div>
            
            {/* Bottom Row - Save Button */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSave}
                disabled={!isFormValid()}
                className={`px-8 font-medium ${
                  isFormValid() 
                    ? 'text-white hover:opacity-90 border-0' 
                    : 'bg-red-700 text-white cursor-not-allowed'
                }`}
                style={isFormValid() ? { 
                  backgroundColor: 'var(--primary-red)',
                  borderColor: 'var(--primary-red)'
                } : {}}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddCardMachineModal
