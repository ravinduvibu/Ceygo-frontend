import { Skeleton, SkeletonText, SkeletonSidebar, SkeletonHeader } from "@/components/Skeleton";

export default function AdminLoading() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
            <SkeletonSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <SkeletonHeader />
                <main className="flex-1 overflow-hidden p-6">
                    <div className="max-w-[1400px] mx-auto space-y-5">

                        {/* KPI cards */}
                        <div className="grid grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="space-y-2">
                                            <SkeletonText className="h-3 w-24" />
                                            <SkeletonText className="h-7 w-20" />
                                        </div>
                                        <SkeletonText className="h-3 w-12 mt-1" />
                                    </div>
                                    <Skeleton className="h-9 w-20" />
                                </div>
                            ))}
                        </div>

                        {/* Chart + Queue */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <div className="mb-5 space-y-2">
                                    <SkeletonText className="h-4 w-64" />
                                    <SkeletonText className="h-3 w-48" />
                                </div>
                                <Skeleton className="w-full h-64 rounded-xl" />
                                <div className="flex justify-center mt-5">
                                    <Skeleton className="h-10 w-32 rounded-xl" />
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="space-y-2">
                                        <SkeletonText className="h-4 w-36" />
                                        <SkeletonText className="h-3 w-28" />
                                    </div>
                                    <Skeleton className="w-5 h-5 rounded-lg" />
                                </div>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                                        <div className="flex items-center space-x-2.5">
                                            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                                            <div className="flex-1 space-y-1.5">
                                                <SkeletonText className="h-3 w-28" />
                                                <SkeletonText className="h-2.5 w-16" />
                                            </div>
                                            <Skeleton className="h-5 w-8 rounded-full" />
                                        </div>
                                        <div className="flex space-x-2">
                                            <Skeleton className="h-5 w-14 rounded-full" />
                                            <Skeleton className="h-5 w-16 rounded-full" />
                                        </div>
                                        <Skeleton className="h-7 w-full rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom row */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center space-y-3">
                                <SkeletonText className="h-4 w-48" />
                                <Skeleton className="h-24 w-40 rounded-full" />
                                <SkeletonText className="h-3 w-40" />
                                <div className="w-full grid grid-cols-3 gap-2">
                                    {[0, 1, 2].map(i => <Skeleton key={i} className="h-12 rounded-xl" />)}
                                </div>
                            </div>
                            <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <SkeletonText className="h-4 w-40 mb-4" />
                                <div className="grid grid-cols-3 gap-3">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                                            <SkeletonText className="h-3 w-20" />
                                            <SkeletonText className="h-6 w-24" />
                                            <SkeletonText className="h-2.5 w-28" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
