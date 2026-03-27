export default function ReportsLoading() {
  return (
    <div className="flex flex-col h-full space-y-6 bg-white p-6 rounded-lg animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center pb-4 border-b">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="flex gap-3">
          <div className="h-9 w-28 bg-gray-200 rounded" />
          <div className="h-9 w-9 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="flex items-center gap-3 p-4 border rounded-lg">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-9 w-36 bg-gray-200 rounded" />
        <div className="h-9 w-52 bg-gray-200 rounded" />
        <div className="h-9 w-36 bg-gray-200 rounded" />
      </div>

      {/* Summary card skeleton */}
      <div className="bg-gray-100 p-5 rounded-lg border space-y-3">
        <div className="h-4 w-36 bg-gray-200 rounded" />
        <div className="h-9 w-48 bg-gray-300 rounded" />
        <div className="flex gap-4">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="border rounded-lg overflow-hidden flex-1">
        {/* Table header */}
        <div className="bg-gray-50 flex gap-4 px-4 py-3 border-b">
          {[120, 80, 100, 80, 90, 90, 80].map((w, i) => (
            <div key={i} className={`h-4 bg-gray-200 rounded`} style={{ width: w }} />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b last:border-0">
            {[120, 80, 100, 80, 90, 90, 80].map((w, j) => (
              <div key={j} className="h-4 bg-gray-100 rounded" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
