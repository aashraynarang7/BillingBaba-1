import React from "react"

export default function DashboardPageSkeleton() {
  const CardSkeleton = () => (
    <div className="rounded-xl bg-card p-6">
      <div className="h-6 w-1/3 rounded-md bg-muted animate-pulse mb-6"></div>
      <div className="flex flex-col xl:flex-row gap-6 items-center">
        <div className="w-full xl:w-2/3 h-48 rounded-lg bg-muted animate-pulse"></div>
        <div className="w-full xl:w-1/3 space-y-4">
          <div className="h-8 w-3/4 rounded-md bg-muted animate-pulse"></div>
          <div className="h-6 w-1/2 rounded-md bg-muted animate-pulse"></div>
          <div className="h-6 w-1/2 rounded-md bg-muted animate-pulse"></div>
        </div>
      </div>
    </div>
  )

  const ListSkeleton = () => (
    <div className="rounded-xl bg-card p-6">
      <div className="h-6 w-1/3 rounded-md bg-muted animate-pulse mb-6"></div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
            <div className="h-4 w-2/3 rounded-md bg-muted animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )

  const StatsSkeleton = () => (
    <div className="rounded-xl bg-card p-6">
      <div className="h-6 w-1/2 rounded-md bg-muted animate-pulse mb-6"></div>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-md bg-muted animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-full rounded-md bg-muted animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="h-10 w-1/4 rounded-md bg-muted animate-pulse"></div>
      <div className="h-6 w-1/2 rounded-md bg-muted animate-pulse"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CardSkeleton />
          <ListSkeleton />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <StatsSkeleton />
          <StatsSkeleton />
        </div>
      </div>
    </div>
  )
}