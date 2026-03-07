import { Skeleton, SkeletonText } from "@/components/Skeleton";

export default function ForecastingLoading() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-32 rounded-lg" />
                        <Skeleton className="h-7 w-20 rounded" />
                        <SkeletonText className="h-4 w-44" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-9 w-32 rounded-xl" />
                        <Skeleton className="h-9 w-32 rounded-xl" />
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-5">
                {/* Title + filter pills */}
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <SkeletonText className="h-7 w-52" />
                        <SkeletonText className="h-3 w-72" />
                    </div>
                    <div className="flex space-x-3">
                        <Skeleton className="h-10 w-80 rounded-xl" />
                        <Skeleton className="h-10 w-48 rounded-xl" />
                    </div>
                </div>

                {/* Model KPI bar */}
                <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-4">
                            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                            <div className="space-y-2">
                                <SkeletonText className="h-3 w-28" />
                                <SkeletonText className="h-6 w-16" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main chart */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div className="space-y-2">
                            <SkeletonText className="h-4 w-72" />
                            <SkeletonText className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-9 w-40 rounded-xl" />
                    </div>
                    <Skeleton className="w-full h-96 rounded-xl" />
                </div>

                {/* Two charts */}
                <div className="grid grid-cols-2 gap-4">
                    {[0, 1].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="mb-5 space-y-2">
                                <SkeletonText className="h-4 w-48" />
                                <SkeletonText className="h-3 w-64" />
                            </div>
                            <Skeleton className="w-full h-64 rounded-xl" />
                        </div>
                    ))}
                </div>

                {/* Insight cards */}
                <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <Skeleton className="w-8 h-8 rounded-lg" />
                                <Skeleton className="h-5 w-12 rounded-full" />
                            </div>
                            <SkeletonText className="h-4 w-24" />
                            <SkeletonText className="h-3 w-32" />
                            <Skeleton className="h-1.5 w-full rounded-full" />
                            <SkeletonText className="h-3 w-28" />
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                            <div className="space-y-2">
                                <SkeletonText className="h-4 w-56" />
                                <SkeletonText className="h-3 w-96" />
                            </div>
                        </div>
                        <SkeletonText className="h-4 w-40" />
                    </div>
                </div>
            </main>
        </div>
    );
}
