"use client"

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const SyncShareBackupContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams.get('view')

  useEffect(() => {
    if (view === 'sync-share') {
      router.replace('/dashboard/sync-share-backup/sync-share')
    } else if (view === 'auto-backup' || view === 'backup-computer' || view === 'backup-drive' || view === 'restore-backup') {
      // For other backup views, redirect to settings
      router.replace('/dashboard/setting')
    } else {
      // Default to sync-share if no view specified
      router.replace('/dashboard/sync-share-backup/sync-share')
    }
  }, [view, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}

const SyncShareBackupPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SyncShareBackupContent />
    </Suspense>
  )
}

export default SyncShareBackupPage
