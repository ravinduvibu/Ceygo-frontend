import { Skeleton, SkeletonText, SkeletonSidebar, SkeletonHeader } from "@/components/Skeleton";

export default function DashboardLoading() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
            <SkeletonSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <SkeletonHeader />
                <main className="flex-1 overflow-hidden p-6">
                    <div className="max-w-[1400px] mx-auto space-y-5">

                        {/* Search bar */}
                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                            <div className="flex items-center space-x-3">
                                <Skeleton className="flex-1 h-11 rounded-xl" />
                                <Skeleton className="h-11 w-32 rounded-xl" />
                                <Skeleton className="h-11 w-28 rounded-xl" />
                                <Skeleton className="h-11 w-24 rounded-xl" />
                            </div>
                        </div>

                        {/* Journeys + Services */}
                        <div className="grid grid-cols-3 gap-5">
                            {/* Journeys */}
                            <div className="col-span-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="space-y-2">
                                        <SkeletonText className="h-4 w-40" />
                                        <SkeletonText className="h-3 w-32" />
                                    </div>
                                    <Skeleton className="w-5 h-5 rounded" />
                                </div>
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                                            <div className="flex-1 space-y-1.5">
                                                <SkeletonText className="h-3 w-full" />
                                                <SkeletonText className="h-2.5 w-24" />
                                                <div className="flex space-x-2 mt-1.5">
                                                    <Skeleton className="h-4 w-20 rounded-full" />
                                                    <Skeleton className="h-4 w-20 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                        <Skeleton className="h-8 w-full rounded-xl" />
                                    </div>
                                ))}
                            </div>

                            {/* Services */}
                            <div className="col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="space-y-2">
                                        <SkeletonText className="h-4 w-56" />
                                        <SkeletonText className="h-3 w-40" />
                                    </div>
                                    <SkeletonText className="h-3 w-36" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2.5">
                                            <div className="flex items-start justify-between">
                                                <Skeleton className="w-12 h-12 rounded-xl" />
                                                <Skeleton className="h-5 w-16 rounded-full" />
                                            </div>
                                            <SkeletonText className="h-3 w-full" />
                                            <SkeletonText className="h-2.5 w-3/4" />
                                            <div className="flex space-x-1">
                                                {[0, 1, 2, 3, 4].map(s => <Skeleton key={s} className="w-3 h-3 rounded-full" />)}
                                                <SkeletonText className="h-3 w-8 ml-1" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <SkeletonText className="h-3.5 w-20" />
                                                    <SkeletonText className="h-2.5 w-36" />
                                                </div>
                                                <Skeleton className="h-5 w-16 rounded-full" />
                                            </div>
                                            <Skeleton className="h-8 w-full rounded-xl" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            {/* Chatbot skeleton */}
            <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                <Skeleton className="h-14 w-full rounded-none" />
                <div className="p-3 space-y-2 bg-slate-50" style={{ height: 160 }}>
                    <div className="flex justify-start">
                        <Skeleton className="h-14 w-56 rounded-xl rounded-tl-sm" />
                    </div>
                    <div className="flex justify-end">
                        <Skeleton className="h-8 w-40 rounded-xl rounded-tr-sm" />
                    </div>
                    <div className="flex justify-start">
                        <Skeleton className="h-16 w-60 rounded-xl rounded-tl-sm" />
                    </div>
                </div>
                <div className="p-3 border-t flex space-x-2">
                    <Skeleton className="flex-1 h-9 rounded-xl" />
                    <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
                </div>
            </div>
        </div>
    );
}
