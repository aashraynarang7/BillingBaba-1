export default function DashboardLoading() {
    return (
        <div className="p-6 space-y-4 animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded-md" />
            <div className="h-32 w-full bg-gray-100 rounded-xl" />
            <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-12 w-full bg-gray-100 rounded-lg" />
                ))}
            </div>
        </div>
    );
}
