'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendOtp, verifyOtp } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await sendOtp(phoneNumber)
      setStep('OTP')
    } catch (err) {
      setError('Failed to send OTP. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await verifyOtp(phoneNumber, otp)
      // Save token
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token)
        // Optional user info storage
        localStorage.setItem('user', JSON.stringify(data.user))
        // For legacy/admin check in middleware (if any)
        document.cookie = `admin_auth=true; Path=/; SameSite=Lax`
      }
      router.push('/dashboard/company')
    } catch (err) {
      setError('Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {step === 'PHONE' ? 'Login with Phone' : 'Enter OTP'}
        </h1>

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input
                placeholder="Enter 10 digit number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                type="tel"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">One Time Password</label>
              <Input
                placeholder="Enter 6 digit OTP (123456)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                type="text"
              />
              <p className="text-xs text-gray-500 mt-1">Hint: Use 123456</p>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Verify & Login
            </Button>
            <div className="text-center">
              <button type="button" onClick={() => setStep('PHONE')} className="text-sm text-blue-600 hover:underline">
                Change Phone Number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}


